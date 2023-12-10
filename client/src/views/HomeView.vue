<template>
  <div class="h-screen relative">
    <GeoErrorModal
      v-if="geoError"
      :geoErrorMsg="geoErrorMsg"
      @closeGeoError="closeGeoError"
    />
    <MapFeatures
      :coords="coords"
      :fetchCoords="fetchCoords"
      @getGeolocation="getGeolocation"
    />
    <div id="map" class="h-full z-[1]"></div>
  </div>
</template>

<script>
// import Leaflet library
import GeoErrorModal from "@/components/GeoErrorModal.vue";
import MapFeatures from "@/components/MapFeatures.vue";
import leaflet from "leaflet";
import { onMounted, ref } from "vue";

export default {
  name: "HomeView",
  setup() {
    let map;
    onMounted(() => {
      // init map
      map = leaflet.map("map").setView([31.450462, -83.5085], 10);
      // add Tile layer
      leaflet
        .tileLayer(
          `https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${process.env.VUE_APP_API_KEY}`,
          {
            attribution:
              '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 18,
            id: "mapbox/streets-v11",
            tileSize: 512,
            zoomOffset: -1,
            accessToken: process.env.VUE_APP_API_KEY,
          }
        )
        .addTo(map);
      getGeolocation();
    });
    // user coords
    const coords = ref(null);
    // for loading
    const fetchCoords = ref(null);
    // user location marker
    const geomarker = ref(null);
    const geoError = ref(null);
    const geoErrorMsg = ref("Testing modal");
    const getGeolocation = () => {
      // if function is called, only run if we dont have coords
      if (!coords.value) {
        // check to see if we have coods in session sotrage
        if (sessionStorage.getItem("coords")) {
          coords.value = JSON.parse(sessionStorage.getItem("coords"));
          plotGeolocation(coords.value);
          return;
        }

        // else get coords from geolocation API
        fetchCoords.value = true;
        navigator.geolocation.getCurrentPosition(setCoords, getLocError);
        return;
      }

      // otherwise, remove location
      coords.value = null;
      sessionStorage.removeItem("coords");
      map.removeLayer(geomarker.value);
    };

    const setCoords = (pos) => {
      // stop fetching coords
      fetchCoords.value = null;
      // store user location in session storage
      const setSessionCoords = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      };
      sessionStorage.setItem("coords", JSON.stringify(setSessionCoords));
      // update coords value
      coords.value = setSessionCoords;
      // render user location marker
      plotGeolocation(coords.value);
    };
    const getLocError = (err) => {
      fetchCoords.value = null;
      geoError.value = true;
      geoErrorMsg.value = err.message;
    };
    const closeGeoError = () => {
      geoError.value = null;
      geoErrorMsg.value = null;
    };
    // plot user location on map
    const plotGeolocation = (coords) => {
      // create custom marker
      const customMarker = leaflet.icon({
        iconUrl: require("../assets/map-marker-red.svg"),
        // width and height
        iconSize: [35, 35],
      });
      // create new marker with coords and icon
      geomarker.value = leaflet
        // set marker location
        .marker([coords.lat, coords.lng], {
          icon: customMarker,
        })
        // add marker to map
        .addTo(map);
      // set map view to current location
      map.setView([coords.lat, coords.lng], 10);
    };
    return {
      coords,
      fetchCoords,
      geomarker,
      closeGeoError,
      geoError,
      geoErrorMsg,
      getGeolocation,
    };
  },
  components: { GeoErrorModal, MapFeatures },
};
</script>

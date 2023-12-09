<template>
  <div class="h-screen relative">
    <div id="map" class="h-full z-[1]"></div>
  </div>
</template>

<script>
// import Leaflet library
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

    const getGeolocation = () => {
      // start fetching coords
      fetchCoords.value = true;
      navigator.geolocation.getCurrentPosition(setCoords, getLocError);
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
      console.log(err);
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

    return { coords, geomarker };
  },
};
</script>

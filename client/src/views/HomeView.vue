<template>
  <div class="h-screen relative">
    <div id="map" class="h-full z-[1]"></div>
  </div>
</template>

<script>
// import Leaflet library
import leaflet from "leaflet";
import { onMounted } from "vue";

export default {
  name: "HomeView",
  setup() {
    let map;
    onMounted(() => {
      // init map
      map = leaflet.map("map").setView([28.538336, -81.379234], 10);

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
    });
  },
};
</script>

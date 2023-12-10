<template>
  <div
    class="w-full md:w-auto absolute md:top-[40px] md:left-[60px] z-[2] flex gap-4 px-6 py-8 md:px-0 md:py-0 bg-transparent"
  >
    <!-- Search -->
    <div class="relative flex-1 md:min-w-[350px]">
      <!-- Input Field -->
      <input
        type="text"
        class="pl-9 pr-4 py-3 text-sm focus:outline-slate-600 w-full shadow-md rounded-md"
        placeholder="Search your favorite spot..."
        v-model="searchQuery"
        @input="search"
        @focus="$emit('toggleSearchResults')"
      />

      <!-- Search Icon -->
      <div class="absolute top-0 left-[8px] h-full flex items-center">
        <i class="fas fa-search"></i>
      </div>

      <!-- Search Results Container -->
      <div class="absolute mt-2 w-full" v-if="searchQuery && searchResults">
        <!-- Loading Spinner -->
        <div class="h-[200px] overflow-scroll bg-white rounded-md">
          <LoadingSpinner v-if="!searchData" />
          <div v-else>
            <div
              class="px-4 py-2 flex gap-x-2 cursor-pointer hover:bg-slate-600 hover:text-white"
              v-for="(result, index) in searchData"
              :key="index"
              @click="selectResult(result)"
            >
              <i class="fas fa-map-marker-alt"></i>
              <p class="text-xs">{{ result.place_name_en }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Geolocation -->
    <div
      class="px-4 bg-white flex items-center shadow-md rounded-md min-h-[45px]"
      @click="$emit('getGeolocation')"
      :class="{ 'bg-[#404c60]': coords }"
    >
      <i
        class="fas fa-location-arrow text-slate-600 text-[18px]"
        :class="{ 'text-white': coords, 'animate-pulse': fetchCoords }"
      ></i>
    </div>
  </div>
</template>

<script>
import LoadingSpinner from "./LoadingSpinner.vue";
import { ref } from "vue";
import axios from "axios";

export default {
  components: { LoadingSpinner },
  props: ["coords", "fetchCoords", "searchResults"],
  setup(props, { emit }) {
    const searchQuery = ref(null);
    const searchData = ref(null);
    const queryTimeout = ref(null);

    const search = () => {
      // clear previous timeout
      clearTimeout(queryTimeout.value);

      queryTimeout.value = setTimeout(async () => {
        if (searchQuery.value !== "") {
          const params = new URLSearchParams({
            // params from mapbox
            fuzzyMatch: true,
            language: "en",
            limit: 10,
            proximity: props.coords
              ? `${props.coords.lng}, ${props.coords.lat}`
              : "0, 0",
          });

          // request
          const getData = await axios.get(
            `http://localhost:9000/api/search/${searchQuery.value}?${params}`
          );

          // set searchData to relevant axios result
          searchData.value = getData.data.features;
          console.log(searchData.value);
        } else {
          searchData.value = null;
        }
      }, 200);
    };

    const selectResult = (result) => {
      emit("plotResult", result.geometry);
    };

    return { searchQuery, searchData, queryTimeout, search, selectResult };
  },
};
</script>

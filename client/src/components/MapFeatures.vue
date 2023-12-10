<template>
  <div
    class="w-full md:w-auto absolute md:top-[40px] md:left-[60px] z-[2] flex gap-4 px-6 py-8 md:px-0 md:py-0 bg-transparent"
  >
    <!-- Search -->
    <div class="relative flex-1 md:min-w-[350px]">
      <input
        type="text"
        class="pl-9 pr-4 py-3 text-sm focus:outline-slate-600 w-full shadow-md rounded-md"
        placeholder="Search your favorite spot..."
      />

      <div class="absolute top-0 left-[8px] h-full flex items-center">
        <i class="fas fa-search"></i>
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
export default {
  props: ["coords", "fetchCoords"],
};
</script>

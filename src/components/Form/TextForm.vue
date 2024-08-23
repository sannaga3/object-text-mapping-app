<script setup>
import { ringList } from "../../constants.ts";
import InputLabel from "./InputLabel.vue";

const text = defineModel("text");
const displayMethod = defineModel("displayMethod");
const isSetBackground = defineModel("isSetBackground");
const selectedRing = defineModel("selectedRing");
</script>

<template>
  <div class="container w-1/5 bg-indigo-300 rounded-lg px-5 pt-2 pb-4">
    <div class="mx-auto">
      <div>
        <InputLabel
          for="text"
          class="pb-1 text-sm text-gray-600"
          value="Text"
        />
        <input
          type="text"
          v-model="text"
          class="w-full bg-white bg-opacity-50 rounded border focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 transition-colors duration-200 ease-in-out"
          maxlength="10"
        />
      </div>
    </div>
    <div class="mt-4">
      <InputLabel
        for="displayMethod"
        class="pb-1 text-sm text-gray-600"
        value="Display Method"
      />
      <div class="flex items-center space-x-2">
        <input type="radio" v-model="displayMethod" value="inside" />
        <div>inside</div>
      </div>
      <div class="flex items-center space-x-2">
        <input type="radio" v-model="displayMethod" value="outside" />
        <div>outside</div>
      </div>
    </div>
    <div class="mt-4">
      <InputLabel
        for="displayMethod"
        class="pb-1 text-sm text-gray-600"
        value="Set Background"
      />
      <div>
        <input
          type="checkbox"
          v-model="isSetBackground"
          :checked="isSetBackground ? true : false"
        />
      </div>
    </div>
    <div class="mt-4">
      <InputLabel
        for="selectedRing"
        class="pb-1 text-sm text-gray-600"
        value="Ring Type"
      />
      <div
        v-for="(ringName, index) in ringList"
        :key="index"
        class="flex items-center space-x-2"
      >
        <input type="radio" v-model="selectedRing" :value="ringName" />
        <div>{{ ringName }}</div>
      </div>
    </div>
  </div>
</template>

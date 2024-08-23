<script setup lang="ts">
import { ref } from "vue";
import TextForm from "./components/Form/TextForm.vue";
import Scene from "./components/Objects/Threejs/Scene.vue";
import { ringList } from "./constants.ts";

const type = ref("threejs");

// モデルにマッピングするテキスト
const text = ref("");
// 背景設定の有無
const isSetBackground = ref(false);
// テキストをマッピングする位置（内外）
const displayMethod = ref("outside");

// 表示するモデル
const selectedRing = ref(ringList[0]);
</script>

<template>
  <div class="flex flex-col items-start p-10">
    <div class="absolute w-full">
      <TextForm
        v-model:text="text"
        v-model:displayMethod="displayMethod"
        v-model:isSetBackground="isSetBackground"
        v-model:selectedRing="selectedRing"
      />
    </div>
    <!-- TresJsでは１文字ずつ３Dテキストをレンダリングできない -->
    <!-- <div v-if="type === 'tresjs'" class="w-96 mx-auto">
      <CanvasTres :text="text" />
    </div> -->
    <div v-if="type === 'threejs'" class="w-96 mx-auto mt-10">
      <Scene
        :text="text"
        :displayMethod="displayMethod"
        :isSetBackground="isSetBackground"
        :selectedRing="selectedRing"
      />
    </div>
  </div>
</template>

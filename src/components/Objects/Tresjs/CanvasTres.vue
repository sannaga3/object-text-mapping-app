<script setup lang="ts">
import { OrbitControls, Stars } from "@tresjs/cientos";
import { TresCanvas, useRenderLoop } from "@tresjs/core";
import { BasicShadowMap, NoToneMapping, SRGBColorSpace } from "three";
import { shallowRef } from "vue";
import Item from "./Item.vue";
import Stand from "./Stand.vue";
import Text from "./Text.vue";

const { text } = defineProps({
  text: String,
});

// 基本設定
const gl = {
  clearColor: "#000000",
  shadows: true,
  alpha: false,
  shadowMapType: BasicShadowMap,
  outputColorSpace: SRGBColorSpace,
  toneMapping: NoToneMapping,
};

// 背景の移動速度
const yRotation = shallowRef(0);
useRenderLoop().onLoop(({ delta }) => {
  yRotation.value += 0.05 * delta;
});
</script>

<template>
  <div class="relative w-96 h-96 rounded-lg overflow-hidden">
    <TresCanvas v-bind="gl">
      <!-- 視点カメラ -->
      <TresPerspectiveCamera :position="[1, 1, -10]" />
      <!-- 視点コントロール -->
      <OrbitControls />
      <!-- 背景のパーティクル -->
      <Stars
        :rotation="[0, yRotation, 0]"
        :radius="50"
        :depth="50"
        :count="5000"
        :size="0.5"
        :size-attenuation="true"
      />
      <!-- 光源 -->
      <TresDirectionalLight :position="[2, 3, 2]" :intensity="3" cast-shadow />
      <TresDirectionalLight
        :position="[-2, 3, -2]"
        :intensity="3"
        cast-shadow
      />
      <TresDirectionalLight :position="[2, 3, -2]" :intensity="3" cast-shadow />
      <TresDirectionalLight :position="[-2, 3, 2]" :intensity="3" cast-shadow />

      <!-- テキスト -->
      <Text v-if="text.length > 0" :text="text" />
      <!-- オブジェクト -->
      <Item />
      <!-- オブジェクトの台 -->
      <Stand />
    </TresCanvas>
  </div>
</template>

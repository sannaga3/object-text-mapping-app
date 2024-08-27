<!-- １文字ずつ３Dテキストで表示できない為、一旦お蔵入り パターン1 -->

<!-- <script setup lang="ts">
import { ref, watch, computed } from "vue";
import { Text3D } from "@tresjs/cientos";

const props = defineProps({
  text: String,
});

const reactiveText = computed(() => props.text);
const textArray = ref([""]);

const textPositions = ref([0, 0, 0]);

watch(
  reactiveText,
  (newText) => {
    textArray.value[0] = newText;
  },
  { immediate: true }
);
</script>

<template>
  <Suspense>
    <div v-for="(text, index) in textArray.value" :key="index">
      <Text3D
        :text="reactiveText"
        font="https://raw.githubusercontent.com/Tresjs/assets/main/fonts/FiraCodeRegular.json"
        center
        need-updates
        :positions="textPositions"
        :rotation="[0, 110, 0]"
      >
        <TresMeshNormalMaterial />
      </Text3D>
    </div>
  </Suspense>
</template> -->

<!-- パターン2 -->
<!-- <script setup lang="ts">
import { extend } from "@tresjs/core";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { onMounted, ref, watch } from "vue";

extend({ TextGeometry });

const props = defineProps({
  text: String,
});

const font = ref(null);
const reactiveText = ref(props.text);

const fontPath =
  "https://raw.githubusercontent.com/Tresjs/assets/main/fonts/FiraCodeRegular.json";

onMounted(() => {
  const loader = new FontLoader();
  loader.load(fontPath, (loadedFont) => {
    font.value = loadedFont;
  });
});

watch(
  () => props.text,
  (newText) => {
    reactiveText.value = newText;
  }
);

const fontOptions = {
  size: 0.5,
  depth: 0.2,
  curveSegments: 5,
  bevelEnabled: true,
  bevelThickness: 0.05,
  bevelSize: 0.02,
  bevelOffset: 0,
  bevelSegments: 4,
};
</script>

<template>
  <Suspense>
    <TresMesh v-if="font">
      <TresTextGeometry
        :args="[reactiveText, { font: font, ...fontOptions }]"
      />
      <TresMeshStandardMaterial />
    </TresMesh>
  </Suspense>
</template> -->

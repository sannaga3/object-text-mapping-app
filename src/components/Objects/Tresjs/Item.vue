<script setup>
import { GLTFModel } from "@tresjs/cientos";

const ringUrl = "/public/ring.glb";
</script>

<template>
  <Suspense>
    <GLTFModel
      :path="ringUrl"
      :position="[0, 0, 0]"
      :draco="true"
      :decoderPath="'https://www.gstatic.com/draco/versioned/decoders/1.4.1/'"
      :castShadow="false"
      :receiveShadow="false"
      :scale="2"
    />
  </Suspense>
</template>

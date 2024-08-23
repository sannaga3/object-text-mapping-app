<script setup lang="ts">
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { Font, FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { onMounted, ref, watchEffect } from "vue";
import {
  addDirectionLight,
  addParticles,
  addStand,
  createCharMesh,
  formatText,
  loadEnvironment,
  loadModel,
  updateCameraPosition,
} from "./util";

const container = ref(null);

const props = defineProps<{
  text: string;
  displayMethod: string;
  isSetBackground: boolean;
  selectedRing: string;
}>();

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
camera.position.set(0, 1, -5);

// 環境光源
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

// ディレクショナルライト(４方向からモデルを照らす)
addDirectionLight(0xffffff, 1, [5, 5, 5], scene);
addDirectionLight(0xffffff, 2, [5, 5, -5], scene);
addDirectionLight(0xffffff, 0.5, [-5, 5, -5], scene);
addDirectionLight(0xffffff, 0.5, [-5, 5, -5], scene);

const fontLoader = new FontLoader();
let textMeshes: THREE.Mesh[] = [];

const createText = (text: string, displayMethod: string) => {
  // 既存のテキストメッシュを削除
  textMeshes.forEach((mesh) => {
    scene.remove(mesh);
    mesh.geometry.dispose();
    const material = mesh.material as THREE.Material; // meshは単一のmaterial
    material.dispose();
  });
  textMeshes = [];

  fontLoader.load(
    "https://raw.githubusercontent.com/Tresjs/assets/main/fonts/FiraCodeRegular.json",
    (font: Font) => {
      for (let i = 0; i < text.length; i++) {
        const char = text[i];

        // ジオメトリ生成
        const charGeometry = new TextGeometry(char, {
          font: font,
          size: 0.15,
          depth: 0, // 文字の奥行き
          curveSegments: 5,
          bevelEnabled: true,
          bevelThickness: 0.00001,
          bevelSize: 0, // 線の縁の厚さ
          bevelOffset: 0,
          bevelSegments: 4,
        });

        // メッシュの生成と表示位置の設定
        const charMesh = createCharMesh(
          displayMethod,
          text.length,
          charGeometry,
          i
        );

        scene.add(charMesh);
        textMeshes.push(charMesh);
      }
    }
  );
};

watchEffect(async () => {
  // isSetBackgroundを元に背景の設定変更
  loadEnvironment(scene, props.isSetBackground);
  // モデルの変更
  loadModel(scene, props.selectedRing);
  // モデルにマッピングするtextの更新
  // 文字間隔を固定する為、textが10文字以下の場合は空文字で埋める
  createText(formatText(props), props.displayMethod);
  // DOMにレンダラーを追加
  container.value?.appendChild(renderer.domElement);
  // 文字数とdisplayMethodに合わせてカメラの位置変更
  updateCameraPosition(props.text.length, props.displayMethod, camera);
});

// レンダラーの設定
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(400, 400);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// カメラコントロール
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// コンポーネントがマウントされたらレンダラーをDOMに追加
onMounted(() => {
  container.value?.appendChild(renderer.domElement);
  // パーティクルを追加
  const updateParticles = addParticles(scene);
  loadEnvironment(scene, props.isSetBackground);
  // モデルをロード
  loadModel(scene, props.selectedRing);
  // スタンドを追加
  addStand(scene);

  // アニメーションループ
  const animate = () => {
    controls.update();
    updateParticles();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  };

  animate();
});
</script>

<template>
  <div
    ref="container"
    class="relative w-96 h-96 rounded-lg overflow-hidden"
  ></div>
</template>

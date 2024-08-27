import * as THREE from "three";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

let table: THREE.Object3D | null = null;
let background: THREE.DataTexture | null = null;

const gltfLoader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
gltfLoader.setDRACOLoader(dracoLoader);

const formatText = ({
  text,
  displayMethod,
}: {
  text: string;
  displayMethod: string;
}) => {
  if (displayMethod === "outside") return text.padStart(10, " ");
  return text.padEnd(10, " ");
};

const addDirectionLight = (
  color: number,
  size: number,
  position: Array<number>,
  scene: THREE.Scene
) => {
  const [x, y, z] = position;

  const light = new THREE.DirectionalLight(color, size);
  light.position.set(x, y, z);

  scene.add(light);
};

const loadEnvironment = (scene: THREE.Scene, isSetBackground: boolean) => {
  // 環境テクスチャを適用させるためのオブジェクト(見えない位置に配置)
  const geometry = new THREE.ConeGeometry(1, 1, 16);
  const material = new THREE.MeshStandardMaterial({
    metalness: 1.0,
    roughness: 0.2,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.y = -10;
  scene.add(mesh);

  const rgbeLoader = new RGBELoader();
  rgbeLoader.load("aft_lounge_2k.hdr", function (texture: THREE.DataTexture) {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    if (!background) background = texture;

    // シーンの背景と反射にHDR環境マップを使用、テーブルを追加
    if (isSetBackground) {
      scene.background = background;
      if (!table) {
        gltfLoader.load("/table.glb", (gltf: GLTF) => {
          table = gltf.scene;
          table!.scale.set(1, 1, 1);
          scene.add(table as THREE.Object3D);
        });
      }
    } else {
      scene.background = null;
      scene.remove(table as THREE.Object3D);
      table = null;
    }

    scene.environment = texture;
  });
};

const createCharMesh = (
  displayMethod: string,
  textLen: number,
  charGeometry: TextGeometry,
  index: number
) => {
  const charMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
  const charMesh = new THREE.Mesh(charGeometry, charMaterial);

  // 文字の位置がリングの外側or内側
  if (displayMethod === "outside") {
    const radius = 1; // 文字を配置する円の大きさ（リングの外周と一致させる）
    const startAngle = -13.2; // 文字表示の開始位置
    // 角度と文字間隔
    const angleOffset = Math.PI / textLen / 2.3;
    const angle = -index * angleOffset - startAngle;

    // 文字を円周上に配置
    charMesh.position.x = radius * Math.cos(angle);
    charMesh.position.y = 0.11;
    charMesh.position.z = radius * Math.sin(angle);

    // 文字を円の中心に向けて回転
    charMesh.rotation.y = -angle - 55;

    return charMesh;
  } else {
    const radius = 0.9;
    const startAngle = 5.3;
    const angleOffset = -Math.PI / textLen / 2.3;
    const angle = -index * angleOffset - startAngle;

    charMesh.position.x = radius * Math.cos(angle);
    charMesh.position.y = 0.12;
    charMesh.position.z = radius * Math.sin(angle);

    charMesh.rotation.y = -angle - 30;

    charMesh.scale.x = -1;

    return charMesh;
  }
};

const updateCameraPosition = (
  textLen: number,
  displayMethod: string,
  camera: THREE.PerspectiveCamera
) => {
  if (displayMethod === "outside") {
    if (textLen > 5) camera.position.set(5, 1, 0);
    else if (textLen > 0) camera.position.set(3, -0.5, -1);
    else camera.position.set(0, 1, -5);
  } else {
    if (textLen > 0) camera.position.set(0, 2, -2.5);
    else camera.position.set(0, 1, -5);
  }
};

const loadModel = (scene: THREE.Scene, selectedRing: string) => {
  gltfLoader.load(`/ring_${selectedRing}.glb`, (gltf: GLTF) => {
    const ring = gltf.scene;

    // 子オブジェクトを格納する配列を初期化
    const children: Array<THREE.Mesh> = [];

    ring.traverse((child: THREE.Object3D) => {
      if (child instanceof THREE.Mesh) {
        children.push(child as THREE.Mesh);
      }
    });

    // BlenderのグラスBSDFが反映されない為、ダイヤモンドのマテリアルは手動で設定
    children[1].material = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.9,
      opacity: 1,
      metalness: 0,
      roughness: 0,
      ior: 2.4175,
      thickness: 10,
      specularIntensity: 1,
      specularColor: 0xffffff,
      dispersion: 5,
    });

    ring.scale.set(1, 1, 1);
    scene.add(ring);
  });
};

const addStand = (scene: THREE.Scene) => {
  const geometry = new THREE.CylinderGeometry(1.5, 1.5, 0.4, 10);
  const material = new THREE.MeshPhongMaterial({ color: "#696969" });
  const cylinder = new THREE.Mesh(geometry, material);
  cylinder.position.set(0, -0.7, 0);
  scene.add(cylinder);
};

const addParticles = (scene: THREE.Scene) => {
  const particleCount = 1000;
  const geometry = new THREE.BufferGeometry();
  // particle毎にxyzの値が必要な為、要素数は * 3
  const particlePositions = new Float32Array(particleCount * 3);
  // 各パーティクルの速度
  const velocities = 0.002;

  // パーティクルの位置情報作成
  for (let i = 0; i < particleCount; i++) {
    // 円の半径（カメラより近くにはパーティクルを配置しない）
    const radius = Math.random() * 10 + 6;

    // パーティクルを個別に位置指定
    const angle = (i / particleCount) * Math.PI * Math.random() * 5; // 円周上(Y軸固定)の均等配置を基準に少しずらす

    particlePositions[i * 3] = radius * Math.cos(angle); // X座標
    particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 40; // Y座標
    particlePositions[i * 3 + 2] = radius * Math.sin(angle); // Z座標
  }

  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(particlePositions, 3)
  );

  const particle = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.15,
    sizeAttenuation: true,
  });

  const points = new THREE.Points(geometry, particle);
  scene.add(points);

  // パーティクルを動かし続ける関数
  const updateParticles = () => {
    const positions = geometry.attributes.position.array;
    for (let i = 0; i < particleCount; i++) {
      const x = positions[i * 3];
      const z = positions[i * 3 + 2];

      // Y軸を中心に回転
      const angle = Math.atan2(z, x) - velocities;
      const radius = Math.sqrt(x * x + z * z);

      positions[i * 3] = radius * Math.cos(angle); // X軸
      positions[i * 3 + 2] = radius * Math.sin(angle); // Z軸
    }

    geometry.attributes.position.needsUpdate = true;
  };

  // animate関数内でupdateParticles呼び出す
  return updateParticles;
};

export {
  addDirectionLight,
  addParticles,
  addStand,
  createCharMesh,
  formatText,
  loadEnvironment,
  loadModel,
  updateCameraPosition,
};

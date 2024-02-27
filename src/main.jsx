import * as THREE from "three";
import "./index.css";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader";
import { FBXLoader } from "three/addons/loaders/FBXLoader";

const scene = new THREE.Scene();

const fbxLoader = new FBXLoader();
fbxLoader.load(
  "/HutForUnity.fbx",
  (object) => {
    console.log(object);
    object.scale.set(0.1, 0.1, 0.1);
    scene.add(object);
  },
  (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  (error) => {
    console.log(error);
  }
);

const spotlight = new THREE.SpotLight(0xffffff, 1000, 100);
scene.add(spotlight);
spotlight.position.set(500, 500, 500);
spotlight.rotation.set(90, 90, 90);
scene.background = new THREE.Color(0x111111);

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
// camera.position.x = 0;
camera.position.z = 500;
// camera.position.y = 10;
// camera.rotation.x = 180;
// camera.rotation.z = 90;

scene.add(camera);

const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.render(scene, camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
// controls.enablePan = false;
// controls.enableZoom = false;
// controls.autoRotate = true;
controls.autoRotateSpeed = 5;

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const loop = () => {
  renderer.render(scene, camera);
  requestAnimationFrame(loop);
  controls.update();
};

loop();

const tl = gsap.timeline({
  defaults: {
    duration: 1,
  },
});

// tl.fromTo(object.scale, {x:0, y: 0, z:0 }, {x: 1, y: 1, z: 1 });
tl.fromTo(
  "nav",
  { y: "-100%" },
  { y: "0%", duration: 2, ease: "power2.out" },
  "-=1"
);
tl.fromTo(
  ".title",
  { opacity: 0, y: 50 },
  { opacity: 1, y: 0, duration: 1, ease: "power2.out" },
  "-=1"
);

let mouseDown = false;
let rgb = [12, 23, 34];
window.addEventListener("mousedown", () => {
  mouseDown = true;
});

window.addEventListener("mouseup", () => {
  mouseDown = false;
});

window.addEventListener("mousemove", (e) => {
  if (mouseDown) {
    rgb = [
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
    ];
  }
});

import * as THREE from "three";
import "./index.css";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { loadCurveFromJSON } from "./curveTools/CurveMethods.js";

const scene = new THREE.Scene();

const fbxLoader = new FBXLoader();
fbxLoader.load(
  "/KIET-Map.fbx",
  (object) => {
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

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
// ambientLight.castShadow = true;
scene.add(ambientLight);
scene.background = new THREE.Color(0x22222);

const camera = new THREE.PerspectiveCamera(
  80,
  window.innerWidth / window.innerHeight,
  0.01,
  1000
);

scene.add(camera);

const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.render(scene, camera);
renderer.shadowMap.enabled = true;

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;
// controls.autoRotateSpeed = 5;

// camera.position.z = 10;

const tl = gsap.timeline();

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

// Function to update aspect ratio and renderer size on window resize
function handleResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Add event listeners for window resize
window.addEventListener("resize", handleResize);

let curvePath = await loadCurveFromJSON("/KIET-Map.json");
// curvePath.mesh.scale.set(10, 10, 10);
// curvePath.mesh.position.set(0, 0, 0);
// curvePath.mesh.rotation.set(0, 0, 0);
scene.add(curvePath.mesh);

const clock = new THREE.Clock();

function updateCamera(){
  const time = clock.getElapsedTime();
  const looptime = 40;
	const t = ( (time) % looptime ) / looptime;
  const t2 = ( (time + 0.01) % looptime) / looptime
	
  const pos = curvePath.curve.getPointAt(t);
  const pos2 = curvePath.curve.getPointAt( t2 );
	
  camera.position.copy(pos);
  camera.lookAt(pos2);
}

const loop = () => {
  requestAnimationFrame(loop);
  updateCamera();
  controls.update();
  renderer.render(scene, camera);
};

loop();

// camera.position.copy(curvePath.curve.getPointAt(0));
// camera.lookAt(curvePath.curve.getPointAt(0.99));

// camera.position.x = curvePath.curve.getPointAt(0).x;
// camera.position.y = curvePath.curve.getPointAt(0).y;
// camera.position.z = curvePath.curve.getPointAt(0).z;

// window.addEventListener("wheel", () => {
//   gsap.registerPlugin(ScrollTrigger);
//   tl.fromTo(
//     camera.position,
//     {
//       x: curvePath.curve.getPointAt(0).x * 10,
//       y: curvePath.curve.getPointAt(0).y * 10,
//       z: curvePath.curve.getPointAt(0).z * 10,
//     },
//     {
//       x: curvePath.curve.getPointAt(0.99).x * 10,
//       y: curvePath.curve.getPointAt(0.99).y * 10,
//       z: curvePath.curve.getPointAt(0.99).z * 10,
//       duration: 15,
//       ease: "power2.out",
//     }
//   );
// });
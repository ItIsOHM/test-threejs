import * as THREE from "three";
import "./index.css";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";

const scene = new THREE.Scene();

const geometry = new THREE.SphereGeometry(3, 64, 64);
const material = new THREE.MeshStandardMaterial({ color: 0xfc4822, roughness: 0.2, metalness: 0.5});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

const light = new THREE.PointLight(0xffffff, 50, 100);
scene.add(light);
light.position.set(5, 5, 5);

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 20;

scene.add(camera);

const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.render(scene, camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;
controls.autoRotate = true;
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
    duration: 1
  },
});

tl.fromTo(mesh.scale, {x:0, y: 0, z:0 }, {x: 1, y: 1, z: 1 });
tl.fromTo("nav", {y: "-100%"}, {y: "0%", duration: 2, ease: "power2.out"}, "-=1");
tl.fromTo(".title", {opacity: 0, y: 50}, {opacity: 1, y: 0, duration: 1, ease: "power2.out"}, "-=1");

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
    gsap.to(mesh.material.color, {
      r: rgb[0] / 255,
      g: rgb[1] / 255,
      b: rgb[2] / 255,
    });
  }
});
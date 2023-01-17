import * as THREE from "three";
import perlinNoise3d from "perlin-noise-3d";

let canvas: HTMLElement;
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.Renderer;
let particles: Particles;

let width: number;
let height: number;

let scrollType: string = "";

let SIZE_FLOWFIELD: number = 100;
let NUM_PARTICLES: number = 20000;
let PARTICLE_SIZE: number = 0.1;
let PARTICLE_COLOR: number = 0xfffffff;

///////////////
// perlin noise
///////////////
class PerlinNoise {
  noise;

  constructor(seed: number) {
    this.noise = new perlinNoise3d();
    this.noise.noiseSeed(seed);
  }

  perlinNoise(x: number, y: number, z: number) {
    let eps = 1;
    let n1, n2, a, b;
    let curl = new THREE.Vector3();

    n1 = this.noise.get(x, y + eps, z);
    n2 = this.noise.get(x, y - eps, z);

    a = (n1 - n2) / (2 * eps);

    n1 = this.noise.get(x, y, z + eps);
    n2 = this.noise.get(x, y, z - eps);

    b = (n1 - n2) / (2 * eps);

    curl.x = a - b;

    n1 = this.noise.get(x, y, z + eps);
    n2 = this.noise.get(x, y, z - eps);

    a = (n1 - n2) / (2 * eps);

    n1 = this.noise.get(x + eps, y, z);
    n2 = this.noise.get(x - eps, y, z);

    b = (n1 - n2) / (2 * eps);

    curl.y = a - b;

    n1 = this.noise.get(x + eps, y, z);
    n2 = this.noise.get(x - eps, y, z);

    a = (n1 - n2) / (2 * eps);

    n1 = this.noise.get(x, y + eps, z);
    n2 = this.noise.get(x, y - eps, z);

    b = (n1 - n2) / (2 * eps);

    curl.z = a - b;

    return curl;
  }
}

/////////////
// flow field
/////////////
class FlowField {
  field: any[];
  size: number;
  constructor(size: number) {
    this.size = size;
    this.field = [];

    let noise = new PerlinNoise(Math.E);
    for (let x = 0; x < size; ++x) {
      this.field[x] = [];

      for (let y = 0; y < size; ++y) {
        this.field[x][y] = [];

        for (let z = 0; z < size; ++z) {
          let mod = 0.05;

          this.field[x][y][z] = noise.perlinNoise(x * mod, y * mod, z * mod);
        }
      }
    }
  }

  sample(x: number, y: number, z: number) {
    x = Math.round(x) + this.size / 2;
    y = Math.round(y) + this.size / 2;
    z = Math.round(z) + this.size / 2;

    return this.field[x] && this.field[x][y] && this.field[x][y][z] ? this.field[x][y][z] : undefined;
  }
}

////////////
// particles
////////////
class Particles {
  flowField: FlowField;
  points: THREE.Points;
  velocities: THREE.Vector3[];

  constructor(num: number, flowField: FlowField) {
    this.flowField = flowField;
    this.velocities = [];
    let vertices = new Float32Array(num * 3);

    let geometry = new THREE.BufferGeometry();
    let material = new THREE.PointsMaterial({ size: PARTICLE_SIZE, color: PARTICLE_COLOR });
    for (var i = 0; i < num; i++) {
      (vertices[i] = Math.random() - 0.5),
        (vertices[i + 1] = Math.random() - 0.5),
        (vertices[i + 2] = Math.random() - 0.5),
        this.velocities.push(new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5));
    }
    geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));

    this.points = new THREE.Points(geometry, material);
  }

  update() {
    let numVertices: number = this.points.geometry.attributes.position.count;
    for (let i = 0; i < numVertices; ++i) {
      let vertex = new THREE.Vector3(
        this.points.geometry.attributes.position.getX(i),
        this.points.geometry.attributes.position.getY(i),
        this.points.geometry.attributes.position.getZ(i)
      );
      let velocity = this.velocities.at(i)!;
      var flow = this.flowField.sample(vertex.x, vertex.y, vertex.z);

      if (flow) {
        var steer = flow.clone().sub(velocity); // flow - velocity

        velocity.add(steer.multiplyScalar(0.015));
        vertex.add(velocity.multiplyScalar(1.0));
      } else {
        vertex.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);

        velocity.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);
      }
      this.velocities[i] = velocity;
      this.points.geometry.attributes.position.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }
    this.points.geometry.attributes.position.needsUpdate = true;
  }
}

function setup() {
  // canvas
  canvas = document.getElementById("canvas")!;
  width = canvas.getBoundingClientRect().width;
  height = canvas.getBoundingClientRect().height;

  // scene
  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x904eb7, 10, 190);

  // camera
  camera = new THREE.PerspectiveCamera(75, width / height);
  camera.position.set(0, 0, 100);

  // renderer
  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(width, height);

  // particles
  let flowField = new FlowField(SIZE_FLOWFIELD);
  particles = new Particles(NUM_PARTICLES, flowField);
  scene.add(particles.points);

  canvas.appendChild(renderer.domElement);
}

let rotateSpeed;
function animate() {
  requestAnimationFrame(animate);
  particles.update();
  if (scrollType === "UP") {
    rotateSpeed = 0.01;
  } else if (scrollType === "DOWN") {
    rotateSpeed = -0.01;
  } else {
    rotateSpeed = 0.001;
  }
  particles.points.rotateX(rotateSpeed);
  particles.points.rotateY(rotateSpeed);
  renderer.render(scene, camera);
}

function handleResize() {
  width = canvas.getBoundingClientRect().width;
  height = canvas.getBoundingClientRect().height;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

let prevScroll: number = 0;
let currentScroll: number = 0;
function handleScroll() {
  prevScroll = currentScroll;
  currentScroll = window.scrollY;
  camera.position.setX(Math.min(currentScroll / 10, 50));

  if (prevScroll > currentScroll) {
    scrollType = "UP";
  } else {
    scrollType = "DOWN";
  }
  setTimeout(() => {
    scrollType = "";
  }, 100);
}

setup();
animate();

addEventListener("resize", handleResize);
addEventListener("scroll", handleScroll);

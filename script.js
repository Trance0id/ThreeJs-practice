//Готовим константы
const CAMERA_MOVE_SPEED = 0.3;
const CAMERA_ROTATE_SPEED = 0.003;
const PERS_JUMP_RANGE = 2;

// Готовим сцену
const scene = new THREE.Scene();
// scene.background = new THREE.Color('white');
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const gltfLoader = new THREE.GLTFLoader();
const textureLoader = new THREE.TextureLoader();
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth * 0.8, window.innerHeight * 0.8);
document.body.appendChild(renderer.domElement);

// Включаем тени
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.BasicShadowMap;

// Отобразим оси
const axesHelper = new THREE.AxesHelper(10);
scene.add(axesHelper);

// Готовим таблицу соответствия физических тел и объектов на сцене
let collisingObjects = new Map();

// Рисуем плоскую Землю с травой
// Готовим текстуру
const grassTexture = textureLoader.load("./assets/textures/grass1.jpg");
grassTexture.wrapS = THREE.RepeatWrapping;
grassTexture.wrapT = THREE.RepeatWrapping;
grassTexture.magFilter = THREE.NearestFilter;
grassTexture.colorSpace = THREE.SRGBColorSpace;
grassTexture.repeat.set(10, 10);
// Готовим материал
const grassMaterial = new THREE.MeshPhongMaterial({
  color: 0xffffff,
  map: grassTexture,
  flatShading: true,
});
// Готовим геометрию
const planeGeometry = new THREE.PlaneGeometry(100, 100);
// создаём сетку земли и добавляем в сцену
const earth = new THREE.Mesh(planeGeometry, grassMaterial);
earth.side = THREE.DoubleSide;
earth.receiveShadow = true;
earth.flatShading = true;
scene.add(earth);

// Создаём стены и добавляем на сцену
const brickTexture = textureLoader.load("./assets/textures/bricks1.jpg");
brickTexture.wrapS = THREE.RepeatWrapping;
brickTexture.wrapT = THREE.RepeatWrapping;
brickTexture.repeat.set(10, 1);
const brickMaterial = new THREE.MeshPhongMaterial({
  color: 0xffffff,
  map: brickTexture,
  side: THREE.DoubleSide,
  flatShading: true,
});
brickMaterial.side = THREE.DoubleSide;
const wallsGeometry = new THREE.PlaneGeometry(100, 10);

const wall1 = new THREE.Mesh(wallsGeometry, brickMaterial);
wall1.position.y = 50;
wall1.position.z = 5;
wall1.rotation.x = Math.PI * 0.5;
wall1.receiveShadow = true;
const wall1BB = new THREE.Plane(new THREE.Vector3(0, 1, 0), wall1.position.y);
collisingObjects.set(wall1BB, wall1);

const wall2 = new THREE.Mesh(wallsGeometry, brickMaterial);
wall2.position.y = -50;
wall2.position.z = 5;
wall2.rotation.x = -0.5 * Math.PI;
wall2.receiveShadow = true;
const wall2BB = new THREE.Plane(new THREE.Vector3(0, 1, 0), wall2.position.y);
collisingObjects.set(wall2BB, wall2);

const wall3 = new THREE.Mesh(wallsGeometry, brickMaterial);
wall3.position.x = 50;
wall3.position.z = 5;
wall3.rotation.y = -0.5 * Math.PI;
wall3.rotation.z = 0.5 * Math.PI;
wall3.receiveShadow = true;
const wall3BB = new THREE.Plane(new THREE.Vector3(1, 0, 0), wall3.position.x);
collisingObjects.set(wall3BB, wall3);

const wall4 = new THREE.Mesh(wallsGeometry, brickMaterial);
wall4.position.x = -50;
wall4.position.z = 5;
wall4.rotation.z = -0.5 * Math.PI;
wall4.rotation.y = 0.5 * Math.PI;
wall4.receiveShadow = true;
const wall4BB = new THREE.Plane(new THREE.Vector3(1, 0, 0), wall4.position.x);
collisingObjects.set(wall4BB, wall4);

scene.add(wall1, wall2, wall3, wall4);

// Сразу создадим один материал для сфер и кубов
const planetTexture = textureLoader.load("./assets/textures/planet1.jpg");
const planetMaterial = new THREE.MeshPhongMaterial({
  color: 0xffffff,
  map: planetTexture,
});

// Создаём кубы и добавляем на сцену
const cube10Geometry = new THREE.BoxGeometry(10, 10, 10);
const cube7Geometry = new THREE.BoxGeometry(7, 7, 7);
const cube3Geometry = new THREE.BoxGeometry(3, 3, 3);

const cube1 = new THREE.Mesh(cube10Geometry, planetMaterial);
cube1.position.set(0, 30, 6);
cube1.castShadow = true;
cube1.receiveShadow = true;
const cube1BB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
cube1BB.setFromObject(cube1);
collisingObjects.set(cube1BB, cube1);

const cube2 = new THREE.Mesh(cube3Geometry, planetMaterial);
cube2.position.set(40, -40, 3);
cube2.castShadow = true;
cube2.receiveShadow = true;
const cube2BB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
cube2BB.setFromObject(cube2);
collisingObjects.set(cube2BB, cube2);

const cube3 = new THREE.Mesh(cube7Geometry, planetMaterial);
cube3.position.set(-20, -27, 10);
cube3.castShadow = true;
cube3.receiveShadow = true;
const cube3BB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
cube3BB.setFromObject(cube3);
collisingObjects.set(cube3BB, cube3);

const cube4 = new THREE.Mesh(cube3Geometry, planetMaterial);
cube4.position.set(-30, 30, 5);
cube4.castShadow = true;
cube4.receiveShadow = true;
const cube4BB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
cube4BB.setFromObject(cube4);
collisingObjects.set(cube4BB, cube4);

scene.add(cube1, cube2, cube3, cube4);

// Создаём сферы и добавляем на сцену
const sphere8Geometry = new THREE.SphereGeometry(8, 16, 16);
sphere8Geometry.computeBoundingSphere();
const sphere12Geometry = new THREE.SphereGeometry(12, 16, 16);
sphere12Geometry.computeBoundingSphere();

const sphere1 = new THREE.Mesh(sphere8Geometry, planetMaterial);
sphere1.position.set(30, -5, 10);
sphere1.castShadow = true;
sphere1.receiveShadow = true;
const sphere1BB = new THREE.Sphere(
  sphere1.position,
  Math.floor(sphere1.geometry.boundingSphere.radius)
);
collisingObjects.set(sphere1BB, sphere1);

const sphere2 = new THREE.Mesh(sphere12Geometry, planetMaterial);
sphere2.position.set(-20, 0, 20);
sphere2.castShadow = true;
sphere2.receiveShadow = true;
const sphere2BB = new THREE.Sphere(
  sphere2.position,
  Math.floor(sphere2.geometry.boundingSphere.radius)
);
collisingObjects.set(sphere2BB, sphere2);

scene.add(sphere1, sphere2);

// Добавляем источники света
const overalLight = new THREE.AmbientLight(0xffffee, 0.5);

const sunLight = new THREE.DirectionalLight(0xffffff, 1);
sunLight.angle = Math.PI;
sunLight.position.set(-10, -10, 70);
sunLight.castShadow = true;
sunLight.shadow.camera.zoom = 0.1;
sunLight.target.position.set(10, 10, 0);

const focusedLight = new THREE.SpotLight(0xffffff, 2);
focusedLight.angle = Math.PI / 16;
focusedLight.position.set(-5, 0, 3);
focusedLight.castShadow = true;
focusedLight.target.position.set(-50, 60, 10);

scene.add(overalLight, sunLight, sunLight.target, focusedLight, focusedLight.target);

// Устанавливаем начальную позицию и ориентацию камеры
camera.position.z = 6;
camera.lookAt(cube1.position);

// Создаём себя (для реализации коллизий)
const persGeometry = new THREE.BoxGeometry(1, 1, 5);
const persMaterial = new THREE.MeshBasicMaterial();
const pers = new THREE.Mesh(persGeometry, persMaterial);
pers.position.copy(camera.position);
pers.geometry.computeBoundingBox();
const persBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
persBB.setFromObject(pers);

// Готовим передвижения
const controls = {};

// Отслеживаем нажатия кнопок w a s d
function move(cameraMoveSpeed = CAMERA_MOVE_SPEED) {
  
  if (controls["w"]) {
    camera.position.x -= Math.sin(camera.rotation.y) * cameraMoveSpeed;
    camera.position.y -= -Math.cos(camera.rotation.y) * cameraMoveSpeed;
  }
  if (controls["s"]) {
    camera.position.x += Math.sin(camera.rotation.y) * cameraMoveSpeed;
    camera.position.y += -Math.cos(camera.rotation.y) * cameraMoveSpeed;
  }
  if (controls["d"]) {
    camera.position.x += Math.sin(camera.rotation.y + Math.PI / 2) * cameraMoveSpeed;
    camera.position.y += -Math.cos(camera.rotation.y + Math.PI / 2) * cameraMoveSpeed;
  }
  if (controls["a"]) {
    camera.position.x -= Math.sin(camera.rotation.y + Math.PI / 2) * cameraMoveSpeed;
    camera.position.y -= -Math.cos(camera.rotation.y + Math.PI / 2) * cameraMoveSpeed;
  }
  pers.position.copy(camera.position);
}

// Отпрыгиваем от препятствий при столкновении
function jumpOfObstacle(jumpSpeed = CAMERA_MOVE_SPEED * PERS_JUMP_RANGE) {
  if (controls["w"]) {
    camera.position.x += Math.sin(camera.rotation.y) * jumpSpeed;
    camera.position.y += -Math.cos(camera.rotation.y) * jumpSpeed;
  }
  if (controls["s"]) {
    camera.position.x -= Math.sin(camera.rotation.y) * jumpSpeed;
    camera.position.y -= -Math.cos(camera.rotation.y) * jumpSpeed;
  }
  if (controls["d"]) {
    camera.position.x -= Math.sin(camera.rotation.y + Math.PI / 2) * jumpSpeed;
    camera.position.y -= -Math.cos(camera.rotation.y + Math.PI / 2) * jumpSpeed;
  }
  if (controls["a"]) {
    camera.position.x += Math.sin(camera.rotation.y + Math.PI / 2) * jumpSpeed;
    camera.position.y += -Math.cos(camera.rotation.y + Math.PI / 2) * jumpSpeed;
  }
  pers.position.copy(camera.position);
}

document.addEventListener("keydown", ({ key }) => {
  controls[key] = true;
});
document.addEventListener("keyup", ({ key }) => {
  controls[key] = false;
});

// Отслеживаем движения мыши для поворота камеры
let startX = 0;
let isDragging = false;

function moveCameraWithCursor(e) {
  const nowX = e.clientX;
  camera.rotation.y += (nowX - startX) * CAMERA_ROTATE_SPEED;
  startX = nowX;
}

renderer.domElement.addEventListener("mousedown", ({ clientX }) => {
  startX = clientX;
  isDragging = true;
  return this.addEventListener("mousemove", moveCameraWithCursor);
});

renderer.domElement.addEventListener("mouseup", () => {
  isDragging = false;
  return this.removeEventListener("mousemove", moveCameraWithCursor);
});

// Готовимся отслеживать и обрабатывать коллизии
let collisionHandled = false;
let collisingMesh = {};

// Объявляем функцию для проверки на коллизию
// Она запускаетя единожды для одного случая коллизии 
function checkForCollisions() {
  let nowCollision = false;

  collisingObjects.forEach((mesh, obj) => {
    if (obj.radius > 0 && persBB.intersectsSphere(obj)) {
      nowCollision = true;
    } else if (obj.isBox3 && persBB.intersectsBox(obj)) {
      nowCollision = true;
    } else if (obj.constant && persBB.intersectsPlane(obj)) {
      nowCollision = true;
    }
    if (nowCollision) {
      collisingMesh = mesh;
    }
  });

  if (!collisionHandled) {
    if (nowCollision) {
      handleCollision();
      collisionHandled = true;
    }
  } else if (!nowCollision) {
    resetCollisions();
    collisionHandled = false;
    collisingMesh = {};
  }
}

// Объявляем функцию для применения эффектов коллизий
function handleCollision() {
  // collisingMesh.material.transparent = true;
  // collisingMesh.material.opacity = 1;
  jumpOfObstacle();
}

// Объявляем функцию для отмены эфектов коллизий
function resetCollisions() {
  // collisingMesh.material.opacity = 1;
}

// Загружаем glTF 3D модели
gltfLoader.load(
  // resource URL
  "./assets/objects/vintage_sofa/scene.gltf",
  // called when the resource is loaded
  function (gltf) {
    const sofa = gltf.scene;
    sofa.position.x = 25;
    sofa.position.y = 25;
    sofa.position.z = 11;
    sofa.scale.set(8, 8, 8);
    sofa.rotation.set(0, 0, (Math.PI / 4) * 3);
    sofa.traverse(node => {
      if (node.isMesh) {
        node.castShadow = true;
      }
    });
    scene.add(sofa);
    const sofaBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
    sofaBB.setFromObject(sofa);
    collisingObjects.set(sofaBB, sofa);

    gltf.animations; // Array<THREE.AnimationClip>
    gltf.scene; // THREE.Group
    gltf.scenes; // Array<THREE.Group>
    gltf.cameras; // Array<THREE.Camera>
    gltf.asset; // Object
  },
  // called while loading is progressing
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  // called when loading has errors
  function (error) {
    console.log("An error happened", error);
  }
);

gltfLoader.load(
  // resource URL
  "./assets/objects/lamp.glb",
  // called when the resource is loaded
  function (gltf) {
    const lamp = gltf.scene.children[0];
    lamp.position.set(-23, 23, 4);
    lamp.rotation.x = Math.PI / 2;
    lamp.rotation.y = (Math.PI / 3) * 4;
    // lamp.traverse(node => {
    //   if (node.isMesh) {
    //     node.castShadow = true;
    //   }
    // });
    scene.add(lamp);
    
    const lampBB = new THREE.Sphere(new THREE.Vector3(-23, 23, 4), 1);
    collisingObjects.set(lampBB, lamp);
  },
  // called while loading is progressing
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  // called when loading has errors
  function (error) {
    console.log("An error happened", error);
  }
);

// объявляем и вызываем функцию для анимации
(function animate() {
  requestAnimationFrame(animate);
  move();
  pers.updateMatrixWorld();
  persBB.copy(pers.geometry.boundingBox).applyMatrix4(pers.matrixWorld);
  checkForCollisions();
  renderer.render(scene, camera);
})();

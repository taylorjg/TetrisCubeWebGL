import { solve } from '../solving';
import * as SOLVING from '../solving';
import * as THREE from 'three';
import TrackballControls from 'three-trackballcontrols';

const COLOUR_TABLE = {
    [SOLVING.COLOUR_BLUE]: 'deepskyblue',
    [SOLVING.COLOUR_CERISE]: 'deeppink',
    [SOLVING.COLOUR_GREEN]: 'limegreen',
    [SOLVING.COLOUR_MAGENTA]: 'magenta',
    [SOLVING.COLOUR_ORANGE]: 'orange',
    [SOLVING.COLOUR_RED]: 'orangered',
    [SOLVING.COLOUR_YELLOW]: 'yellow'
};

const createMesh = colour => {
    return new THREE.MeshLambertMaterial({
        color: colour,
        opacity: 1,
        transparent: true
    })    
};

const MESH_TABLE = {
    [SOLVING.COLOUR_BLUE]: createMesh(COLOUR_TABLE[SOLVING.COLOUR_BLUE]),
    [SOLVING.COLOUR_CERISE]: createMesh(COLOUR_TABLE[SOLVING.COLOUR_CERISE]),
    [SOLVING.COLOUR_GREEN]: createMesh(COLOUR_TABLE[SOLVING.COLOUR_GREEN]),
    [SOLVING.COLOUR_MAGENTA]: createMesh(COLOUR_TABLE[SOLVING.COLOUR_MAGENTA]),
    [SOLVING.COLOUR_ORANGE]: createMesh(COLOUR_TABLE[SOLVING.COLOUR_ORANGE]),
    [SOLVING.COLOUR_RED]: createMesh(COLOUR_TABLE[SOLVING.COLOUR_RED]),
    [SOLVING.COLOUR_YELLOW]: createMesh(COLOUR_TABLE[SOLVING.COLOUR_YELLOW])
};

const SIZE = 0.95;
const geometry = new THREE.CubeGeometry(SIZE, SIZE, SIZE);

const createCube = (colour, position) => {
    const cube = new THREE.Mesh(geometry, MESH_TABLE[colour]);
    cube.position.x = position.x;
    cube.position.y = position.y;
    cube.position.z = position.z;
    return cube;
};

const createCubes = (colour, positions) =>
    positions.map(position => createCube(colour, position));

const createShapeGroup = internalRow => {
    const shapeGroup = new THREE.Group();
    const cubes = createCubes(internalRow.colour, internalRow.occupiedSquares);
    cubes.forEach(cube => shapeGroup.add(cube));
    return shapeGroup;
};

const addShapeGroup = pair => {
    const { rowIndex, internalRow } = pair;
    const shapeGroup = createShapeGroup(internalRow);
    shapeGroup.userData = rowIndex;
    puzzleGroup.add(shapeGroup);
};

const removeShapeGroup = rowIndex => {
    const shapeGroup = findShapeGroup(rowIndex);
    shapeGroup && puzzleGroup.remove(shapeGroup);
};

const findShapeGroup = rowIndex =>
    puzzleGroup.children.find(shapeGroup => shapeGroup.userData === rowIndex);

const renderPairs = pairs => {

    pairs
        .filter(pair => !findShapeGroup(pair.rowIndex))
        .forEach(addShapeGroup);

    puzzleGroup.children
        .map(child => child.userData)
        .filter(rowIndex => !pairs.find(pair => pair.rowIndex === rowIndex))
        .forEach(removeShapeGroup);
}

const container = document.getElementById('container');
const w = container.offsetWidth;
const h = container.offsetHeight;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
container.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(54, w / h, 1, 40);
camera.position.set(2, 1, 10);
scene.add(camera);

const light = new THREE.DirectionalLight(0xffffff, 1.0);
light.position.set(0, 0, 5);
scene.add(light);

const puzzleGroup = new THREE.Group();
puzzleGroup.rotation.x = Math.PI / 8;
puzzleGroup.rotation.y = Math.PI / 4;
scene.add(puzzleGroup);

const controls = new TrackballControls(camera, renderer.domElement);

const render = () => {
    controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(render);
};

window.requestAnimationFrame(render);

const sliderCameraX = document.getElementById('camera_x');
const sliderCameraY = document.getElementById('camera_y');
const sliderCameraZ = document.getElementById('camera_z');
const sliderCameraViewAngle = document.getElementById('camera_va');

const sliderCameraXLabel = document.getElementById('camera_x_label');
const sliderCameraYLabel = document.getElementById('camera_y_label');
const sliderCameraZLabel = document.getElementById('camera_z_label');
const sliderCameraViewAngleLabel = document.getElementById('camera_va_label');
const searchStepLabel = document.getElementById('search_step');

sliderCameraX.value = camera.position.x;
sliderCameraY.value = camera.position.y;
sliderCameraZ.value = camera.position.z;
sliderCameraViewAngle.value = camera.fov;

sliderCameraX.addEventListener('change', ev => {
    updateCameraPos(pos => pos.x = Number(ev.target.value));
    updateSliderCameraXLabel();
});

sliderCameraY.addEventListener('change', ev => {
    updateCameraPos(pos => pos.y = Number(ev.target.value));
    updateSliderCameraYLabel();
});

sliderCameraZ.addEventListener('change', ev => {
    updateCameraPos(pos => pos.z = Number(ev.target.value));
    updateSliderCameraZLabel();
});

sliderCameraViewAngle.addEventListener('change', ev => {
    updateCameraFov(Number(ev.target.value));
    updateSliderCameraViewAngleLabel(ev.target.value);
});

const updateSliderCameraXLabel = () =>
    sliderCameraXLabel.innerText = `Camera X: ${sliderCameraX.value}`;

const updateSliderCameraYLabel = () =>
    sliderCameraYLabel.innerText = `Camera Y: ${sliderCameraY.value}`;

const updateSliderCameraZLabel = () =>
    sliderCameraZLabel.innerText = `Camera Z: ${sliderCameraZ.value}`;

const updateSliderCameraViewAngleLabel = () =>
    sliderCameraViewAngleLabel.innerText = `Camera View Angle: ${sliderCameraViewAngle.value}`;

const updateSearchStepLabel = count =>
    searchStepLabel.innerText = `Search Step: ${count}`;

updateSliderCameraXLabel();
updateSliderCameraYLabel();
updateSliderCameraZLabel();
updateSliderCameraViewAngleLabel();

const updateCameraPos = fn => {
    const pos = camera.position;
    fn(pos);
    console.log(`pos: ${JSON.stringify(pos)}`);
    camera.position.set(pos.x, pos.y, pos.z);
};

const updateCameraFov = fov => {
    console.log(`fov: ${fov}`);
    camera.fov = fov;
    camera.updateProjectionMatrix();
};

let searchStep = 0;

const onQueueTimer = () => {
    if (queue.length) {
        updateSearchStepLabel(searchStep++);
        const pairs = queue.shift();
        renderPairs(pairs);
        if (pairs.final) {
            clearInterval(queueTimer);
        }
    }
};

const queue = [];
const queueTimer = setInterval(onQueueTimer, 100);

const onSearchStep = pairs => {
    pairs.final = false;
    queue.push(pairs);
};

const onSolutionFound = pairs => {
    pairs.forEach(pair => {
        const { rowIndex, internalRow } = pair;
        const name = internalRow.name;
        const occupiedSquares = JSON.stringify(internalRow.occupiedSquares);
        const colourName = COLOUR_TABLE[internalRow.colour];
        console.log(`${rowIndex} ${name}; ${occupiedSquares}; ${colourName}`);
    });
    pairs.final = true;
    queue.push(pairs);
};

solve(onSearchStep, onSolutionFound);

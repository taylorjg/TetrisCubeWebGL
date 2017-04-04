import { solve } from '../solving';
import * as SOLVING from '../solving';
import * as THREE from 'THREE';

const COLOUR_TABLE = {
    [SOLVING.COLOUR_BLUE]: 'deepskyblue',
    [SOLVING.COLOUR_CERISE]: 'deeppink',
    [SOLVING.COLOUR_GREEN]: 'limegreen',
    [SOLVING.COLOUR_MAGENTA]: 'magenta',
    [SOLVING.COLOUR_ORANGE]: 'orange',
    [SOLVING.COLOUR_RED]: 'orangered',
    [SOLVING.COLOUR_YELLOW]: 'yellow'
};

const createCube = (colour, position) => {
    const geometry = new THREE.CubeGeometry(1, 1, 1);
    const cube = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({
        color: colour,
        opacity: 1,
        transparent: true
    }));
    cube.position.x = position.x;
    cube.position.y = position.y;
    cube.position.z = -position.z;
    return cube;
};

const createCubes = (colour, positions) =>
    positions.map(position => createCube(colour, position));

const createCubeGroup = internalRow => {
    const cubeGroup = new THREE.Group();
    const colour = COLOUR_TABLE[internalRow.colour];
    const cubes = createCubes(colour, internalRow.occupiedSquares);
    cubes.forEach(cube => cubeGroup.add(cube));
    return cubeGroup;
};

const currentCubeGroups = {};

const addPair = pair => {
    const { rowIndex, internalRow } = pair;
    const cubeGroup = createCubeGroup(internalRow);
    currentCubeGroups[rowIndex] = cubeGroup;
    puzzleGroup.add(cubeGroup);
};

const removePair = pair => {
    const { rowIndex, internalRow } = pair;
    const cubeGroup = currentCubeGroups[rowIndex];
    currentCubeGroups.delete(rowIndex);
    puzzleGroup.remove(cubeGroup);
};

const renderPairs = pairs => {
    const pairsToAdd = pairs;
    const pairsToRemove = [];
    // TODO: need to determine:
    // - pairs to add
    // - pairs to remove
    pairsToAdd.forEach(pair => addPair(pair));
    pairsToRemove.forEach(pair => removePair(pair));
    myRender();
}

const container = document.getElementById('container');
const w = container.offsetWidth;
const h = container.offsetHeight;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
container.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(31, w / h, 1, 40);
camera.position.set(0, 2, 12);
scene.add(camera);

const light = new THREE.DirectionalLight(0xffffff, 1.0);
light.position.set(0, 0, 5);
scene.add(light);

const puzzleGroup = new THREE.Group();
puzzleGroup.rotation.x = Math.PI / 8;
puzzleGroup.rotation.y = Math.PI / 4;
scene.add(puzzleGroup);

const myRender = () => {
    window.requestAnimationFrame(() => {
        renderer.render(scene, camera);
    });
};

myRender();

const sliderCameraX = document.getElementById('camera_x');
const sliderCameraY = document.getElementById('camera_y');
const sliderCameraZ = document.getElementById('camera_z');
const sliderCameraViewAngle = document.getElementById('camera_va');

sliderCameraX.value = camera.position.x;
sliderCameraY.value = camera.position.y;
sliderCameraZ.value = camera.position.z;
sliderCameraViewAngle.value = camera.fov;

sliderCameraX.addEventListener('change', ev => {
    updateCameraPos(pos => pos.x = Number(ev.target.value));
});

sliderCameraY.addEventListener('change', ev => {
    updateCameraPos(pos => pos.y = Number(ev.target.value));
});

sliderCameraZ.addEventListener('change', ev => {
    updateCameraPos(pos => pos.z = Number(ev.target.value));
});

sliderCameraViewAngle.addEventListener('change', ev => {
    updateCameraFov(Number(ev.target.value));
});

const updateCameraPos = fn => {
    const pos = camera.position;
    fn(pos);
    console.log(`pos: ${JSON.stringify(pos)}`);
    camera.position.set(pos.x, pos.y, pos.z);
    myRender();
};

const updateCameraFov = fov => {
    console.log(`fov: ${fov}`);
    camera.fov = fov;
    camera.updateProjectionMatrix();
    myRender();
};

const queue = [];
const queueTimer = setInterval(onQueueTimer, 100);

const onQueueTimer = () => {
    if (queue.length) {
        const pairs = queue.shift();
        renderPairs(pairs);
    }
};

const onSearchStep = pairs => {
    // queue.push(pairs);
};

const onSolutionFound = pairs => {
    pairs.forEach(pair => {
        const { rowIndex, internalRow } = pair;
        const name = internalRow.name;
        const occupiedSquares = JSON.stringify(internalRow.occupiedSquares);
        const colourName = COLOUR_TABLE[internalRow.colour];
        console.log(`${rowIndex} ${name}; ${occupiedSquares}; ${colourName}`);
    });
    renderPairs(pairs);
};

const solutionGenerator = solve(onSearchStep, onSolutionFound);
solutionGenerator.next();

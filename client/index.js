import { solve } from '../solving';
import * as SOLVING from '../solving';
import * as THREE from 'three';
import TrackballControls from 'three-trackballcontrols';

const createMesh = colour =>
    new THREE.MeshLambertMaterial({
        color: colour,
        opacity: 1,
        transparent: true
    })

const MESH_TABLE = {
    [SOLVING.COLOUR_BLUE]: createMesh('deepskyblue'),
    [SOLVING.COLOUR_CERISE]: createMesh('deeppink'),
    [SOLVING.COLOUR_GREEN]: createMesh('limegreen'),
    [SOLVING.COLOUR_MAGENTA]: createMesh('magenta'),
    [SOLVING.COLOUR_ORANGE]: createMesh('orange'),
    [SOLVING.COLOUR_RED]: createMesh('orangered'),
    [SOLVING.COLOUR_YELLOW]: createMesh('yellow')
};

const GAP = 0.012;
const HALF_GAP = 0.006;

const isCubeAt = (positions, x, y, z) =>
    positions.some(pos => pos.x === x && pos.y === y && pos.z === z);

const createCube = (colour, position, positions) => {
    const leftOpen = !isCubeAt(positions, position.x - 1, position.y, position.z);
    const rightOpen = !isCubeAt(positions, position.x + 1, position.y, position.z);
    const topOpen = !isCubeAt(positions, position.x, position.y + 1, position.z);
    const bottomOpen = !isCubeAt(positions, position.x, position.y - 1, position.z);
    const frontOpen = !isCubeAt(positions, position.x, position.y, position.z - 1);
    const backOpen = !isCubeAt(positions, position.x, position.y, position.z + 1);
    const xSize = 1 - (leftOpen ? GAP : 0) - (rightOpen ? GAP : 0);
    const ySize = 1 - (topOpen ? GAP : 0) - (bottomOpen ? GAP : 0);
    const zSize = 1 - (frontOpen ? GAP : 0) - (backOpen ? GAP : 0);
    const xTranslation = 0 + (leftOpen ? HALF_GAP : 0) - (rightOpen ? HALF_GAP : 0);
    const yTranslation = 0 - (topOpen ? HALF_GAP : 0) + (bottomOpen ? HALF_GAP : 0);
    const zTranslation = 0 + (frontOpen ? HALF_GAP : 0) - (backOpen ? HALF_GAP : 0);
    const geometry = new THREE.CubeGeometry(xSize, ySize, zSize);
    const cube = new THREE.Mesh(geometry, MESH_TABLE[colour]);
    cube.position.x = position.x;
    cube.position.y = position.y;
    cube.position.z = position.z;
    cube.translateX(xTranslation);
    cube.translateY(yTranslation);
    cube.translateZ(zTranslation);
    return cube;
};

const createCubes = (colour, positions) =>
    positions.map(position => createCube(colour, position, positions));

const createShapeGroup = (colour, positions) => {
    const shapeGroup = new THREE.Group();
    const cubes = createCubes(colour, positions);
    cubes.forEach(cube => shapeGroup.add(cube));
    return shapeGroup;
};

const addShapeGroup = ({ rowIndex, internalRow }) => {
    const shapeGroup = createShapeGroup(internalRow.colour, internalRow.occupiedSquares);
    shapeGroup.userData = rowIndex;
    puzzleGroup.add(shapeGroup);
};

const removeShapeGroup = rowIndex => {
    const shapeGroup = findShapeGroup(rowIndex);
    puzzleGroup.remove(shapeGroup);
};

const findShapeGroup = rowIndex =>
    puzzleGroup.children.find(shapeGroup => shapeGroup.userData === rowIndex);

const renderPairs = pairs => {

    pairs
        .filter(pair => !findShapeGroup(pair.rowIndex))
        .forEach(addShapeGroup);

    puzzleGroup.children
        .map(child => child.userData)
        .filter(rowIndex => !pairs.some(pair => pair.rowIndex === rowIndex))
        .forEach(removeShapeGroup);
}

const container = document.getElementById('container');
const w = container.offsetWidth;
const h = container.offsetHeight;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
container.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(34, w / h, 1, 40);
camera.position.set(2, 1, 15);
camera.lookAt(new THREE.Vector3(0, 0, 0));
scene.add(camera);

const light1 = new THREE.DirectionalLight(0xffffff, 1.0);
light1.position.set(0, 0, 5);
scene.add(light1);

const light2 = new THREE.DirectionalLight(0xffffff, 1.0);
light2.position.set(0, 0, -5);
scene.add(light2);

const puzzleGroup = new THREE.Group();
puzzleGroup.position.x = -1.5;
puzzleGroup.position.y = -1.5;
puzzleGroup.position.z = -1.5;
puzzleGroup.rotation.x = Math.PI / 8;
puzzleGroup.rotation.y = Math.PI / 4;
scene.add(puzzleGroup);

const controls = new TrackballControls(camera, renderer.domElement);

const render = () => {
    controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(render);
};

render();

window.addEventListener('resize', () => {
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    camera.aspect = container.offsetWidth / container.offsetHeight;
    camera.updateProjectionMatrix();
});

const onQueueTimer = () => {
    if (queue.length) {
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
    pairs.final = true;
    queue.push(pairs);
};

solve(onSearchStep, onSolutionFound);

import { puzzle, solve } from '../solving';
import * as SOLVING from '../solving';
import * as THREE from 'three';
import TrackballControls from 'three-trackballcontrols';

const createMesh = colour =>
    new THREE.MeshLambertMaterial({
        color: colour,
        opacity: 1,
        transparent: true
    })

const COLOUR_TABLE = {
    [SOLVING.COLOUR_BLUE]: 'deepskyblue',
    [SOLVING.COLOUR_CERISE]: 'deeppink',
    [SOLVING.COLOUR_GREEN]: 'limegreen',
    [SOLVING.COLOUR_MAGENTA]: 'magenta',
    [SOLVING.COLOUR_ORANGE]: 'orange',
    [SOLVING.COLOUR_RED]: 'orangered',
    [SOLVING.COLOUR_YELLOW]: 'yellow'
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

const createShapeGroup = (colour, positions) => {
    const shapeGroup = new THREE.Group();
    shapeGroup.userData = -1;
    const cubes = createCubes(colour, positions);
    cubes.forEach(cube => shapeGroup.add(cube));
    return shapeGroup;
};

const PIECES = new Map(puzzle.pieces.map(piece => {
    const shapeGroup = createShapeGroup(piece.colour, piece.occupiedSquares);
    return [piece.name, shapeGroup];
}));

const addShapeGroup = pair => {
    const { rowIndex, internalRow } = pair;
    const shapeGroup = PIECES.get(internalRow.name);
    shapeGroup.children.forEach((cube, index) => {
        const position = internalRow.occupiedSquares[index];
        cube.position.x = position.x;
        cube.position.y = position.y;
        cube.position.z = position.z;
    });
    shapeGroup.userData = rowIndex;
    puzzleGroup.add(shapeGroup);
};

const removeShapeGroup = rowIndex => {
    const shapeGroup = findShapeGroup(rowIndex);
    puzzleGroup.remove(shapeGroup);
    shapeGroup.userData = -1;
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

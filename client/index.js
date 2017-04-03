import { solve } from '../solving';
import * as SOLVING from '../solving';
import * as THREE from 'THREE';

const COLOR_TABLE = {
    [SOLVING.COLOUR_BLUE]: 'deepskyblue',
    [SOLVING.COLOUR_CERISE]: 'deeppink',
    [SOLVING.COLOUR_GREEN]: 'limegreen',
    [SOLVING.COLOUR_MAGENTA]: 'magenta',
    [SOLVING.COLOUR_ORANGE]: 'orange',
    [SOLVING.COLOUR_RED]: 'orangered',
    [SOLVING.COLOUR_YELLOW]: 'yellow'
};

const createCube = (group, color, coords) => {
    const geometry = new THREE.CubeGeometry(1, 1, 1);
    const cube = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({
        color,
        opacity: 1,
        transparent: true }));
    cube.position.x = coords.x;
    cube.position.y = coords.y;
    cube.position.z = -coords.z;
    group.add(cube);
};

const createShape = (group, color, coords) => {
    coords.forEach(c => createCube(group, color, c));
};

const createShapeForInternalRow = (group, internalRow) => {
    const color = COLOR_TABLE[internalRow.colour];
    const coords = internalRow.occupiedSquares;
    createShape(group, color, internalRow.occupiedSquares);
};

const renderInternalRows = internalRows => {
    const group = new THREE.Group();
    internalRows.forEach((internalRow, index) => createShapeForInternalRow(group, internalRow));
    group.rotation.x = Math.PI / 8;
    group.rotation.y = Math.PI / 8;
    scene.add(group);
    renderer.render(scene, camera);
};

const container = document.getElementById('container');
const w = container.offsetWidth;
const h = container.offsetHeight;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
container.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, w / h, 1, 40);
camera.position.set(-1, 1.5, 10);
scene.add(camera);

const light = new THREE.DirectionalLight(0xffffff, 1.0);
light.position.set(0, 0, 5);
scene.add(light);

renderer.render(scene, camera);

const onSolutionFound = (puzzle, internalRows) => {
    internalRows.forEach(internalRow =>
        console.log(`${internalRow.name}; ${JSON.stringify(internalRow.occupiedSquares)}; ${COLOR_TABLE[internalRow.colour]}`));
    renderInternalRows(internalRows);        
};

const solutionGenerator = solve(null, onSolutionFound);
solutionGenerator.next();

import { RotatedPiece } from './rotatedPiece';
import * as R from './rotations';

export const uniqueRotationsOfPiece = piece => {
    const result = [];
    for (let rotations of SETS_OF_ROTATIONS) {
        const rotatedPiece = new RotatedPiece(piece, rotations);
        if (!rotatedPieceWithSameOccupiedSquaresExists(result, rotatedPiece)) {
            result.push(rotatedPiece);
        }
    }
    return result;
};

const SETS_OF_ROTATIONS = [
    [],
    [R.ROTATION_X90CW],
    [R.ROTATION_X180CW],
    [R.ROTATION_X90CW],
    [R.ROTATION_Y180CW],
    [R.ROTATION_Y270CW],
    [R.ROTATION_Y180CW],
    [R.ROTATION_Z270CW],
    [R.ROTATION_Z270CW],
    [R.ROTATION_Z270CW]
];

const rotatedPieceWithSameOccupiedSquaresExists = (result, rotatedPiece) => {
    const occupiedSquares1 = rotatedPiece.occupiedSquares.sort(compareCoords);
    return !!result.find(element => {
        const occupiedSquares2 = element.occupiedSquares.sort(compareCoords);
        return (
            occupiedSquares1.length === occupiedSquares2.length &&
            occupiedSquares1.every((coords1, index) => {
                const coords2 = occupiedSquares2[index];
                return coords1.equals(coords2);
            }));
    });
};

const compareCoords = (a, b) => {
    if (a.x !== b.x) {
        return a.x - b.x;
    }
    else if (a.y !== b.y) {
        return a.y - b.y;
    }
    else if (a.z !== b.z) {
        return a.z - b.z;
    }
    return 0;
};

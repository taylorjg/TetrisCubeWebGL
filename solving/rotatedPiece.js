import { Coords } from './coords';
import * as C from './constants';
import {
    MATRIX_IDENTITY,
    MATRIX_X90CW,
    MATRIX_X180CW,
    MATRIX_X270CW,
    MATRIX_Y90CW,
    MATRIX_Y180CW,
    MATRIX_Y270CW,
    MATRIX_Z90CW,
    MATRIX_Z180CW,
    MATRIX_Z270CW
} from './matrix';

export class RotatedPiece {
    constructor(piece, rotations) {
        const rotationMatrix = calculateRotationMatrix(rotations);
        const correctionFactor = calculateCorrectionFactor(piece, rotationMatrix);
        this.name = piece.name;
        this.colour = piece.colour;
        this.occupiedSquares = piece.occupiedSquares
            .map(coords => rotationMatrix.multiplyCoords(coords))
            .map(coords => coords.subtract(correctionFactor));
    }
}

const ROTATION_TO_MATRIX = {
    [C.ROTATION_X90CW]: MATRIX_X90CW,
    [C.ROTATION_X180CW]: MATRIX_X180CW,
    [C.ROTATION_X270CW]: MATRIX_X270CW,
    [C.ROTATION_Y90CW]: MATRIX_Y90CW,
    [C.ROTATION_Y180CW]: MATRIX_Y180CW,
    [C.ROTATION_Y270CW]: MATRIX_Y270CW,
    [C.ROTATION_Z90CW]: MATRIX_Z90CW,
    [C.ROTATION_Z180CW]: MATRIX_Z180CW,
    [C.ROTATION_Z270CW]: MATRIX_Z270CW
};

const calculateRotationMatrix = rotations => 
    rotations.reduce((acc, rotation) =>
        acc.multiplyMatrix(ROTATION_TO_MATRIX[rotation]),
        MATRIX_IDENTITY);

const calculateCorrectionFactor = (piece, rotationMatrix) => {
    const dimensions = new Coords(piece.width - 1, piece.height - 1, piece.depth - 1);
    const transformedDimensions = rotationMatrix.multiplyCoords(dimensions);
    const xCorrection = Math.min(transformedDimensions.x, 0);
    const yCorrection = Math.min(transformedDimensions.y, 0);
    const zCorrection = Math.min(transformedDimensions.z, 0);
    return new Coords(xCorrection, yCorrection, zCorrection);
};

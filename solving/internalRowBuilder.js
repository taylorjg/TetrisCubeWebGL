import { InternalRow } from './internalRow';
import { PlacedPiece } from './placedPiece';
import { Coords } from './coords';
import { uniqueRotationsOfPiece } from './uniqueRotations';

export const buildInternalRows = puzzle => {

    const allLocations = [];
    for (let x of puzzle.ascendingDimensionIndices) {
        for (let y of puzzle.ascendingDimensionIndices) {
            for (let z of puzzle.ascendingDimensionIndices) {
                allLocations.push(new Coords(x, y, z));
            }
        }
    }

    const internalRows = [];
    for (let piece of puzzle.pieces) {
        for (let rotatedPiece of uniqueRotationsOfPiece(piece)) {
            for (let location of allLocations) {
                const placedPiece = new PlacedPiece(rotatedPiece, location);
                if (isPlacedPieceWithinPuzzle(placedPiece, puzzle)) {
                    internalRows.push(new InternalRow(placedPiece));
                }
            }
        }
    }

    return internalRows;
};

const isPlacedPieceWithinPuzzle = (placedPiece, puzzle) =>
    placedPiece.occupiedSquares.every(coords => isCoordsWithinPuzzle(coords, puzzle));

const isCoordsWithinPuzzle = (coords, puzzle) =>
    isDimensionWithinPuzzle(coords.x, puzzle) &&
    isDimensionWithinPuzzle(coords.y, puzzle) &&
    isDimensionWithinPuzzle(coords.z, puzzle);

const isDimensionWithinPuzzle = (dimension, puzzle) =>
    dimension >= 0 && dimension < puzzle.cubeSize;

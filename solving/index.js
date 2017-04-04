import { Puzzle }  from './puzzle';
import { buildInternalRows } from './internalRowBuilder';
import { buildDlxMatrix } from './dlxMatrixBuilder';
import dlxSolve from '../dlxlib';

export * from './colours';

export const solve = (onSearchStep, onSolutionFound) => {
    const puzzle = new Puzzle;
    const internalRows = buildInternalRows(puzzle);
    const dlxMatrix = buildDlxMatrix(puzzle, internalRows);
    return dlxSolve(
        dlxMatrix,
        onSearchStep ? internalOnSearchStep(onSearchStep, puzzle, internalRows) : undefined,
        onSolutionFound ? internalOnSolutionFound(onSolutionFound, puzzle, internalRows) : undefined);
};

const internalOnSearchStep = (onSearchStep, puzzle, internalRows) =>
    rowIndices => onSearchStep(rowIndicesToPairs(puzzle, internalRows, rowIndices));

const internalOnSolutionFound = (onSolutionFound, puzzle, internalRows) =>
    rowIndices => onSolutionFound(rowIndicesToPairs(puzzle, internalRows, rowIndices));

const rowIndicesToPairs = (puzzle, internalRows, rowIndices) =>
    rowIndices.map(rowIndex => ({
        rowIndex,
        internalRow: internalRows[rowIndex]
    }));

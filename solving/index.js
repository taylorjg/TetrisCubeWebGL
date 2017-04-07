import { Puzzle }  from './puzzle';
import { buildInternalRows } from './internalRowBuilder';
import { buildDlxMatrix } from './dlxMatrixBuilder';
import { shuffle } from './utils';
import { solutionGenerator } from 'dlxlib';

export * from './colours';
export * from './rotations';

export const puzzle = new Puzzle;

export const solve = (onSearchStep, onSolutionFound) => {
    const internalRows = buildInternalRows(puzzle);
    shuffle(internalRows);
    const matrix = buildDlxMatrix(puzzle, internalRows);
    const generator = solutionGenerator(
        matrix,
        internalOnSearchStep(onSearchStep, puzzle, internalRows),
        internalOnSolutionFound(onSolutionFound, puzzle, internalRows));
    generator.next();
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

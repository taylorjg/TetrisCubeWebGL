import { Puzzle }  from './puzzle';
import { buildInternalRows } from './internalRowBuilder';
import { buildDlxMatrix } from './dlxMatrixBuilder';
import { solutionGenerator } from 'dlxlib';

export * from './colours';

export const solve = (onSearchStep, onSolutionFound) => {
    const puzzle = new Puzzle;
    const internalRows = buildInternalRows(puzzle);
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

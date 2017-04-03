import { Puzzle }  from './puzzle';
import { buildInternalRows } from './internalRowBuilder';
import { buildDlxMatrix } from './dlxMatrixBuilder';
import dlxSolve from '../dlxlib';

const internalOnSearchStep = (onSearchStep, internalRows) =>
    rowIndices => onSearchStep(internalRows, rowIndices);

const internalOnSolutionFound = (onSolutionFound, internalRows) =>
    rowIndices => onSolutionFound(internalRows, rowIndices);

const noop = () => {};
    
export const solve = (onSearchStep, onSolutionFound) => {
    const puzzle = new Puzzle;
    const internalRows = buildInternalRows(puzzle);
    const dlxMatrix = buildDlxMatrix(puzzle, internalRows);
    return dlxSolve(
        dlxMatrix,
        internalOnSearchStep(onSearchStep || noop, internalRows),
        internalOnSolutionFound(onSolutionFound || noop, internalRows));
};

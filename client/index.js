import { Puzzle, buildInternalRows, buildDlxMatrix } from '../solving';
import dlxSolve from '../dlxlib';

const puzzle = new Puzzle();
const internalRows = buildInternalRows(puzzle);
const dlxMatrix = buildDlxMatrix(puzzle, internalRows).map(x => x.bits);
const solutionGenerator = dlxSolve(dlxMatrix);
const firstSolution = solutionGenerator.next();
console.log(`firstSolution: ${JSON.stringify(firstSolution)}`);

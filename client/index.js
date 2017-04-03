import { solve } from '../solving';

let searchStepCount = 0;

const onSearchStep = (puzzle, internalRows) => {
    console.log(`[onSearchStep] searchStepCount: ${searchStepCount}`);
    searchStepCount++;
};

const onSolutionFound = (puzzle, internalRows) => {
    console.log(`[onSolutionFound]`);
    internalRows.forEach((internalRow, index) =>
        console.log(`[${index}]: ${internalRow.name}; ${JSON.stringify(internalRow.occupiedSquares)}`));
};

const solutionGenerator = solve(onSearchStep, onSolutionFound);
solutionGenerator.next();

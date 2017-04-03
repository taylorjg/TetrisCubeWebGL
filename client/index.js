import { solve } from '../solving';

let searchStepCount = 0;

const onSearchStep = (internalRows, rowIndices) => {
    console.log(`[onSearchStep] searchStepCount: ${searchStepCount}; rowIndices: ${JSON.stringify(rowIndices)}`);
    searchStepCount++;
};

const onSolutionFound = (internalRows, rowIndices) => {
    console.log(`[onSolutionFound] rowIndices: ${JSON.stringify(rowIndices)}`);
};

const solutionGenerator = solve(onSearchStep, onSolutionFound);
solutionGenerator.next();

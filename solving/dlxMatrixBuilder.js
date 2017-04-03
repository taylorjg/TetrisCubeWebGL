export const buildDlxMatrix = (puzzle, internalRows) => {
    const dictionary = buildDictionary(puzzle.pieces);
    return internalRows.map(internalRow => buildDlxRow(puzzle, dictionary, internalRow));
};

const buildDictionary = pieces => {
    const dictionary = {};
    pieces.map((piece, index) => dictionary[piece.name] = index);
    return dictionary;
};

const buildDlxRow = (puzzle, dictionary, internalRow) => {
    const pieceColumnIndex = dictionary[internalRow.name];
    const numPieces = puzzle.pieces.length;
    const bits = Array(numPieces + puzzle.cubeSizeCubed).fill(0);
    bits[pieceColumnIndex] = 1;
    internalRow.occupiedSquares.forEach(occupiedSquare => {
        const occupiedSquareIndex =
            numPieces +
            occupiedSquare.x +
            occupiedSquare.y * puzzle.cubeSize +
            occupiedSquare.z * puzzle.cubeSizeSquared;
        bits[occupiedSquareIndex] = 1;
    });
    return bits;
};

export class InternalRow {
    constructor(placedPiece) {
        this.name = placedPiece.name;
        this.colour = placedPiece.colour;
        this.occupiedSquares = placedPiece.occupiedSquares;
    }
}

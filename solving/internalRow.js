export class InternalRow {
    constructor(placedPiece) {
        this.name = placedPiece.name;
        this.colour = placedPiece.colour;
        this.rotations = placedPiece.rotations;
        this.location = placedPiece.location;
        this.occupiedSquares = placedPiece.occupiedSquares;
    }
}

export class PlacedPiece {
    constructor(rotatedPiece, location) {
        this.name = rotatedPiece.name;
        this.colour = rotatedPiece.colour;
        this.occupiedSquares = rotatedPiece.occupiedSquares.map(coords => coords.add(location));
    }
}

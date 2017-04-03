export class PlacedPiece {
    constructor(rotatedPiece, location) {
        this.name = rotatedPiece.name;
        this.colour = rotatedPiece.colour;
        this.rotations = rotatedPiece.rotations;
        this.location = location;
        this.occupiedSquares = rotatedPiece.occupiedSquares.map(coords => coords.add(location));
    }
}

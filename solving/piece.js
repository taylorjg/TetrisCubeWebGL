import { Coords } from './coords';
import { range } from './utils';

export class Piece {
    constructor(initStrings, colour, name) {
        this.colour = colour;
        this.name = name;
        this.width = initStrings[0][0].length;
        this.height = initStrings[0].length;
        this.depth = initStrings.length;
        this.occupiedSquares = [];
        for (x of range(this.width)) {
            for (y of range(this.height)) {
                for (z of range(this.depth)) {
                    if (initStrings[z][this.height - y - 1][x] === 'X') {
                        this.occupiedSquares.push(new Coords(x, y, z));
                    }
                }
            }
        }
    }
}

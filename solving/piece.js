import { Coords } from './coords';
import { range } from './utils';

export class Piece {
    constructor(initStrings, colour, name) {
        this.colour = colour;
        this.name = name;
        this.width = initStrings[0].length;
        this.height = initStrings.length;
        this.depth = 1;
        this.occupiedSquares = [];
        for (let x of range(this.width)) {
            for (let y of range(this.height)) {
                if (initStrings[this.height - y - 1][x] === 'X') {
                    this.occupiedSquares.push(new Coords(x, y, 0));
                }
            }
        }
    }
}

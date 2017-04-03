import { Piece } from './piece';
import { range } from './utils';
import * as S from './shapes';
import * as C from './colours';

const makeAllPieces = () =>
    [].concat(
        makePieces(S.SHAPE_L, C.COLOUR_ORANGE, ['A']),
        makePieces(S.SHAPE_L, C.COLOUR_CERISE, ['B', 'C']),
        makePieces(S.SHAPE_T, C.COLOUR_MAGENTA, ['D', 'E', 'F', 'G']),
        makePieces(S.SHAPE_S, C.COLOUR_RED, ['H', 'I']),
        makePieces(S.SHAPE_S, C.COLOUR_GREEN, ['J', 'K']),
        makePieces(S.SHAPE_O, C.COLOUR_YELLOW, ['L', 'M', 'N']),
        makePieces(S.SHAPE_I, C.COLOUR_BLUE, ['O', 'P']));

const makePieces = (shape, colour, names) =>
    names.map(name => new Piece(shape, colour, name));

export class Puzzle {
    constructor() {
        this.cubeSize = 4;
        this.cubeSizeSquared = this.cubeSize * this.cubeSize;
        this.cubeSizeCubed = this.cubeSizeSquared * this.cubeSize;
        this.ascendingDimensionIndices = range(this.cubeSize);
        this.descendingDimensionIndices = this.ascendingDimensionIndices.reverse();
        this.pieces = makeAllPieces();
    }
}

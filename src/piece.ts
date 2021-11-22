
enum Orientation {
    Up = 0,
    Left,
    Down,
    Right,
}

class PieceFactory {

    // the next piece-type
    private nextPieceType: number;
    // the next piece-color
    private nextColor : string;

    constructor() {
        this.nextColor = random(COLORS);
        this.nextPieceType = random([0,1,2,3]);
    }

    /**
     * returns the piece that could be peeked by peekNext(...) and calculates
     * the next piece
     */
    public createNewPiece(pos: Point) : Piece {
        let nextPiece = this.buildPiece(pos);
        this.nextColor = random(COLORS);
        this.nextPieceType = random([0,1,2,3]);
        return nextPiece;
    }

    /**
     * peek the current piece without calculating the next one
     * @param pos 
     * @returns 
     */
    public peekNext(pos:Point): Piece {
        return this.buildPiece(pos);
    }

    /**
     * builds the piece according to this.next and this.nextColor
     * @param pos 
     * @returns 
     */
    private buildPiece(pos: Point){
        switch (this.nextPieceType) {
            case 0:
                return new BlockPiece(pos, this.nextColor);
            case 1:
                return new StreightPiece(pos, this.nextColor);
            case 2:
                return new ZPiece(pos, this.nextColor);
            case 3:
            default:
                return new LPiece(pos, this.nextColor);
        }
    }
}

/**
 * all supported colors
 */
const COLORS: string[] = ['orangered', 'greenyellow', 'gold', 'deepskyblue', 'turquoise', 'violet'];

abstract class Piece {
    protected pos: Point;
    protected orientation: Orientation = Orientation.Up;
    private color: string;

    public constructor(p: Point, c: string) {
        this.pos = p;
        this.color = c;
    }

    public static createRandomPiece(pos: Point) : Piece {
        let c = random(COLORS);
        let pieces = [
            new BlockPiece(pos, c),
            new StreightPiece(pos, c),
            new ZPiece(pos, c),
            new LPiece(pos, c),
        ]
        return random(pieces);
    }

    public getColor() : string {
        return this.color;
    }

    /**
     * returns the absolute coordinates of fields blocked by this
     * piece at it's current location and it's current orientation
     */
    public abstract getBlockedFields(): Point[]; 

    /**
     * moves this piece by deltaX and deltaY fields
    */
    public move(deltaX: number, deltaY: number) {
        this.pos = new Point(this.pos.getX() + deltaX, this.pos.getY() + deltaY);
    }

    /**
     * turns the piece clockwise.
     * @see getBlockedFields will return different fields after this call 
     */
    public turnClockwise() {
        this.orientation = (this.orientation - 1) % 4;
    }

    /**
     * turns the piece counter clockwise.
     * @see getBlockedFields will return different fields after this call 
     */
    public turnCounterClockwise() {
        this.orientation = (this.orientation + 1) % 4;
    }

    
}

class BlockPiece extends Piece {
    constructor(p: Point, c: string) {
        super(p, c)
    }

    getBlockedFields(): Point[] {
        //   0 1
        // 0 x x
        // 1 x x
        return [
            this.pos,
            this.pos.getNeighbour(1, 0),
            this.pos.getNeighbour(0, 1),
            this.pos.getNeighbour(1, 1),
        ];
    }
}

class StreightPiece extends Piece {

    constructor(p: Point, c: string) {
        super(p, c)
    }

    getBlockedFields() {
        switch (this.orientation) {
            case Orientation.Up:
            case Orientation.Down:
                // x
                // x
                // x
                // x
                return [
                    this.pos,
                    this.pos.getNeighbour(0, 1),
                    this.pos.getNeighbour(0, 2),
                    this.pos.getNeighbour(0, 3),
                ];
            default:
                // x x x x 
                return [
                    this.pos,
                    this.pos.getNeighbour(1, 0),
                    this.pos.getNeighbour(2, 0),
                    this.pos.getNeighbour(3, 0),
                ];
        }
    }
}

class ZPiece extends Piece {

    constructor(p: Point, c: string) {
        super(p, c)
    }

    getBlockedFields() {
        switch (this.orientation) {
            case Orientation.Up:
            case Orientation.Down:
                // x x
                //   x x
                return [
                    this.pos,
                    this.pos.getNeighbour(1, 0),
                    this.pos.getNeighbour(1, 1),
                    this.pos.getNeighbour(2, 1),
                ];
            default:
                //   x
                // x x
                // x
                return [
                    this.pos.getNeighbour(1, 0),
                    this.pos.getNeighbour(1, 1),
                    this.pos.getNeighbour(0, 1),
                    this.pos.getNeighbour(0, 2),
                ];
        }
    }
}

class LPiece extends Piece {

    constructor(p: Point, c: string) {
        super(p, c)
    }
    getBlockedFields() {
        switch (this.orientation) {
            case Orientation.Up:
                // x
                // x
                // x x
                return [
                    this.pos,
                    this.pos.getNeighbour(0, 1),
                    this.pos.getNeighbour(0, 2),
                    this.pos.getNeighbour(1, 2),
                ];
            case Orientation.Left:
                //     x
                // x x x
                return [
                    this.pos.getNeighbour(0, 1),
                    this.pos.getNeighbour(1, 1),
                    this.pos.getNeighbour(2, 1),
                    this.pos.getNeighbour(2, 0),
                ];
            case Orientation.Down:
                // x x
                //   x
                //   x
                return [
                    this.pos,
                    this.pos.getNeighbour(1, 0),
                    this.pos.getNeighbour(1, 1),
                    this.pos.getNeighbour(1, 2),
                ];
            default:
                // x x x
                // x
                return [
                    this.pos,
                    this.pos.getNeighbour(1, 0),
                    this.pos.getNeighbour(2, 0),
                    this.pos.getNeighbour(0, 1),
                ];
        }
    }
}
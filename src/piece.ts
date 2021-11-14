
enum Orientation {
    Up = 0,
    Left,
    Down,
    Right,
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

    /**
     * creates a random piece
     * @param pos the initial position of the new piece
     * @returns the new piece 
     */
    public static createRandomPiece(pos: Point): Piece {
        let c = random(COLORS);
        let pieces = [
            new BlockPiece(pos, c),
            new StreightPiece(pos, c),
            new ZPiece(pos, c),
            new LPiece(pos, c),
        ]
        return random(pieces);
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
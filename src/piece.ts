
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

class Piece {

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
    public  getBlockedFields(): Point[] {
        if (this.orientation == Orientation.Up || this.orientation == Orientation.Down) {
            //  o
            //  o
            //  o
            //  o
            return [
                this.pos,
                this.pos.getNeighbour(0, 1), 
                this.pos.getNeighbour(0, 2), 
                this.pos.getNeighbour(0, 3), 
            ]
        } else {
            // left & right

            //  o o o o
            return [
                this.pos,
                this.pos.getNeighbour(1, 0), 
                this.pos.getNeighbour(2, 0), 
                this.pos.getNeighbour(3, 0), 
            ]
        }
    }

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
            new Piece(pos, c),
            //todo add additional pieces here
       ]
        return random(pieces);
    }
}

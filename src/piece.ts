
enum Orientation {
    Up = 0,
    Left,
    Down,
    Right,
}

const COLORS: string[] = ['orangered', 'greenyellow', 'gold', 'deepskyblue', 'turquoise', 'violet'];

abstract class Piece {

    protected pos: Point;
    protected orientation: Orientation = Orientation.Up;
    private color: string;

    constructor(p: Point, c: string) {
        this.pos = p;
        this.color = c;
    }

    public getColor(): string {
        return this.color;
    }

    public getOcupiedFields(): Point[] {
        return [];
    }

    public move(deltaX: number, deltaY: number) {
        this.pos = new Point(this.pos.getX() + deltaX, this.pos.getY() + deltaY);
    }

    turnDown() {
        this.orientation = (this.orientation - 1) % 4;
    }
    turnUp() {
        this.orientation = (this.orientation + 1) % 4;
    }

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

    getOcupiedFields(): Point[] {
        //   0 1
        // 0 x x
        // 1 x x
        return [
            this.pos,
            this.pos.cloneRelative(1, 0),
            this.pos.cloneRelative(0, 1),
            this.pos.cloneRelative(1, 1),
        ];
    }
}

class StreightPiece extends Piece {

    constructor(p: Point, c: string) {
        super(p, c)
    }

    getOcupiedFields() {
        switch (this.orientation) {
            case Orientation.Up:
            case Orientation.Down:
                // x
                // x
                // x
                // x
                return [
                    this.pos,
                    this.pos.cloneRelative(0, 1),
                    this.pos.cloneRelative(0, 2),
                    this.pos.cloneRelative(0, 3),
                ];
            default:
                // x x x x 
                return [
                    this.pos,
                    this.pos.cloneRelative(1, 0),
                    this.pos.cloneRelative(2, 0),
                    this.pos.cloneRelative(3, 0),
                ];
        }
    }
}

class ZPiece extends Piece {

    constructor(p: Point, c: string) {
        super(p, c)
    }

    getOcupiedFields() {
        switch (this.orientation) {
            case Orientation.Up:
            case Orientation.Down:
                // x x
                //   x x
                return [
                    this.pos,
                    this.pos.cloneRelative(1, 0),
                    this.pos.cloneRelative(1, 1),
                    this.pos.cloneRelative(2, 1),
                ];
            default:
                //   x
                // x x
                // x
                return [
                    this.pos.cloneRelative(1, 0),
                    this.pos.cloneRelative(1, 1),
                    this.pos.cloneRelative(0, 1),
                    this.pos.cloneRelative(0, 2),
                ];
        }
    }
}

class LPiece extends Piece {

    constructor(p: Point, c: string) {
        super(p, c)
    }
    getOcupiedFields() {
        switch (this.orientation) {
            case Orientation.Up:
                // x
                // x
                // x x
                return [
                    this.pos,
                    this.pos.cloneRelative(0, 1),
                    this.pos.cloneRelative(0, 2),
                    this.pos.cloneRelative(1, 2),
                ];
            case Orientation.Left:
                //     x
                // x x x
                return [
                    this.pos.cloneRelative(0, 1),
                    this.pos.cloneRelative(1, 1),
                    this.pos.cloneRelative(2, 1),
                    this.pos.cloneRelative(2, 0),
                ];
            case Orientation.Down:
                // x x
                //   x
                //   x
                return [
                    this.pos,
                    this.pos.cloneRelative(1, 0),
                    this.pos.cloneRelative(1, 1),
                    this.pos.cloneRelative(1, 2),
                ];
            default:
                // x x x
                // x
                return [
                    this.pos,
                    this.pos.cloneRelative(1, 0),
                    this.pos.cloneRelative(2, 0),
                    this.pos.cloneRelative(0, 1),
                ];
        }
    }
}


class GameField {
    /**
     * 2 dim array representing the game-field
     * a cell may contain a color from COLOR or EMPTY
     */
    private field : Box[][];
    /**
     * the time of the last game-tick
     */
    private lastTick : number = 0;
    /**
     * the active piece which moves at game-ticks
     */
    private activePiece : Piece;

    private fieldWidth : number;
    private fieldHeight : number;
    private newPiecePos: Point;

    constructor(width: number, height: number, posOfNewPiece: Point) {
        this.fieldWidth = width;
        this.fieldHeight = height;
        this.newPiecePos = posOfNewPiece;
        this.field = [];
        //initialize the game field
        for (let x = 0; x < this.fieldWidth; x++) {
            this.field[x] = [];
            for (let y = 0; y < this.fieldHeight; y++) {
                this.field[x][y] = new Box(new Point(x, y));
            }
        }
        this.placeNewActivePiece();
        this.lastTick = Date.now();
    }

    getLastTick() {
        return this.lastTick;
    }

    public placeNewActivePiece() {
        this.activePiece = Piece.createRandomPiece(this.newPiecePos)
        this.placePiece(this.activePiece);
    }

    /**
     * removes the given item from the baord.
     * this clears all the item's fields to EMPTY
     */
    public deletePiece(piece: Piece) {
        this.doPlacePiece(piece.getOcupiedFields(), Box.EMPTY);
    }

    /**
     * places the given item on the board.
     * technically this sets the item's fields to 
     * the item's color
     */
    public placePiece(piece: Piece) {
        this.doPlacePiece(piece.getOcupiedFields(), piece.getColor());
    }

    /**
     * draws the current state of the field
     */
    public draw() {
        push();
        translate(50, 50);
        stroke('#bfbfbf');
        strokeWeight(2);

        for (let x = 0; x < this.fieldWidth; x++) {
            for (let y = 0; y < this.fieldHeight; y++) {
                const field = this.field[x][y];
                field.draw();
            }
        }
        pop();
    }

    /**
     * perform a game tick. A Game-Tick means to perform
     * a "turn" or "move". This means that a the active piece
     * moves and/or a new piece is introduced into the game
     */
    public tick() {
        //delete the current piece from the board
        let now = Date.now();
        if (now - this.lastTick > 250) {
            if (!this.move(0, 1)) {
                this.placeNewActivePiece();
            }
            this.lastTick = Date.now();
        }
    }

    public move(deltaX: number, deltaY: number) {
        this.deletePiece(this.activePiece);
        this.activePiece.move(deltaX, deltaY);
        if (this.hasConflict(this.activePiece)){
            //move back
            this.activePiece.move(-deltaX, -deltaY);
            this.placePiece(this.activePiece);
            //get new item
            return false;
        }else{
            this.placePiece(this.activePiece);
        }
        return true;
    }

    public turn() {
        this.deletePiece(this.activePiece);
        this.activePiece.turnUp();
        if (this.hasConflict(this.activePiece)) {
            this.activePiece.turnDown();
        }
        this.placePiece(this.activePiece);
    }

    public down() {
        while(this.move(0, 1)){
        }
        this.placeNewActivePiece();
    }

    private hasConflict(piece: Piece): boolean {
        let fields = piece.getOcupiedFields();
        for (const f of fields) {
            let field = this.getField(f);
            if (field.isFull()) {
                return true;
            }
        }
        return false;
    }

    /**
     * returns the field at the given coordinates
     */
    private getField(pos: Point) {
        if (pos.getX() >= 0 && pos.getX() < this.fieldWidth
            && pos.getY() >= 0 && pos.getY() < this.fieldHeight) {
            return this.field[pos.getX()][pos.getY()];
        }
        return new Border();
    }

    /**
     * helper method that updates the field's 
     */
    private doPlacePiece(fields: Point[], color: string) {
        for (const p of fields) {
            let f = this.getField(p);
            f.fill(color);
        }
    }
}
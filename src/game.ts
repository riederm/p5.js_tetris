

class Game {

    private field: GameField;

    /**
     * the time of the last game-tick
     */
    private lastTick : number = 0;
    /**
     * the active piece which moves at game-ticks
     */
    private activePiece : Piece;


    private newPiecePos: Point;

    constructor(width: number, height: number, posOfNewPiece: Point) {
        this.field = new GameField(width, height);
        this.newPiecePos = posOfNewPiece;
        this.placeNewActivePiece();
        this.lastTick = Date.now();
    }

    /**
     * @returns the time of the last game-tick
     */
    getLastTick() {
        return this.lastTick;
    }

    /**
     * aquires a new random piece to play
     */
    public placeNewActivePiece() {
        this.activePiece = Piece.createRandomPiece(this.newPiecePos)
        this.placePiece(this.activePiece);
    }

    /**
     * removes the given item from the baord.
     * this clears all the item's fields to EMPTY
     * @param piece 
     */
    public deletePiece(piece: Piece) {
        this.field.fillAllFields(piece.getOcupiedFields(), Field.EMPTY);
    }

    /**
     * places the given item on the board.
     * technically this sets the item's fields to 
     * the item's color
     * @param piece 
     */
    public placePiece(piece: Piece) {
        this.field.fillAllFields(piece.getOcupiedFields(), piece.getColor());
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

        this.field.draw();
    }

    /**
     * tries to move the piece
     * @param deltaX the movement on the x-axis
     * @param deltaY the movement on the y-axis
     * @returns true if the piece was moved, false if it could not be moved
     */
    public move(deltaX: number, deltaY: number) {
        // remove piece from game field
        this.deletePiece(this.activePiece);
        // move the piece
        this.activePiece.move(deltaX, deltaY);
        // see if this would cause a conflict
        if (this.hasConflict(this.activePiece)){
            // outch - conflict
            //move piece back to where it was
            this.activePiece.move(-deltaX, -deltaY);
            // and place it back onto the board
            this.placePiece(this.activePiece);
            // we were not able to move the piece
            return false;
        }else{
            // no conflict
            // so lets place the piece at the new position
            this.placePiece(this.activePiece);
            // yes we were able to move the piece
            return true;
        }
    }

    /**
     * tries to turn the piece
     */
    public turn() {
        // remove the piece from the board
        this.deletePiece(this.activePiece);
        // turn the piece
        this.activePiece.turnUp();
        // see if this would cause a conflict
        if (this.hasConflict(this.activePiece)) {
            // outch - conflict
            // turn it back to its original position
            this.activePiece.turnDown();
        }
        // place piece back onto the board
        this.placePiece(this.activePiece);
    }

    /**
     * moves the piece down until it "hits the ground"
     */
    public down() {
        // move down until we can no longer move
        while(this.move(0, 1)){
        }
        // get a new piece
        this.placeNewActivePiece();
    }

    /**
     * checks whether the given piece causes a conflict with the current state of the board
     * @param piece 
     * @returns true if the given piece causes a conflict, otherwhise false
     */
    private hasConflict(piece: Piece): boolean {
        let fields = piece.getOcupiedFields();
        for (const f of fields) {
            let field = this.field.getField(f);
            if (field.isFull()) {
                return true;
            }
        }
        return false;
    }


    
}
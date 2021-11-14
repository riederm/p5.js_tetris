
enum Key {
    Up, Down, Left, Right
}


class GameEngine {

    private field: GameField;
    /**
     * the time of the last game-tick
     */
    private lastTick : number = 0;
    /**
     * the active piece which moves at game-ticks
     */
    private activePiece : Piece;

    /**
     * the positoin where a new piece appears
     */
    private newPiecePos: Point;

    public constructor(width: number, height: number, posOfNewPiece: Point) {
        this.field = new GameField(width, height);
        this.newPiecePos = posOfNewPiece;
        this.placeNewActivePiece();
        this.lastTick = Date.now();
    }

    /**
     * aquires a new random piece to play
     */
    private placeNewActivePiece() {
        this.activePiece = Piece.createRandomPiece(this.newPiecePos)
        this.placePiece(this.activePiece);
    }

    /**
     * removes the given item from the baord.
     * this clears all the item's fields to EMPTY
     * @param piece 
     */
    private deletePiece(piece: Piece) {
        this.field.fillFields(piece.getBlockedFields(), Field.EMPTY);
    }

    /**
     * places the given item on the board.
     * technically this sets the item's fields to 
     * the item's color
     * @param piece 
     */
    private placePiece(piece: Piece) {
        this.field.fillFields(piece.getBlockedFields(), piece.getColor());
    }

    /**
     * perform a game tick. A Game-Tick means to perform
     * a "turn" or "move". This means that a the active piece
     * moves and/or a new piece is introduced into the game
     */
    public gameTick() {
        //delete the current piece from the board
        let now = Date.now();
        if (now - this.lastTick > 250) {
            if (!this.moveIfPossible(0, 1)) {
                this.placeNewActivePiece();
            }
            this.lastTick = Date.now();
        }

        this.field.draw();
    }

    public keyPressed(key: Key) {
        switch (key) {
            case Key.Up:
                    //turn the active piece
                    this.turnIfPossible();                
                break;
            case Key.Down:
                    this.down();
                break;
            case Key.Left:
                    this.moveIfPossible(-1, 0);
                break;
            case Key.Right:
                    this.moveIfPossible(1, 0);
                break;
            default:
                console.error("unknown key: ", key);
        }
    }

    /**
     * tries to move the piece
     * @param deltaX the movement on the x-axis
     * @param deltaY the movement on the y-axis
     * @returns true if the piece was moved, false if it could not be moved
     */
    private moveIfPossible(deltaX: number, deltaY: number) {
        // remove piece from game field
        this.deletePiece(this.activePiece);

        // TODO see if move is possible
        // move the piece
        this.activePiece.move(deltaX, deltaY);

        // block new fields
        this.placePiece(this.activePiece);

        return true
    }

    /**
     * tries to turn the piece
     */
    private turnIfPossible() {
        // remove the piece from the board
        this.deletePiece(this.activePiece);
        // turn the piece
        this.activePiece.turnCounterClockwise();

        //TODO see if turn is possible

        // place piece back onto the board
        this.placePiece(this.activePiece);
    }

    /**
     * moves the piece down until it "hits the ground"
     */
    private down() {
        //TODO implement me
    }
    
}
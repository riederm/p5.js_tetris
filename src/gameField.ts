
class GameField {
    /**
     * 2 dim array representing the game-field
     * a cell may contain a color from COLOR or EMPTY
     */
    private field : Field[][];

    private fieldWidth : number;
    private fieldHeight : number;

    public constructor(width: number, height: number) {
        this.fieldWidth = width;
        this.fieldHeight = height;
        this.field = [];
        //initialize the game field
        for (let x = 0; x < this.fieldWidth; x++) {
            this.field[x] = [];
            for (let y = 0; y < this.fieldHeight; y++) {
                this.field[x][y] = new Field(new Point(x, y));
            }
        }
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
     * @param pos 
     * @returns the field at the given coordinates
     */
    public getField(pos: Point) {
        return this.field[pos.getX()][pos.getY()];
    }

    /**
     * helper method that fills all fields with the given color
     * @param fields coordiantes of the fields to fill
     * @param color the color
     */
    public fillFields(fields: Point[], color: string) {
        for (const p of fields) {
            let f = this.getField(p);
            f.fill(color);
        }
    }

    public clearAll() {
        for (let x = 0; x < this.fieldWidth; x++) {
            for (let y = 0; y < this.fieldHeight; y++) {
                const field = this.field[x][y];
                field.clear();
            }
        }
    }
}
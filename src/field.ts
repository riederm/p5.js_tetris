const BOX_WIDTH_PIXEL = 25;

class Field {
    public static EMPTY : string = 'white';

    private pos: Point;
    private color: string = 'white';

    public constructor(p: Point) {
        this.pos = p;
    }

    public fill(color: string) {
        this.color = color;
    }

    public isBlocked(): boolean {
        return this.color !== Field.EMPTY;
    }

    public clear() {
        this.color = Field.EMPTY;
    }

    public draw() {
        fill(this.color);
        rect(this.pos.getX() * BOX_WIDTH_PIXEL, this.pos.getY() * BOX_WIDTH_PIXEL, BOX_WIDTH_PIXEL, BOX_WIDTH_PIXEL);
    }
}


class BorderField extends Field {
    constructor() {
        super(null);
    }

    public isBlocked() : boolean{
        return true; //this is always full
    }

    public draw(){
        //ignore drawing this
    }
}
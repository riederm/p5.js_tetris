const BOX_WIDTH_PIXEL = 25;



class Box {
    public static EMPTY : string = 'white';

    private pos: Point;
    private color: string = 'white';

    constructor(p: Point) {
        this.pos = p;
    }

    public fill(color: string) {
        this.color = color;
    }

    public isFull(): boolean {
        return this.color !== Box.EMPTY;
    }

    public clear() {
        this.color = Box.EMPTY;
    }

    public draw() {
        fill(this.color);
        rect(this.pos.getX() * BOX_WIDTH_PIXEL, this.pos.getY() * BOX_WIDTH_PIXEL, BOX_WIDTH_PIXEL, BOX_WIDTH_PIXEL);
    }
}


class Border extends Box {
    constructor() {
        super(null);
    }

    public isFull() : boolean{
        return true; //this is always full
    }

    public draw(){
        //ignore drawing this
    }
}
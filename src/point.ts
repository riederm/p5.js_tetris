
class Point {
    
    private x: number;
    private y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public getX() {
        return this.x;
    }

    public getY() {
        return this.y;
    }

    cloneRelative(relX: number, relY: number): Point {
        return new Point(this.x + relX, this.y + relY);
    }
}
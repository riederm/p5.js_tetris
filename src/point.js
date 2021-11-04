
export class Point {
    #x = 0;
    #y = 0;
    
    constructor(x, y) {
        this.#x = x;
        this.#y = x;
    }

    getX() {
        return this.#x;
    }

    getY() {
        return this.#y;
    }

    cloneRelative(x, y) {
        return new Point(this.#x + x, this.#y + y);
    }
}
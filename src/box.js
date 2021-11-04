
export const EMPTY = 'white';
const BOX_WIDTH_PIXEL = 25;

export class Box {
    x = 0;
    y = 0;
    color = EMPTY;

    constructor(_x, _y) {
        this.x = _x;
        this.y = _y;
    }

    draw(p5){
        console.log(this.color);
        p5.fill(this.color);
        p5.rect(this.x * BOX_WIDTH_PIXEL, this.y * BOX_WIDTH_PIXEL, BOX_WIDTH_PIXEL, BOX_WIDTH_PIXEL);
    }

    isFull() {
        return this.color != EMPTY;
    }

    fill(color) {
        this.color = color;
    }

    getColor() {
        return this.color;
    }

    getWidth() {
        return BOX_WIDTH_PIXEL;
    }

    getHeight() {
        return BOX_WIDTH_PIXEL;
    }

    getAbsX() {
        return this.x * this.getWidth();
    }

    getAbsY() {
        return this.y * this.getHeight(); 
    }
}
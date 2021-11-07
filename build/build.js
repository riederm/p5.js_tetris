var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var BOX_WIDTH_PIXEL = 25;
var Box = (function () {
    function Box(p) {
        this.color = 'white';
        this.pos = p;
    }
    Box.prototype.fill = function (color) {
        this.color = color;
    };
    Box.prototype.isFull = function () {
        return this.color !== Box.EMPTY;
    };
    Box.prototype.clear = function () {
        this.color = Box.EMPTY;
    };
    Box.prototype.draw = function () {
        fill(this.color);
        rect(this.pos.getX() * BOX_WIDTH_PIXEL, this.pos.getY() * BOX_WIDTH_PIXEL, BOX_WIDTH_PIXEL, BOX_WIDTH_PIXEL);
    };
    Box.EMPTY = 'white';
    return Box;
}());
var Border = (function (_super) {
    __extends(Border, _super);
    function Border() {
        return _super.call(this, null) || this;
    }
    Border.prototype.isFull = function () {
        return true;
    };
    Border.prototype.draw = function () {
    };
    return Border;
}(Box));
var GameField = (function () {
    function GameField(width, height, posOfNewPiece) {
        this.lastTick = 0;
        this.fieldWidth = width;
        this.fieldHeight = height;
        this.newPiecePos = posOfNewPiece;
        this.field = [];
        for (var x = 0; x < this.fieldWidth; x++) {
            this.field[x] = [];
            for (var y = 0; y < this.fieldHeight; y++) {
                this.field[x][y] = new Box(new Point(x, y));
            }
        }
        this.placeNewActivePiece();
        this.lastTick = Date.now();
    }
    GameField.prototype.getLastTick = function () {
        return this.lastTick;
    };
    GameField.prototype.placeNewActivePiece = function () {
        this.activePiece = Piece.createRandomPiece(this.newPiecePos);
        this.placePiece(this.activePiece);
    };
    GameField.prototype.deletePiece = function (piece) {
        this.doPlacePiece(piece.getOcupiedFields(), Box.EMPTY);
    };
    GameField.prototype.placePiece = function (piece) {
        this.doPlacePiece(piece.getOcupiedFields(), piece.getColor());
    };
    GameField.prototype.draw = function () {
        push();
        translate(50, 50);
        stroke('#bfbfbf');
        strokeWeight(2);
        for (var x = 0; x < this.fieldWidth; x++) {
            for (var y = 0; y < this.fieldHeight; y++) {
                var field = this.field[x][y];
                field.draw();
            }
        }
        pop();
    };
    GameField.prototype.tick = function () {
        var now = Date.now();
        if (now - this.lastTick > 250) {
            if (!this.move(0, 1)) {
                this.placeNewActivePiece();
            }
            this.lastTick = Date.now();
        }
    };
    GameField.prototype.move = function (deltaX, deltaY) {
        this.deletePiece(this.activePiece);
        this.activePiece.move(deltaX, deltaY);
        if (this.hasConflict(this.activePiece)) {
            this.activePiece.move(-deltaX, -deltaY);
            this.placePiece(this.activePiece);
            return false;
        }
        else {
            this.placePiece(this.activePiece);
        }
        return true;
    };
    GameField.prototype.turn = function () {
        this.deletePiece(this.activePiece);
        this.activePiece.turnUp();
        if (this.hasConflict(this.activePiece)) {
            this.activePiece.turnDown();
        }
        this.placePiece(this.activePiece);
    };
    GameField.prototype.down = function () {
        while (this.move(0, 1)) {
        }
        this.placeNewActivePiece();
    };
    GameField.prototype.hasConflict = function (piece) {
        var fields = piece.getOcupiedFields();
        for (var _i = 0, fields_1 = fields; _i < fields_1.length; _i++) {
            var f = fields_1[_i];
            var field = this.getField(f);
            if (field.isFull()) {
                return true;
            }
        }
        return false;
    };
    GameField.prototype.getField = function (pos) {
        if (pos.getX() >= 0 && pos.getX() < this.fieldWidth
            && pos.getY() >= 0 && pos.getY() < this.fieldHeight) {
            return this.field[pos.getX()][pos.getY()];
        }
        return new Border();
    };
    GameField.prototype.doPlacePiece = function (fields, color) {
        for (var _i = 0, fields_2 = fields; _i < fields_2.length; _i++) {
            var p = fields_2[_i];
            var f = this.getField(p);
            f.fill(color);
        }
    };
    return GameField;
}());
var Orientation;
(function (Orientation) {
    Orientation[Orientation["Up"] = 0] = "Up";
    Orientation[Orientation["Left"] = 1] = "Left";
    Orientation[Orientation["Down"] = 2] = "Down";
    Orientation[Orientation["Right"] = 3] = "Right";
})(Orientation || (Orientation = {}));
var COLORS = ['red', 'green', 'yellow', 'blue', 'orange', 'pink', 'magenta'];
var Piece = (function () {
    function Piece(p, c) {
        this.orientation = Orientation.Up;
        this.pos = p;
        this.color = c;
    }
    Piece.prototype.getColor = function () {
        return this.color;
    };
    Piece.prototype.getOcupiedFields = function () {
        return [];
    };
    Piece.prototype.move = function (deltaX, deltaY) {
        this.pos = new Point(this.pos.getX() + deltaX, this.pos.getY() + deltaY);
    };
    Piece.prototype.turnDown = function () {
        this.orientation = (this.orientation - 1) % 4;
    };
    Piece.prototype.turnUp = function () {
        this.orientation = (this.orientation + 1) % 4;
    };
    Piece.createRandomPiece = function (pos) {
        var c = random(COLORS);
        var pieces = [
            new BlockPiece(pos, c),
            new StreightPiece(pos, c),
            new ZPiece(pos, c),
            new LPiece(pos, c),
        ];
        return random(pieces);
    };
    return Piece;
}());
var BlockPiece = (function (_super) {
    __extends(BlockPiece, _super);
    function BlockPiece(p, c) {
        return _super.call(this, p, c) || this;
    }
    BlockPiece.prototype.getOcupiedFields = function () {
        return [
            this.pos,
            this.pos.cloneRelative(1, 0),
            this.pos.cloneRelative(0, 1),
            this.pos.cloneRelative(1, 1),
        ];
    };
    return BlockPiece;
}(Piece));
var StreightPiece = (function (_super) {
    __extends(StreightPiece, _super);
    function StreightPiece(p, c) {
        return _super.call(this, p, c) || this;
    }
    StreightPiece.prototype.getOcupiedFields = function () {
        switch (this.orientation) {
            case Orientation.Up:
            case Orientation.Down:
                return [
                    this.pos,
                    this.pos.cloneRelative(0, 1),
                    this.pos.cloneRelative(0, 2),
                    this.pos.cloneRelative(0, 3),
                ];
            default:
                return [
                    this.pos,
                    this.pos.cloneRelative(1, 0),
                    this.pos.cloneRelative(2, 0),
                    this.pos.cloneRelative(3, 0),
                ];
                break;
        }
    };
    return StreightPiece;
}(Piece));
var ZPiece = (function (_super) {
    __extends(ZPiece, _super);
    function ZPiece(p, c) {
        return _super.call(this, p, c) || this;
    }
    ZPiece.prototype.getOcupiedFields = function () {
        switch (this.orientation) {
            case Orientation.Up:
            case Orientation.Down:
                return [
                    this.pos,
                    this.pos.cloneRelative(1, 0),
                    this.pos.cloneRelative(1, 1),
                    this.pos.cloneRelative(2, 1),
                ];
            default:
                return [
                    this.pos.cloneRelative(1, 0),
                    this.pos.cloneRelative(1, 1),
                    this.pos.cloneRelative(0, 1),
                    this.pos.cloneRelative(0, 2),
                ];
        }
    };
    return ZPiece;
}(Piece));
var LPiece = (function (_super) {
    __extends(LPiece, _super);
    function LPiece(p, c) {
        return _super.call(this, p, c) || this;
    }
    LPiece.prototype.getOcupiedFields = function () {
        switch (this.orientation) {
            case Orientation.Up:
                return [
                    this.pos,
                    this.pos.cloneRelative(0, 1),
                    this.pos.cloneRelative(0, 2),
                    this.pos.cloneRelative(1, 2),
                ];
            case Orientation.Left:
                return [
                    this.pos.cloneRelative(0, 1),
                    this.pos.cloneRelative(1, 1),
                    this.pos.cloneRelative(2, 1),
                    this.pos.cloneRelative(2, 0),
                ];
            case Orientation.Down:
                return [
                    this.pos,
                    this.pos.cloneRelative(1, 0),
                    this.pos.cloneRelative(1, 1),
                    this.pos.cloneRelative(1, 2),
                ];
            default:
                return [
                    this.pos,
                    this.pos.cloneRelative(1, 0),
                    this.pos.cloneRelative(2, 0),
                    this.pos.cloneRelative(0, 1),
                ];
        }
    };
    return LPiece;
}(Piece));
var Point = (function () {
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    Point.prototype.getX = function () {
        return this.x;
    };
    Point.prototype.getY = function () {
        return this.y;
    };
    Point.prototype.cloneRelative = function (relX, relY) {
        return new Point(this.x + relX, this.y + relY);
    };
    return Point;
}());
var game;
var preview;
function setup() {
    createCanvas(640, 800);
    game = new GameField(10, 25, new Point(5, 0));
    preview = new GameField(5, 5, new Point(2, 0));
}
function draw() {
    var now = Date.now();
    game.tick();
    push();
    game.draw();
    pop();
    push();
    translate(300, 0);
    preview.draw();
    pop();
}
function keyPressed() {
    if (keyCode === LEFT_ARROW) {
        game.move(-1, 0);
    }
    else if (keyCode == RIGHT_ARROW) {
        game.move(1, 0);
    }
    else if (keyCode == UP_ARROW) {
        game.turn();
    }
    else if (keyCode == DOWN_ARROW) {
        game.down();
    }
}
//# sourceMappingURL=build.js.map
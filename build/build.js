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
var Field = (function () {
    function Field(p) {
        this.color = 'white';
        this.pos = p;
    }
    Field.prototype.fill = function (color) {
        this.color = color;
    };
    Field.prototype.isFull = function () {
        return this.color !== Field.EMPTY;
    };
    Field.prototype.clear = function () {
        this.color = Field.EMPTY;
    };
    Field.prototype.draw = function () {
        fill(this.color);
        rect(this.pos.getX() * BOX_WIDTH_PIXEL, this.pos.getY() * BOX_WIDTH_PIXEL, BOX_WIDTH_PIXEL, BOX_WIDTH_PIXEL);
    };
    Field.EMPTY = 'white';
    return Field;
}());
var BorderField = (function (_super) {
    __extends(BorderField, _super);
    function BorderField() {
        return _super.call(this, null) || this;
    }
    BorderField.prototype.isFull = function () {
        return true;
    };
    BorderField.prototype.draw = function () {
    };
    return BorderField;
}(Field));
var Game = (function () {
    function Game(width, height, posOfNewPiece) {
        this.lastTick = 0;
        this.field = new GameField(width, height);
        this.newPiecePos = posOfNewPiece;
        this.placeNewActivePiece();
        this.lastTick = Date.now();
    }
    Game.prototype.getLastTick = function () {
        return this.lastTick;
    };
    Game.prototype.placeNewActivePiece = function () {
        this.activePiece = Piece.createRandomPiece(this.newPiecePos);
        this.placePiece(this.activePiece);
    };
    Game.prototype.deletePiece = function (piece) {
        this.field.fillAllFields(piece.getOcupiedFields(), Field.EMPTY);
    };
    Game.prototype.placePiece = function (piece) {
        this.field.fillAllFields(piece.getOcupiedFields(), piece.getColor());
    };
    Game.prototype.tick = function () {
        var now = Date.now();
        if (now - this.lastTick > 250) {
            if (!this.move(0, 1)) {
                this.placeNewActivePiece();
            }
            this.lastTick = Date.now();
        }
        this.field.draw();
    };
    Game.prototype.move = function (deltaX, deltaY) {
        this.deletePiece(this.activePiece);
        this.activePiece.move(deltaX, deltaY);
        if (this.hasConflict(this.activePiece)) {
            this.activePiece.move(-deltaX, -deltaY);
            this.placePiece(this.activePiece);
            return false;
        }
        else {
            this.placePiece(this.activePiece);
            return true;
        }
    };
    Game.prototype.turn = function () {
        this.deletePiece(this.activePiece);
        this.activePiece.turnUp();
        if (this.hasConflict(this.activePiece)) {
            this.activePiece.turnDown();
        }
        this.placePiece(this.activePiece);
    };
    Game.prototype.down = function () {
        while (this.move(0, 1)) {
        }
        this.placeNewActivePiece();
    };
    Game.prototype.hasConflict = function (piece) {
        var fields = piece.getOcupiedFields();
        for (var _i = 0, fields_1 = fields; _i < fields_1.length; _i++) {
            var f = fields_1[_i];
            var field = this.field.getField(f);
            if (field.isFull()) {
                return true;
            }
        }
        return false;
    };
    return Game;
}());
var GameField = (function () {
    function GameField(width, height) {
        this.fieldWidth = width;
        this.fieldHeight = height;
        this.field = [];
        for (var x = 0; x < this.fieldWidth; x++) {
            this.field[x] = [];
            for (var y = 0; y < this.fieldHeight; y++) {
                this.field[x][y] = new Field(new Point(x, y));
            }
        }
    }
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
    GameField.prototype.getField = function (pos) {
        if (pos.getX() >= 0 && pos.getX() < this.fieldWidth
            && pos.getY() >= 0 && pos.getY() < this.fieldHeight) {
            return this.field[pos.getX()][pos.getY()];
        }
        return new BorderField();
    };
    GameField.prototype.fillAllFields = function (fields, color) {
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
function setup() {
    createCanvas(640, 800);
    game = new Game(10, 25, new Point(5, 0));
}
function draw() {
    game.tick();
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
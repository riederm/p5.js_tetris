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
    Field.prototype.isBlocked = function () {
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
    BorderField.prototype.isBlocked = function () {
        return true;
    };
    BorderField.prototype.draw = function () {
    };
    return BorderField;
}(Field));
var Key;
(function (Key) {
    Key[Key["Up"] = 0] = "Up";
    Key[Key["Down"] = 1] = "Down";
    Key[Key["Left"] = 2] = "Left";
    Key[Key["Right"] = 3] = "Right";
})(Key || (Key = {}));
var GameEngine = (function () {
    function GameEngine(width, height, posOfNewPiece) {
        this.lastTick = 0;
        this.field = new GameField(width, height);
        this.newPiecePos = posOfNewPiece;
        this.placeNewActivePiece();
        this.lastTick = Date.now();
    }
    GameEngine.prototype.placeNewActivePiece = function () {
        this.activePiece = Piece.createRandomPiece(this.newPiecePos);
        this.placePiece(this.activePiece);
    };
    GameEngine.prototype.deletePiece = function (piece) {
        this.field.fillFields(piece.getBlockedFields(), Field.EMPTY);
    };
    GameEngine.prototype.placePiece = function (piece) {
        this.field.fillFields(piece.getBlockedFields(), piece.getColor());
    };
    GameEngine.prototype.gameTick = function () {
        var now = Date.now();
        if (now - this.lastTick > 250) {
            if (!this.moveIfPossible(0, 1)) {
                this.placeNewActivePiece();
            }
            this.lastTick = Date.now();
        }
        this.field.draw();
    };
    GameEngine.prototype.keyPressed = function (key) {
        switch (key) {
            case Key.Up:
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
    };
    GameEngine.prototype.moveIfPossible = function (deltaX, deltaY) {
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
    GameEngine.prototype.turnIfPossible = function () {
        this.deletePiece(this.activePiece);
        this.activePiece.turnCounterClockwise();
        if (this.hasConflict(this.activePiece)) {
            this.activePiece.turnClockwise();
        }
        this.placePiece(this.activePiece);
    };
    GameEngine.prototype.down = function () {
        while (this.moveIfPossible(0, 1)) {
        }
        this.placeNewActivePiece();
    };
    GameEngine.prototype.hasConflict = function (piece) {
        var fields = piece.getBlockedFields();
        for (var _i = 0, fields_1 = fields; _i < fields_1.length; _i++) {
            var f = fields_1[_i];
            var field = this.field.getField(f);
            if (field.isBlocked()) {
                return true;
            }
        }
        return false;
    };
    return GameEngine;
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
    GameField.prototype.fillFields = function (fields, color) {
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
var COLORS = ['orangered', 'greenyellow', 'gold', 'deepskyblue', 'turquoise', 'violet'];
var Piece = (function () {
    function Piece(p, c) {
        this.orientation = Orientation.Up;
        this.pos = p;
        this.color = c;
    }
    Piece.prototype.getColor = function () {
        return this.color;
    };
    Piece.prototype.move = function (deltaX, deltaY) {
        this.pos = new Point(this.pos.getX() + deltaX, this.pos.getY() + deltaY);
    };
    Piece.prototype.turnClockwise = function () {
        this.orientation = (this.orientation - 1) % 4;
    };
    Piece.prototype.turnCounterClockwise = function () {
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
    BlockPiece.prototype.getBlockedFields = function () {
        return [
            this.pos,
            this.pos.getNeighbour(1, 0),
            this.pos.getNeighbour(0, 1),
            this.pos.getNeighbour(1, 1),
        ];
    };
    return BlockPiece;
}(Piece));
var StreightPiece = (function (_super) {
    __extends(StreightPiece, _super);
    function StreightPiece(p, c) {
        return _super.call(this, p, c) || this;
    }
    StreightPiece.prototype.getBlockedFields = function () {
        switch (this.orientation) {
            case Orientation.Up:
            case Orientation.Down:
                return [
                    this.pos,
                    this.pos.getNeighbour(0, 1),
                    this.pos.getNeighbour(0, 2),
                    this.pos.getNeighbour(0, 3),
                ];
            default:
                return [
                    this.pos,
                    this.pos.getNeighbour(1, 0),
                    this.pos.getNeighbour(2, 0),
                    this.pos.getNeighbour(3, 0),
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
    ZPiece.prototype.getBlockedFields = function () {
        switch (this.orientation) {
            case Orientation.Up:
            case Orientation.Down:
                return [
                    this.pos,
                    this.pos.getNeighbour(1, 0),
                    this.pos.getNeighbour(1, 1),
                    this.pos.getNeighbour(2, 1),
                ];
            default:
                return [
                    this.pos.getNeighbour(1, 0),
                    this.pos.getNeighbour(1, 1),
                    this.pos.getNeighbour(0, 1),
                    this.pos.getNeighbour(0, 2),
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
    LPiece.prototype.getBlockedFields = function () {
        switch (this.orientation) {
            case Orientation.Up:
                return [
                    this.pos,
                    this.pos.getNeighbour(0, 1),
                    this.pos.getNeighbour(0, 2),
                    this.pos.getNeighbour(1, 2),
                ];
            case Orientation.Left:
                return [
                    this.pos.getNeighbour(0, 1),
                    this.pos.getNeighbour(1, 1),
                    this.pos.getNeighbour(2, 1),
                    this.pos.getNeighbour(2, 0),
                ];
            case Orientation.Down:
                return [
                    this.pos,
                    this.pos.getNeighbour(1, 0),
                    this.pos.getNeighbour(1, 1),
                    this.pos.getNeighbour(1, 2),
                ];
            default:
                return [
                    this.pos,
                    this.pos.getNeighbour(1, 0),
                    this.pos.getNeighbour(2, 0),
                    this.pos.getNeighbour(0, 1),
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
    Point.prototype.getNeighbour = function (relX, relY) {
        return new Point(this.x + relX, this.y + relY);
    };
    return Point;
}());
var game;
function setup() {
    createCanvas(640, 800);
    game = new GameEngine(10, 25, new Point(5, 0));
}
function draw() {
    game.gameTick();
}
function keyPressed() {
    switch (keyCode) {
        case LEFT_ARROW:
            game.keyPressed(Key.Left);
            break;
        case RIGHT_ARROW:
            game.keyPressed(Key.Right);
            break;
        case UP_ARROW:
            game.keyPressed(Key.Up);
            break;
        case DOWN_ARROW:
            game.keyPressed(Key.Down);
            break;
        default:
            break;
    }
}
//# sourceMappingURL=build.js.map
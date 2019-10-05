class Character {
    constructor(sprite, positionX, positionY) {
        this.sprite = sprite;
        this._x = positionX || 0;
        this._y = positionY || 0;
    }

    update () {
        // noop
    }

    getPositionX() {
        return this._x;
    }

    getPositionY() {
        return this._y;
    }

    render() {
        ctx.drawImage(Resources.get(this.sprite), this._x, this._y);
    }
}

// Enemies our player must avoid
class Enemy extends Character {
    constructor(positionX, positionY) {
        super(
            'images/enemy-bug.png',
            positionX || (-100 + getRandomInt(1, 6)*100),
            positionY || (-20 + getRandomInt(1, 4)*80)
        );
    }

    update(dt) {
        if (this._x >= document.getElementById("gameCanvas").width) {
            this._x = -100;
        } else {
            this._x += Math.random() * dt * 100;
        }
    }
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
class Player extends Character {
    constructor() {
        super('images/char-boy.png', BOUNDARIES.left, BOUNDARIES.down);
    }

    handleInput(move) {
        switch (move) {
            case "left":
                this._x -= 100;
                if (this._x < BOUNDARIES["left"]) {
                    this._x = BOUNDARIES["left"];
                }
                break;
            case "up":
                this._y -= 80;
                if (this._y < BOUNDARIES["up"]) {
                    setTimeout(levelCompleted.bind(this), 100);
                }
                break;
            case "right":
                this._x += 100;
                if (this._x > BOUNDARIES["right"]) {
                    this._x = BOUNDARIES["right"];
                }
                break;
            case "down":
                this._y += 80;
                if (this._y > BOUNDARIES["down"]) {
                    this._y = BOUNDARIES["down"];
                }
                break;
        }
    }

    crash() {
        console.info("AUCH");

        // animate crash

        // reset position
        this._x = BOUNDARIES.left;
        this._y = BOUNDARIES.down;
    }
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
let allEnemies = [...new Array(5)].map(() => new Enemy());
let player = new Player();

const onKeyPressed = function(e) {
    player.handleInput(ALLOWED_KEYS[e.keyCode]);
};

const levelCompleted = function() {
    alert("WELL DONE!")

    document.removeEventListener("keyup", onKeyPressed);
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener("keyup", onKeyPressed);

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
        let ctx = document.getElementById('gameCanvas').getContext('2d');

        ctx.drawImage(Resources.get(this.sprite), this._x, this._y);
    }
}

// Enemies our player must avoid
class Enemy extends Character {
    constructor(positionX, positionY) {
        super(
            'images/assets/enemy-bug.png',
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

    onScreen() {
        return (this._x > 0) && (this._y < document.getElementById("gameCanvas").width);
    }
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
class Player extends Character {
    constructor(character, lifeSpanBar) {
        super(`images/assets/${CHARACTERS[character].assetPath}`, BOUNDARIES.left, BOUNDARIES.down);

        this._name = CHARACTERS[character].name;
        this._lifeSpan = MAX_LIFESPAN;
        this._lifeSpanBar = lifeSpanBar;
        this._animatingCollision = false;
        this._waterReached = false;
        this._positionUpdated = false;

        this._methods = {
            "onKeyPressed": this._onKeyPressed.bind(this)
        }
        // This listens for key presses and sends the keys to your
        // Player.handleInput() method. You don't need to modify this.
        document.addEventListener("keyup", this._methods.onKeyPressed);
    }

    update() {
        this._positionUpdated = false;
    }

    positionUpdated() {
        return this._positionUpdated;
    }

    /**
     * Whenever the player is touching a lady bird play a shake animation
     * on the player.
     */
    onLadybirdTouch() {
        let left = false;
        let repeat = 8;
        let interval = 60;
        let animation;
        let shake = () => {
            if (left) { this._x -= 5; }
            else { this._x += 5; }

            left = !left;
            repeat--;

            if (repeat) {
                animation = window.requestAnimationFrame(shake);
            } else {
                window.cancelAnimationFrame(animation);

                this._x = BOUNDARIES.left;
                this._y = BOUNDARIES.down;

                this._animatingCollision = false;
                this._updateLifeSpan(-1);
            }
        }
        window.requestAnimationFrame(shake);
        this._animatingCollision = true;
    }

    hasReachedWater() {
        return this._waterReached;
    }

    getName() {
        return this._name;
    }

    getLifespan() {
        return this._lifeSpan;
    }

    animatingCollistion() {
        return this._animatingCollision;
    }

    alive() {
        return this._lifeSpan > 0;
    }

    _onKeyPressed(event) {
        this._handleInput(ALLOWED_KEYS[event.keyCode]);
    }

    /**
     * Update the player position based on the key pressed
     *
     * @param {String} move <left | right | up | down>
     * @private
     */
    _handleInput(move) {
        if (!this._animating) {
            if (Object.keys(BOUNDARIES).includes(move)) {
                this._positionUpdated = true;
            }
            switch (move) {
                case "left":
                    this._x -= 100;
                    if (this._x < BOUNDARIES["left"]) {
                        this._x = BOUNDARIES["left"];
                        this._positionUpdated = false;
                    }
                    break;
                case "up":
                    this._y -= 80;
                    if (this._y < BOUNDARIES["up"]) {
                        this._waterReached = true;
                        document.removeEventListener("keyup", this._methods.onKeyPressed);
                    }
                    break;
                case "right":
                    this._x += 100;
                    if (this._x > BOUNDARIES["right"]) {
                        this._x = BOUNDARIES["right"];
                        this._positionUpdated = false;
                    }
                    break;
                case "down":
                    this._y += 80;
                    if (this._y > BOUNDARIES["down"]) {
                        this._y = BOUNDARIES["down"];
                        this._positionUpdated = false;
                    }
                    break;
            }
        }
    }

    _updateLifeSpan(delta) {
        this._lifeSpan += delta;

        let lifeSpanPerc = 100 * this._lifeSpan / MAX_LIFESPAN;

        if (lifeSpanPerc > 100) { lifeSpanPerc = 100; }

        this._lifeSpanBar.querySelector(".progress-bar-inner").style.width = `${lifeSpanPerc}%`;
    }
}

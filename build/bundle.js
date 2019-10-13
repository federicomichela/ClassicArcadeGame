(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Player = exports.Enemy = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _const = require("./const.js");

var _utils = require("./utils.js");

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Character = function () {
    function Character(sprite, positionX, positionY) {
        _classCallCheck(this, Character);

        this.sprite = sprite;
        this._x = positionX || 0;
        this._y = positionY || 0;
    }

    _createClass(Character, [{
        key: "update",
        value: function update() {
            // noop
        }
    }, {
        key: "getPositionX",
        value: function getPositionX() {
            return this._x;
        }
    }, {
        key: "getPositionY",
        value: function getPositionY() {
            return this._y;
        }
    }, {
        key: "render",
        value: function render() {
            var ctx = document.getElementById('gameCanvas').getContext('2d');

            ctx.drawImage(Resources.get(this.sprite), this._x, this._y);
        }
    }]);

    return Character;
}();

// Enemies our player must avoid


var Enemy = function (_Character) {
    _inherits(Enemy, _Character);

    function Enemy(positionX, positionY) {
        _classCallCheck(this, Enemy);

        return _possibleConstructorReturn(this, (Enemy.__proto__ || Object.getPrototypeOf(Enemy)).call(this, 'images/assets/enemy-bug.png', positionX || -100 + (0, _utils.getRandomInt)(1, 6) * 100, positionY || -20 + (0, _utils.getRandomInt)(1, 4) * 80));
    }

    _createClass(Enemy, [{
        key: "update",
        value: function update(dt) {
            if (this._x >= document.getElementById("gameCanvas").width) {
                this._x = -100;
            } else {
                this._x += Math.random() * dt * 100;
            }
        }
    }, {
        key: "onScreen",
        value: function onScreen() {
            return this._x > 0 && this._y < document.getElementById("gameCanvas").width;
        }
    }]);

    return Enemy;
}(Character);

;

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function (_Character2) {
    _inherits(Player, _Character2);

    function Player(character, lifeSpanBar) {
        _classCallCheck(this, Player);

        var _this2 = _possibleConstructorReturn(this, (Player.__proto__ || Object.getPrototypeOf(Player)).call(this, "images/assets/" + _const.CHARACTERS[character].assetPath, _const.BOUNDARIES.left, _const.BOUNDARIES.down));

        _this2._name = _const.CHARACTERS[character].name;
        _this2._lifeSpan = _const.MAX_LIFESPAN;
        _this2._lifeSpanBar = lifeSpanBar;
        _this2._animatingCollision = false;
        _this2._waterReached = false;
        _this2._positionUpdated = false;

        _this2._methods = {
            "onKeyPressed": _this2._onKeyPressed.bind(_this2),
            "onClick": _this2._onClick.bind(_this2)
        };

        document.addEventListener("keyup", _this2._methods.onKeyPressed);
        document.getElementById("gameCanvas").addEventListener("click", _this2._methods.onClick);
        return _this2;
    }

    _createClass(Player, [{
        key: "update",
        value: function update() {
            this._positionUpdated = false;
        }
    }, {
        key: "positionUpdated",
        value: function positionUpdated() {
            return this._positionUpdated;
        }

        /**
         * Whenever the player is touching a lady bird play a shake animation
         * on the player.
         */

    }, {
        key: "onLadybirdTouch",
        value: function onLadybirdTouch() {
            var _this3 = this;

            var left = false;
            var repeat = 8;
            var interval = 60;
            var animation = void 0;
            var shake = function shake() {
                if (left) {
                    _this3._x -= 5;
                } else {
                    _this3._x += 5;
                }

                left = !left;
                repeat--;

                if (repeat) {
                    animation = window.requestAnimationFrame(shake);
                } else {
                    window.cancelAnimationFrame(animation);

                    _this3._x = _const.BOUNDARIES.left;
                    _this3._y = _const.BOUNDARIES.down;

                    _this3._animatingCollision = false;
                    _this3._updateLifeSpan(-1);
                }
            };
            window.requestAnimationFrame(shake);
            this._animatingCollision = true;
        }
    }, {
        key: "hasReachedWater",
        value: function hasReachedWater() {
            return this._waterReached;
        }
    }, {
        key: "getName",
        value: function getName() {
            return this._name;
        }
    }, {
        key: "getLifespan",
        value: function getLifespan() {
            return this._lifeSpan;
        }
    }, {
        key: "animatingCollistion",
        value: function animatingCollistion() {
            return this._animatingCollision;
        }
    }, {
        key: "alive",
        value: function alive() {
            return this._lifeSpan > 0;
        }

        /**
         * Make a move based on the key pressed
         *
         * @private
         */

    }, {
        key: "_onKeyPressed",
        value: function _onKeyPressed(event) {
            this._handleInput(_const.ALLOWED_KEYS[event.keyCode]);
        }

        /**
         * Make a move based on the click coordinates
         *
         * @private
         */

    }, {
        key: "_onClick",
        value: function _onClick(event) {
            var move = void 0;
            console.info(event.offsetX);

            if (event.offsetX - 50 >= this._x + 60) {
                move = "right";
            } else if (event.offsetX - 50 <= this._x - 60) {
                move = "left";
            } else if (event.offsetY - 100 >= this._y) {
                move = "down";
            } else if (event.offsetY - 100 <= this._y) {
                move = "up";
            }

            this._handleInput(move);
        }

        /**
         * Update the player position based on the key pressed
         *
         * @param {String} move <left | right | up | down>
         * @private
         */

    }, {
        key: "_handleInput",
        value: function _handleInput(move) {
            if (!this._animating) {
                if (Object.keys(_const.BOUNDARIES).includes(move)) {
                    this._positionUpdated = true;
                }
                switch (move) {
                    case "left":
                        this._x -= 100;
                        if (this._x < _const.BOUNDARIES["left"]) {
                            this._x = _const.BOUNDARIES["left"];
                            this._positionUpdated = false;
                        }
                        break;
                    case "up":
                        this._y -= 80;
                        if (this._y < _const.BOUNDARIES["up"]) {
                            this._waterReached = true;
                            document.removeEventListener("keyup", this._methods.onKeyPressed);
                        }
                        break;
                    case "right":
                        this._x += 100;
                        if (this._x > _const.BOUNDARIES["right"]) {
                            this._x = _const.BOUNDARIES["right"];
                            this._positionUpdated = false;
                        }
                        break;
                    case "down":
                        this._y += 80;
                        if (this._y > _const.BOUNDARIES["down"]) {
                            this._y = _const.BOUNDARIES["down"];
                            this._positionUpdated = false;
                        }
                        break;
                }
            }
        }
    }, {
        key: "_updateLifeSpan",
        value: function _updateLifeSpan(delta) {
            this._lifeSpan += delta;

            var lifeSpanPerc = 100 * this._lifeSpan / _const.MAX_LIFESPAN;

            if (lifeSpanPerc > 100) {
                lifeSpanPerc = 100;
            }

            this._lifeSpanBar.querySelector(".progress-bar-inner").style.width = lifeSpanPerc + "%";
        }
    }]);

    return Player;
}(Character);

exports.Enemy = Enemy;
exports.Player = Player;

},{"./const.js":2,"./utils.js":6}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var MAX_STARS = 5;

var MAX_LIFESPAN = 10;

var GAME_LEVELS = {
    0: "Easy",
    1: "Classic",
    2: "Adventure"
};

var ALLOWED_KEYS = {
    37: "left",
    38: "up",
    39: "right",
    40: "down"
};

var BOUNDARIES = {
    "left": 0,
    "up": 60,
    "right": 400,
    "down": 380
};

var ENEMIES = {
    0: 3,
    1: 5,
    2: 7
};

var CHARACTERS = {
    "boy": {
        "assetPath": "char-boy.png",
        "name": "Buggy Boy"
    },
    "catGirl": {
        "assetPath": "char-cat-girl.png",
        "name": "Cat Girl"
    },
    "hornGirl": {
        "assetPath": "char-horn-girl.png",
        "name": "Spiky"
    },
    "pinkGirl": {
        "assetPath": "char-pink-girl.png",
        "name": "Pinky"
    },
    "princessGirl": {
        "assetPath": "char-princess-girl.png",
        "name": "Princess"
    }
};

var GAME_SOUNDS = {
    "award": { "audio": new Audio("audio/award.wav"), "playing": false },
    "collision": { "audio": new Audio("audio/collision.wav"), "playing": false },
    "crawl": { "audio": new Audio("audio/crawling-bugs.wav"), "playing": false },
    "gameTheme": { "audio": new Audio("audio/theme.wav"), "playing": false },
    "jingleLoose": { "audio": new Audio("audio/jingleLoose.wav"), "playing": false },
    "jingleWin": { "audio": new Audio("audio/jingleWin.wav"), "playing": false },
    "powerUp": { "audio": new Audio("audio/powerUp.wav"), "playing": false },
    "step": { "audio": new Audio("audio/step.wav"), "playing": false }
};

exports.MAX_STARS = MAX_STARS;
exports.MAX_LIFESPAN = MAX_LIFESPAN;
exports.GAME_LEVELS = GAME_LEVELS;
exports.ALLOWED_KEYS = ALLOWED_KEYS;
exports.BOUNDARIES = BOUNDARIES;
exports.ENEMIES = ENEMIES;
exports.CHARACTERS = CHARACTERS;
exports.GAME_SOUNDS = GAME_SOUNDS;

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ArcadeGame = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _const = require("./const.js");

var _characters = require("./characters.js");

var _resources = require("./resources.js");

var _utils = require("./utils.js");

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ArcadeGame = function () {
    function ArcadeGame(onLevelCompleted) {
        _classCallCheck(this, ArcadeGame);

        this._onLevelCompletedCallback = onLevelCompleted;
    }

    /**
     * Initialise game by loading the game assets,
     * creating the game canvas, player and enemies
     * and starting the renderering loop
     *
     * @private
     */


    _createClass(ArcadeGame, [{
        key: "initialise",
        value: function initialise(level, playerCharacter) {
            this._gameContainer = document.querySelector("#gameContainer");
            this._startTime = new Date();
            this._stopTime = null;
            this._lastTime = new Date();
            this._selectedLevel = level;
            this._selectedCharacter = playerCharacter;
            this._assetsReady = false;
            this._assets = ["images/assets/stone-block.png", "images/assets/water-block.png", "images/assets/grass-block.png", "images/assets/enemy-bug.png", "images/assets/" + _const.CHARACTERS[this._selectedCharacter].assetPath];
            this._gameCompleted = false;
            this._requestFrameID = null;
            this._crawlAudioPlaying = false;
            this._audioPaused = false;

            this._createLifeSpanBar();
            this._initialiseGameContainer();

            this.startAudio("gameTheme");
        }

        /**
        * Returns the level of the game
        *
        * @returns {Number} (for a list of available levels see GAME_LEVELS const)
        */

    }, {
        key: "getLevel",
        value: function getLevel() {
            return this._selectedLevel;
        }

        /**
        * Method to get the time passed from the start of the game.
        * If the game is completed will always return the total time of the game.
        * NOTE: this method returns a nicely formatted string as "(dd::)hh:mm:ss"
        *
        * @returns {String}
        */

    }, {
        key: "getElapsedTime",
        value: function getElapsedTime() {
            var endTime = this._stopTime ? this._stopTime : new Date();
            var msElapsed = endTime - this._startTime;
            var formattedElapsedTime = (0, _utils.formatTimeToString)(msElapsed);

            return formattedElapsedTime;
        }

        /**
         * Check if the game has been completed
         *
         * @return {Boolean}
         */

    }, {
        key: "gameCompleted",
        value: function gameCompleted() {
            return this._gameCompleted;
        }

        /**
         * Get the star rating.
         * Star Rating is computed by checking the ratio between the lifespan
         * and the time elapsed.
         *
         * @return {Number}
         */

    }, {
        key: "getStarRating",
        value: function getStarRating() {
            return this._player.getLifespan() * 100 / _const.MAX_LIFESPAN;
        }

        /**
         * Clear canvas, remove it from the DOM and reset all game attributes
         */

    }, {
        key: "destroy",
        value: function destroy() {
            var ctx = this._canvas.getContext('2d');

            ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

            this._gameContainer.innerHTML = "";

            window.cancelAnimationFrame(this._requestFrameID);

            this._allEnemies = [];
            this._player = [];
            this._gameCompleted = true;

            this.stopAudio();
        }

        /**
         * Updates enemies and player position,
         * checks if player touched a ladybird (checkCollisions),
         * checks if the player has reached the water (gameCompleted).
         * Recursive method on next frame.
         *
         * @private
         */

    }, {
        key: "update",
        value: function update() {
            var now = Date.now();
            var dt = (now - this._lastTime) / 1000.0;

            // update characters positions
            this._allEnemies.forEach(function (enemy) {
                enemy.update(dt);
            });

            if (this._player.positionUpdated()) {
                this._player.update();
                this.startAudio("step");
            }

            // check for collisions
            if (this._checkCollisions() && !this._player.animatingCollistion()) {
                this._player.onLadybirdTouch();
                this.stopAudio("collision");
                this.startAudio("collision");
            }

            this._checkAudio();

            // check if the game is completed
            this._gameCompleted = this._player.hasReachedWater() || !this._player.alive();

            // re-renderer on screen
            this._render();

            this._lastTime = now;

            if (this._gameCompleted) {
                setTimeout(this._onLevelCompleted.bind(this), 100);
            } else {
                this._requestFrameID = window.requestAnimationFrame(this.update.bind(this));
            }
        }

        /**
         * Pause all audio
         *
         * @param trackName {String}
         */

    }, {
        key: "pauseAudio",
        value: function pauseAudio(trackName) {
            if (trackName) {
                _const.GAME_SOUNDS[trackName].audio.pause();
            } else {
                for (var sound in _const.GAME_SOUNDS) {
                    _const.GAME_SOUNDS[sound].audio.pause();
                }

                this._audioPaused = true;
            }
        }

        /**
         * Start audio in playing status
         *
         * @param trackName {String}
         * @param force {Boolean} play track even if state is not currently playing
         */

    }, {
        key: "startAudio",
        value: function startAudio(trackName) {
            var force = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

            if (typeof trackName === "boolean") {
                force = trackName;
                trackName = null;
            }

            if (trackName) {
                if (force || _const.GAME_SOUNDS[trackName].playing) {
                    _const.GAME_SOUNDS[trackName].audio.play();
                    _const.GAME_SOUNDS[trackName].playing = true;
                }
            } else {
                for (var sound in _const.GAME_SOUNDS) {
                    if (force || _const.GAME_SOUNDS[sound].playing) {
                        _const.GAME_SOUNDS[sound].audio.play();
                        _const.GAME_SOUNDS[sound].playing = true;
                    }
                }

                this._audioPaused = false;
            }
        }

        /**
         * Stop all audio or a specific track
         *
         * @param trackName {String}
         */

    }, {
        key: "stopAudio",
        value: function stopAudio(trackName) {
            if (trackName) {
                _const.GAME_SOUNDS[trackName].audio.pause();
                _const.GAME_SOUNDS[trackName].audio.load();
                _const.GAME_SOUNDS[trackName].playing = false;
            } else {
                for (var sound in _const.GAME_SOUNDS) {
                    _const.GAME_SOUNDS[sound].audio.pause();
                    _const.GAME_SOUNDS[sound].audio.load();
                    _const.GAME_SOUNDS[sound].playing = false;
                }
            }
        }

        /**
         * Support method to create the lifespan bar for the player.
         *
         * @private
         */

    }, {
        key: "_createLifeSpanBar",
        value: function _createLifeSpanBar() {
            var progressBarOuter = document.createElement("div");
            var progressBarInner = document.createElement("div");

            this._lifeSpanBar = document.createElement("div");

            progressBarOuter.classList.add("progress-bar-outer");
            progressBarInner.classList.add("progress-bar-inner");
            this._lifeSpanBar.classList.add("progress-bar");
            this._lifeSpanBar.id = "lifeSpanBar";

            progressBarOuter.appendChild(progressBarInner);
            this._lifeSpanBar.appendChild(progressBarOuter);
            this._gameContainer.appendChild(this._lifeSpanBar);
        }

        /**
         * Support method to create the game canvas, characters and load the assets
         *
         * @private
         */

    }, {
        key: "_initialiseGameContainer",
        value: function _initialiseGameContainer() {
            // create game canvas
            this._canvas = document.createElement('canvas');
            this._canvas.width = 505;
            this._canvas.height = 586;
            this._canvas.id = "gameCanvas";
            this._gameContainer.appendChild(this._canvas);

            // create characters
            this._allEnemies = [].concat(_toConsumableArray(new Array(_const.ENEMIES[this._selectedLevel]))).map(function () {
                return new _characters.Enemy();
            });
            this._player = new _characters.Player(this._selectedCharacter, this._lifeSpanBar);

            // load resources
            _resources.Resources.load(this._assets);

            if (_resources.Resources.isReady()) {
                this.update();
            } else {
                _resources.Resources.onReady(this.update.bind(this));
            }
        }

        /**
         * Check if a player has touched a ladybird
         *
         * @return {Boolean} collision
         * @private
         */

    }, {
        key: "_checkCollisions",
        value: function _checkCollisions() {
            var collision = false;

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this._allEnemies[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var enemy = _step.value;

                    collision = this._player.getPositionX() >= enemy.getPositionX() - 50 && this._player.getPositionX() <= enemy.getPositionX() + 50 && this._player.getPositionY() >= enemy.getPositionY() - 37 && this._player.getPositionY() <= enemy.getPositionY() + 37;
                    if (collision) {
                        break;
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            return collision;
        }
    }, {
        key: "_checkAudio",
        value: function _checkAudio() {
            if (!this._audioPaused) {
                var onScreen = [];

                this._allEnemies.forEach(function (enemy) {
                    return onScreen.push(enemy.onScreen());
                });

                // if no bugs are on screen, pause audio
                if (onScreen.every(function (x) {
                    return !x;
                })) {
                    this.stopAudio("crawl");
                } else if (!_const.GAME_SOUNDS.crawl.playing) {
                    this.startAudio("crawl");
                }
            }
        }

        /**
         * Redraw the whole canvas with all characters in their updated positions
         *
         * @private
         */

    }, {
        key: "_render",
        value: function _render() {
            var ctx = this._canvas.getContext('2d');

            // add game background to canvas
            var rowImages = ['images/assets/water-block.png', // Top row is water
            'images/assets/stone-block.png', // Row 1 of 3 of stone
            'images/assets/stone-block.png', // Row 2 of 3 of stone
            'images/assets/stone-block.png', // Row 3 of 3 of stone
            'images/assets/grass-block.png', // Row 1 of 2 of grass
            'images/assets/grass-block.png' // Row 2 of 2 of grass
            ];
            var numRows = 6;
            var numCols = 5;

            // Before drawing, clear existing canvas
            ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

            // Loop through the number of rows and columns we've defined above
            // and, using the rowImages array, draw the correct image for that
            // portion of the "grid"
            for (var row = 0; row < numRows; row++) {
                for (var col = 0; col < numCols; col++) {
                    ctx.drawImage(_resources.Resources.get(rowImages[row]), col * 101, row * 83);
                }
            }

            // renderer characters
            this._allEnemies.forEach(function (enemy) {
                enemy.render();
            });

            this._player.render();
        }

        /**
         * Display game result dialog with updated level's informations
         *
         * @private
         */

    }, {
        key: "_onLevelCompleted",
        value: function _onLevelCompleted() {
            var trackName = "jingle" + (this._player.alive() ? "Win" : "Loose");
            console.info(trackName);

            this._stopTime = new Date();

            this._onLevelCompletedCallback(this._player.alive());
            this.startAudio(trackName);
        }
    }]);

    return ArcadeGame;
}();

exports.ArcadeGame = ArcadeGame;

},{"./characters.js":1,"./const.js":2,"./resources.js":5,"./utils.js":6}],4:[function(require,module,exports){
"use strict";

var _const = require("./const.js");

var _game = require("./game.js");

var checkGameFocusIntervalID = null,
    clockID = null,
    gameMatch = null;

var initialiseHomePage = function initialiseHomePage() {
	"use strict";

	loadGameLevels();
	loadGameCharacters();
};

var loadGameLevels = function loadGameLevels() {
	"use strict";

	for (var key in _const.GAME_LEVELS) {
		var value = _const.GAME_LEVELS[key];
		var frontFace = document.createElement("div");
		var backFace = document.createElement("div");
		var button = document.createElement("button");

		frontFace.classList.add("flip-face", "flip-face-front");
		backFace.classList.add("flip-face", "flip-face-back");
		button.classList.add("btn-level", "flip", "flip-vertical");

		frontFace.innerText = "x" + _const.ENEMIES[key];
		backFace.innerText = value;

		button.setAttribute("data-level", key);

		button.appendChild(frontFace);
		button.appendChild(backFace);

		if (key === "0") {
			button.classList.add("selected");
		}

		document.querySelector("#homeSection #levelOptions").appendChild(button);
	}
};

var loadGameCharacters = function loadGameCharacters() {
	"use strict";

	for (var character in _const.CHARACTERS) {
		var assetPath = _const.CHARACTERS[character].assetPath;

		var characterObj = document.createElement("div");

		characterObj.style.backgroundImage = "url(\"images/assets/" + assetPath + "\")";
		characterObj.classList.add("character-entry");
		characterObj.setAttribute("data-id", character);

		document.querySelector("#charactersList").appendChild(characterObj);
	}
	document.querySelector("#charactersList .character-entry:nth-child(1)").classList.add("selected");
	updateSelectedCharacter();
};

/**
 * Updated the character selected for the Player
 */
var updateSelectedCharacter = function updateSelectedCharacter() {
	"use strict";

	var selectedCharacter = document.querySelector("#charactersList .character-entry.selected");
	var selectedObjImg = document.querySelector("#characterSelected div:nth-child(1)");
	var selectedObjName = document.querySelector("#characterSelected div:nth-child(2)");
	var character = selectedCharacter.getAttribute("data-id");

	selectedObjImg.style.backgroundImage = selectedCharacter.style.backgroundImage;
	selectedObjName.innerText = _const.CHARACTERS[character].name;
};

/**
 * Update player character
 */
var selectCharacter = function selectCharacter(event) {
	"use strict";

	if (event.target.classList.contains("character-entry")) {
		document.querySelector("#charactersList .character-entry.selected").classList.remove("selected");
		event.target.classList.add("selected");

		updateSelectedCharacter();
	}
};

/**
 * Pause game theme sound when page loses focus
 */
var checkGameFocus = function checkGameFocus() {
	"use strict";

	if (document.hasFocus()) {
		gameMatch.startAudio(false);
	} else {
		gameMatch.pauseAudio();
	}
};

/*
 * Show home page section (hide all the others)
 */
var showHome = function showHome() {
	"use strict";

	document.getElementById("homeSection").classList.remove("hidden");
	document.getElementById("gameSection").classList.add("hidden");

	if (!document.getElementById("gameResultSection").classList.contains("hidden")) {
		dismissGameResult();
	}

	addHomeListeners();
	removeGameListeners();
	checkResumeButton();
};

/*
 * Show game section (hide all the others)
 */
var showGame = function showGame() {
	"use strict";

	document.getElementById("homeSection").classList.add("hidden");
	document.getElementById("gameSection").classList.remove("hidden");

	if (!document.getElementById("gameResultSection").classList.contains("hidden")) {
		dismissGameResult();
	}

	removeHomeListeners();
	addGameListeners();
};

/*
 * Show game result "dialog"
 */
var showGameResult = function showGameResult(success) {
	"use strict";

	if (!gameMatch.gameCompleted()) {
		return;
	}

	var gameResultSection = document.getElementById("gameResultSection");

	gameResultSection.classList.remove("hidden");

	// to simulate a real dialog prevent page scrolling by hiding overflow
	document.querySelector("body").classList.add("full-screen");

	// update dialog with game results
	gameResultSection.querySelector("#gameResultText").innerText = success ? "Level Completed!" : "You Lost ☹";
	gameResultSection.querySelector("#gameTotalTime").innerText = "Total time: " + gameMatch.getElapsedTime();

	// update stars rating
	var rating = gameMatch.getStarRating();
	var starRate = 100 / _const.MAX_STARS;
	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = gameResultSection.querySelectorAll(".star")[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var star = _step.value;

			if (rating - starRate > 0) {
				star.querySelector(".star-inner").style.width = "100%";
				rating -= starRate;
			} else if (rating > 0) {
				var starPerc = 100 * rating / starRate;
				star.querySelector(".star-inner").style.width = starPerc + "%";
				rating -= starRate;
			} else {
				star.querySelector(".star-inner").style.width = "0%";
			}
		}
	} catch (err) {
		_didIteratorError = true;
		_iteratorError = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion && _iterator.return) {
				_iterator.return();
			}
		} finally {
			if (_didIteratorError) {
				throw _iteratorError;
			}
		}
	}

	disableResumeButtons();
	removeHomeListeners();
	removeGameListeners();
	addGameResultListeners();
};

/*
 * Hide game result dialog
 */
var dismissGameResult = function dismissGameResult() {
	"use strict";

	document.getElementById("gameResultSection").classList.add("hidden");

	// re-enable overflow on page
	document.querySelector("body").classList.remove("full-screen");

	removeGameResultListeners();
};

/*
 * Update the level and start clock in the game page
 */
var updateGameInfos = function updateGameInfos() {
	"use strict";

	clearInterval(clockID);
	clockID = setInterval(function () {
		document.getElementById("gameTimeElapsed").innerText = gameMatch.getElapsedTime();
	}, 1000);

	document.getElementById("gameLevelDescription").innerText = "Level " + _const.GAME_LEVELS[gameMatch.getLevel()];
};

/**
 * Make resume buttons available
 */
var enableResumeButtons = function enableResumeButtons() {
	"use strict";

	var _iteratorNormalCompletion2 = true;
	var _didIteratorError2 = false;
	var _iteratorError2 = undefined;

	try {
		for (var _iterator2 = document.querySelectorAll(".btn-resume")[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
			var btn = _step2.value;

			btn.classList.remove("hidden");
		}
	} catch (err) {
		_didIteratorError2 = true;
		_iteratorError2 = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion2 && _iterator2.return) {
				_iterator2.return();
			}
		} finally {
			if (_didIteratorError2) {
				throw _iteratorError2;
			}
		}
	}
};

/**
 * Make resume buttons unavailable
 */
var disableResumeButtons = function disableResumeButtons() {
	"use strict";

	var _iteratorNormalCompletion3 = true;
	var _didIteratorError3 = false;
	var _iteratorError3 = undefined;

	try {
		for (var _iterator3 = document.querySelectorAll(".btn-resume")[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
			var btn = _step3.value;

			btn.classList.add("hidden");
		}
	} catch (err) {
		_didIteratorError3 = true;
		_iteratorError3 = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion3 && _iterator3.return) {
				_iterator3.return();
			}
		} finally {
			if (_didIteratorError3) {
				throw _iteratorError3;
			}
		}
	}
};

/**
 * Disable resume button when selected level button does not match with current
 * game level. Enable otherwise.
 */
var checkResumeButton = function checkResumeButton() {
	"use strict";

	var resumeBtn = document.querySelector(".btn-resume");
	var selectedLevelButton = document.querySelector(".btn-level.selected");

	if (!resumeBtn.classList.contains("hidden")) {
		if (selectedLevelButton.dataset.level === gameMatch.getLevel()) {
			resumeBtn.disabled = false;
		} else {
			resumeBtn.disabled = true;
		}
	}
};

/*
 * Start a new game on a specified level
 * @param level {Number}
 */
var initialiseGame = function initialiseGame(level) {
	"use strict";

	var selectedCharacter = document.querySelector("#charactersList .selected").getAttribute("data-id");

	if (gameMatch) {
		gameMatch.destroy();
	} else {
		gameMatch = new _game.ArcadeGame(showGameResult);
	}

	gameMatch.initialise(level, selectedCharacter);

	enableResumeButtons();
	showGame();
	updateGameInfos();
};

/*
 * Start a new game from the selected level
 */
var startGame = function startGame() {
	"use strict";

	var levelSelected = document.querySelector(".btn-level.selected").dataset.level;

	initialiseGame(levelSelected);
};

/*
 * Start a new game from the current game level
 */
var resetGame = function resetGame() {
	"use strict";

	var level = gameMatch.getLevel();

	initialiseGame(level);
};

/*
 * Reset to a new game with higher level
 */
var levelUp = function levelUp() {
	"use strict";

	var nextLevel = parseInt(gameMatch.getLevel(), 10) + 1;

	initialiseGame(nextLevel);
};

/*
 * Event callback method to select a level
 * @param event {Object}
 */
var selectLevel = function selectLevel(event) {
	"use strict";

	if (event.target.classList.contains("btn-level")) {
		// remove selection from currently selected button
		var currentlySelectedButton = document.querySelector(".btn-level.selected");
		if (currentlySelectedButton) {
			currentlySelectedButton.classList.remove("selected");
		}
		// add selection to the button that has just been clicked
		event.target.classList.add("selected");

		// eventually disable resume option
		checkResumeButton();
	}
};

/**
 * Add loading class to clicked button then show the game page
 *
 * @param {Object} event
 */
var loadGame = function loadGame(event) {
	"use strict";

	var callback = startGame;
	event.target.classList.add("loading");

	if (event.target.classList.contains("btn-resume")) {
		callback = function callback() {
			showGame();
			gameMatch.startAudio(false);
		};
	}

	setTimeout(function () {
		var _iteratorNormalCompletion4 = true;
		var _didIteratorError4 = false;
		var _iteratorError4 = undefined;

		try {
			for (var _iterator4 = document.querySelectorAll(".loading")[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
				var loadingElement = _step4.value;

				loadingElement.classList.remove("loading");
			}
		} catch (err) {
			_didIteratorError4 = true;
			_iteratorError4 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion4 && _iterator4.return) {
					_iterator4.return();
				}
			} finally {
				if (_didIteratorError4) {
					throw _iteratorError4;
				}
			}
		}

		callback();
	}, 1000);
};

/*
 * Listen to a click event on the level buttons to select it.
 * Also listen to the resume button to go back to the game without restarting it.
 */
var addHomeListeners = function addHomeListeners() {
	"use strict";

	document.getElementById("levelCharacter").addEventListener("click", selectCharacter);
	document.getElementById("levelOptions").addEventListener("click", selectLevel);
	document.querySelector(".btn-resume").addEventListener("click", loadGame);
};

/*
 * Stop listening to the interactions on the level and resume buttons.
 */
var removeHomeListeners = function removeHomeListeners() {
	"use strict";

	document.getElementById("levelOptions").removeEventListener("click", selectLevel);
	document.querySelector(".btn-resume").removeEventListener("click", loadGame);
};

/*
 * Listen to a click event on each card in the grid in order to flip the card
 */
var addGameListeners = function addGameListeners() {
	"use strict";

	checkGameFocusIntervalID = setInterval(checkGameFocus, 300);
};

/*
 * Stop listening to the interactions on the cards
 */
var removeGameListeners = function removeGameListeners() {
	"use strict";

	clearInterval(checkGameFocusIntervalID);
	gameMatch.pauseAudio();
};

/*
 * Listen to a click even on the level up button
 */
var addGameResultListeners = function addGameResultListeners() {
	"use strict";

	document.querySelector("#gameResultSection .dialog .btn-levelup").addEventListener("click", levelUp);
};

/*
 * Stop listening to the level up button click
 */
var removeGameResultListeners = function removeGameResultListeners() {
	"use strict";

	document.querySelector("#gameResultSection .dialog .btn-levelup").removeEventListener("click", levelUp);
};

/*
 * Listen to a click event on all the buttons in the pages
 */
var addNavigationListeners = function addNavigationListeners() {
	"use strict";

	// when a start or reset button is clicked, initialise a new game with the selected level

	var startGameButtons = document.querySelectorAll(".btn-start");
	var _iteratorNormalCompletion5 = true;
	var _didIteratorError5 = false;
	var _iteratorError5 = undefined;

	try {
		for (var _iterator5 = startGameButtons[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
			var btn = _step5.value;

			btn.addEventListener("click", loadGame);
		}
	} catch (err) {
		_didIteratorError5 = true;
		_iteratorError5 = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion5 && _iterator5.return) {
				_iterator5.return();
			}
		} finally {
			if (_didIteratorError5) {
				throw _iteratorError5;
			}
		}
	}

	var resetGameButtons = document.querySelectorAll(".btn-reset");
	var _iteratorNormalCompletion6 = true;
	var _didIteratorError6 = false;
	var _iteratorError6 = undefined;

	try {
		for (var _iterator6 = resetGameButtons[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
			var _btn = _step6.value;

			_btn.addEventListener("click", resetGame);
		}

		// when an home button is clicked, show the home section
	} catch (err) {
		_didIteratorError6 = true;
		_iteratorError6 = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion6 && _iterator6.return) {
				_iterator6.return();
			}
		} finally {
			if (_didIteratorError6) {
				throw _iteratorError6;
			}
		}
	}

	var homeButtons = document.querySelectorAll(".btn-home");
	var _iteratorNormalCompletion7 = true;
	var _didIteratorError7 = false;
	var _iteratorError7 = undefined;

	try {
		for (var _iterator7 = homeButtons[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
			var _btn2 = _step7.value;

			_btn2.addEventListener("click", showHome);
		}
	} catch (err) {
		_didIteratorError7 = true;
		_iteratorError7 = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion7 && _iterator7.return) {
				_iterator7.return();
			}
		} finally {
			if (_didIteratorError7) {
				throw _iteratorError7;
			}
		}
	}
};

/**
 * Support method to reduce tracks volume,
 * initialise loopable tracks and initialise listeners for track completion
 * to update the track state.
 */
var settleAudioTracks = function settleAudioTracks() {
	"use strict";

	_const.GAME_SOUNDS.gameTheme.audio.loop = true;
	_const.GAME_SOUNDS.gameTheme.audio.volume = 0.5;
	_const.GAME_SOUNDS.step.audio.volume = 0.5;
	_const.GAME_SOUNDS.jingleLoose.audio.volume = 0.2;
	_const.GAME_SOUNDS.jingleWin.audio.volume = 0.2;
	_const.GAME_SOUNDS.crawl.audio.loop = true;

	var _loop = function _loop(track) {
		_const.GAME_SOUNDS[track].audio.addEventListener("ended", function () {
			_const.GAME_SOUNDS[track].playing = false;
		});
	};

	for (var track in _const.GAME_SOUNDS) {
		_loop(track);
	}
};

document.addEventListener('DOMContentLoaded', function () {
	"use strict";

	settleAudioTracks();
	initialiseHomePage();
	addNavigationListeners();
	addHomeListeners();
});

window.addEventListener('scroll', function () {
	"use strict";

	document.querySelector("#gameResultSection").style.top = window.scrollY + "px";
});

},{"./const.js":2,"./game.js":3}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/** Resources.js
 * This is simply an image loading utility. It eases the process of loading
 * image files so that they can be used within your game. It also includes
 * a simple "caching" layer so it will reuse cached images if you attempt
 * to load the same image multiple times.
 */
(function () {
  "use strict";

  var resourceCache = {};
  var readyCallbacks = [];

  /**
   * This is the publicly accessible image loading function. It accepts
   * an array of strings pointing to image files or a string for a single
   * image. It will then call our private image loading function accordingly.
   *
   * @param urlOrArr {String|Array}
   */
  var load = function load(urlOrArr) {
    if (urlOrArr instanceof Array) {

      /* If the developer passed in an array of images
       * loop through each value and call our image
       * loader on that image file
       */
      urlOrArr.forEach(function (url) {
        _load(url);
      });
    } else {

      /* The developer did not pass an array to this function,
       * assume the value is a string and call our image loader
       * directly.
       */
      _load(urlOrArr);
    }
  };

  /**
   * This is our private image loader function, it is
   * called by the public image loader function.
   */
  var _load = function _load(url) {
    if (resourceCache[url]) {

      /* If this URL has been previously loaded it will exist within
       * our resourceCache array. Just return that image rather than
       * re-loading the image.
       */
      return resourceCache[url];
    }

    /* This URL has not been previously loaded and is not present
     * within our cache; we'll need to load this image.
     */
    var img = new Image();

    img.onload = function () {

      /* Once our image has properly loaded, add it to our cache
       * so that we can simply return this image if the developer
       * attempts to load this file in the future.
       */
      resourceCache[url] = img;

      /* Once the image is actually loaded and properly cached,
       * call all of the onReady() callbacks we have defined.
       */
      if (isReady()) {
        readyCallbacks.forEach(function (callback) {
          return callback();
        });
      }
    };

    /* Set the initial cache value to false, this will change when
     * the image's onload event handler is called. Finally, point
     * the image's src attribute to the passed in URL.
     */
    resourceCache[url] = false;
    img.src = url;

    return img;
  };

  /**
   * This is used by developers to grab references to images they know
   * have been previously loaded. If an image is cached, this functions
   * the same as calling load() on that URL.
   */
  var get = function get(url) {
    return resourceCache[url];
  };

  /* This function determines if all of the images that have been requested
   * for loading have in fact been properly loaded.
   */
  var isReady = function isReady() {
    var ready = true;

    for (var k in resourceCache) {
      if (Object.prototype.hasOwnProperty.call(resourceCache, k) && !resourceCache[k]) {
        ready = false;
      }
    }

    return ready;
  };

  /**
   * This function will add a function to the callback stack that is called
   * when all requested images are properly loaded.
   */
  var onReady = function onReady(callback) {
    readyCallbacks.push(callback);
  };

  /**
   * This object defines the publicly accessible functions available to
   * developers by creating a global Resources object.
   */
  window.Resources = {
    get: get,
    isReady: isReady,
    load: load,
    onReady: onReady
  };
})();

exports.Resources = Resources;

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

function getRandomInt(min, max) {
    return Math.floor(getRandomNumber(min, max));
}

function formatTimeToString(ms) {
    var formattedTimeParts = [];
    var dayToMs = 24 * 60 * 60 * 1000;
    var hourToMs = 60 * 60 * 1000;
    var minuteToMs = 60 * 1000;
    var secondToMs = 1000;

    var days = Math.floor(ms / dayToMs);
    var hours = Math.floor((ms - days * dayToMs) / hourToMs);
    var minutes = Math.floor((ms - hours * hourToMs) / minuteToMs);
    var seconds = Math.floor((ms - minutes * minuteToMs) / secondToMs);

    if (days) {
        formattedTimeParts.push(days + "d");
    }
    if (hours || formattedTimeParts.length) {
        formattedTimeParts.push(hours + "h");
    }
    if (minutes || formattedTimeParts.length) {
        formattedTimeParts.push(minutes + "m");
    }
    if (seconds || formattedTimeParts.length) {
        formattedTimeParts.push(seconds + "s");
    }

    return formattedTimeParts.join(" ");
}

exports.getRandomNumber = getRandomNumber;
exports.getRandomInt = getRandomInt;
exports.formatTimeToString = formatTimeToString;

},{}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9jaGFyYWN0ZXJzLmpzIiwianMvY29uc3QuanMiLCJqcy9nYW1lLmpzIiwianMvbWFpbi5qcyIsImpzL3Jlc291cmNlcy5qcyIsImpzL3V0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7O0FDQUE7O0FBQ0E7Ozs7Ozs7O0lBRU0sUztBQUNGLHVCQUFZLE1BQVosRUFBb0IsU0FBcEIsRUFBK0IsU0FBL0IsRUFBMEM7QUFBQTs7QUFDdEMsYUFBSyxNQUFMLEdBQWMsTUFBZDtBQUNBLGFBQUssRUFBTCxHQUFVLGFBQWEsQ0FBdkI7QUFDQSxhQUFLLEVBQUwsR0FBVSxhQUFhLENBQXZCO0FBQ0g7Ozs7aUNBRVM7QUFDTjtBQUNIOzs7dUNBRWM7QUFDWCxtQkFBTyxLQUFLLEVBQVo7QUFDSDs7O3VDQUVjO0FBQ1gsbUJBQU8sS0FBSyxFQUFaO0FBQ0g7OztpQ0FFUTtBQUNMLGdCQUFJLE1BQU0sU0FBUyxjQUFULENBQXdCLFlBQXhCLEVBQXNDLFVBQXRDLENBQWlELElBQWpELENBQVY7O0FBRUEsZ0JBQUksU0FBSixDQUFjLFVBQVUsR0FBVixDQUFjLEtBQUssTUFBbkIsQ0FBZCxFQUEwQyxLQUFLLEVBQS9DLEVBQW1ELEtBQUssRUFBeEQ7QUFDSDs7Ozs7O0FBR0w7OztJQUNNLEs7OztBQUNGLG1CQUFZLFNBQVosRUFBdUIsU0FBdkIsRUFBa0M7QUFBQTs7QUFBQSw2R0FFMUIsNkJBRjBCLEVBRzFCLGFBQWMsQ0FBQyxHQUFELEdBQU8seUJBQWEsQ0FBYixFQUFnQixDQUFoQixJQUFtQixHQUhkLEVBSTFCLGFBQWMsQ0FBQyxFQUFELEdBQU0seUJBQWEsQ0FBYixFQUFnQixDQUFoQixJQUFtQixFQUpiO0FBTWpDOzs7OytCQUVNLEUsRUFBSTtBQUNQLGdCQUFJLEtBQUssRUFBTCxJQUFXLFNBQVMsY0FBVCxDQUF3QixZQUF4QixFQUFzQyxLQUFyRCxF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bUIsTUFBaEMsRUFBd0M7QUFBRSwyQkFBbUIsSUFBbkIsQ0FBMkIsS0FBM0I7QUFBdUM7QUFDakYsUUFBSSxXQUFXLG1CQUFtQixNQUFsQyxFQUEwQztBQUFFLDJCQUFtQixJQUFuQixDQUEyQixPQUEzQjtBQUF5QztBQUNyRixRQUFJLFdBQVcsbUJBQW1CLE1BQWxDLEVBQTBDO0FBQUUsMkJBQW1CLElBQW5CLENBQTJCLE9BQTNCO0FBQXlDOztBQUVyRixXQUFPLG1CQUFtQixJQUFuQixDQUF3QixHQUF4QixDQUFQO0FBQ0g7O1FBRU8sZSxHQUFBLGU7UUFBaUIsWSxHQUFBLFk7UUFBYyxrQixHQUFBLGtCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiaW1wb3J0IHtNQVhfTElGRVNQQU4sIEFMTE9XRURfS0VZUywgQk9VTkRBUklFUywgQ0hBUkFDVEVSU30gZnJvbSBcIi4vY29uc3QuanNcIjtcbmltcG9ydCB7Z2V0UmFuZG9tSW50fSBmcm9tIFwiLi91dGlscy5qc1wiO1xuXG5jbGFzcyBDaGFyYWN0ZXIge1xuICAgIGNvbnN0cnVjdG9yKHNwcml0ZSwgcG9zaXRpb25YLCBwb3NpdGlvblkpIHtcbiAgICAgICAgdGhpcy5zcHJpdGUgPSBzcHJpdGU7XG4gICAgICAgIHRoaXMuX3ggPSBwb3NpdGlvblggfHwgMDtcbiAgICAgICAgdGhpcy5feSA9IHBvc2l0aW9uWSB8fCAwO1xuICAgIH1cblxuICAgIHVwZGF0ZSAoKSB7XG4gICAgICAgIC8vIG5vb3BcbiAgICB9XG5cbiAgICBnZXRQb3NpdGlvblgoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl94O1xuICAgIH1cblxuICAgIGdldFBvc2l0aW9uWSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3k7XG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICBsZXQgY3R4ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dhbWVDYW52YXMnKS5nZXRDb250ZXh0KCcyZCcpO1xuXG4gICAgICAgIGN0eC5kcmF3SW1hZ2UoUmVzb3VyY2VzLmdldCh0aGlzLnNwcml0ZSksIHRoaXMuX3gsIHRoaXMuX3kpO1xuICAgIH1cbn1cblxuLy8gRW5lbWllcyBvdXIgcGxheWVyIG11c3QgYXZvaWRcbmNsYXNzIEVuZW15IGV4dGVuZHMgQ2hhcmFjdGVyIHtcbiAgICBjb25zdHJ1Y3Rvcihwb3NpdGlvblgsIHBvc2l0aW9uWSkge1xuICAgICAgICBzdXBlcihcbiAgICAgICAgICAgICdpbWFnZXMvYXNzZXRzL2VuZW15LWJ1Zy5wbmcnLFxuICAgICAgICAgICAgcG9zaXRpb25YIHx8ICgtMTAwICsgZ2V0UmFuZG9tSW50KDEsIDYpKjEwMCksXG4gICAgICAgICAgICBwb3NpdGlvblkgfHwgKC0yMCArIGdldFJhbmRvbUludCgxLCA0KSo4MClcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICB1cGRhdGUoZHQpIHtcbiAgICAgICAgaWYgKHRoaXMuX3ggPj0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnYW1lQ2FudmFzXCIpLndpZHRoKSB7XG4gICAgICAgICAgICB0aGlzLl94ID0gLTEwMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3ggKz0gTWF0aC5yYW5kb20oKSAqIGR0ICogMTAwO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25TY3JlZW4oKSB7XG4gICAgICAgIHJldHVybiAodGhpcy5feCA+IDApICYmICh0aGlzLl95IDwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnYW1lQ2FudmFzXCIpLndpZHRoKTtcbiAgICB9XG59O1xuXG4vLyBOb3cgd3JpdGUgeW91ciBvd24gcGxheWVyIGNsYXNzXG4vLyBUaGlzIGNsYXNzIHJlcXVpcmVzIGFuIHVwZGF0ZSgpLCByZW5kZXIoKSBhbmRcbi8vIGEgaGFuZGxlSW5wdXQoKSBtZXRob2QuXG5jbGFzcyBQbGF5ZXIgZXh0ZW5kcyBDaGFyYWN0ZXIge1xuICAgIGNvbnN0cnVjdG9yKGNoYXJhY3RlciwgbGlmZVNwYW5CYXIpIHtcbiAgICAgICAgc3VwZXIoXG4gICAgICAgICAgICBgaW1hZ2VzL2Fzc2V0cy8ke0NIQVJBQ1RFUlNbY2hhcmFjdGVyXS5hc3NldFBhdGh9YCxcbiAgICAgICAgICAgIEJPVU5EQVJJRVMubGVmdCxcbiAgICAgICAgICAgIEJPVU5EQVJJRVMuZG93blxuICAgICAgICApO1xuXG4gICAgICAgIHRoaXMuX25hbWUgPSBDSEFSQUNURVJTW2NoYXJhY3Rlcl0ubmFtZTtcbiAgICAgICAgdGhpcy5fbGlmZVNwYW4gPSBNQVhfTElGRVNQQU47XG4gICAgICAgIHRoaXMuX2xpZmVTcGFuQmFyID0gbGlmZVNwYW5CYXI7XG4gICAgICAgIHRoaXMuX2FuaW1hdGluZ0NvbGxpc2lvbiA9IGZhbHNlO1xuICAgICAgICB0aGlzLl93YXRlclJlYWNoZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fcG9zaXRpb25VcGRhdGVkID0gZmFsc2U7XG5cbiAgICAgICAgdGhpcy5fbWV0aG9kcyA9IHtcbiAgICAgICAgICAgIFwib25LZXlQcmVzc2VkXCI6IHRoaXMuX29uS2V5UHJlc3NlZC5iaW5kKHRoaXMpLFxuICAgICAgICAgICAgXCJvbkNsaWNrXCI6IHRoaXMuX29uQ2xpY2suYmluZCh0aGlzKVxuICAgICAgICB9XG5cbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIHRoaXMuX21ldGhvZHMub25LZXlQcmVzc2VkKTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnYW1lQ2FudmFzXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0aGlzLl9tZXRob2RzLm9uQ2xpY2spO1xuICAgIH1cblxuICAgIHVwZGF0ZSgpIHtcbiAgICAgICAgdGhpcy5fcG9zaXRpb25VcGRhdGVkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgcG9zaXRpb25VcGRhdGVkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcG9zaXRpb25VcGRhdGVkO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFdoZW5ldmVyIHRoZSBwbGF5ZXIgaXMgdG91Y2hpbmcgYSBsYWR5IGJpcmQgcGxheSBhIHNoYWtlIGFuaW1hdGlvblxuICAgICAqIG9uIHRoZSBwbGF5ZXIuXG4gICAgICovXG4gICAgb25MYWR5YmlyZFRvdWNoKCkge1xuICAgICAgICBsZXQgbGVmdCA9IGZhbHNlO1xuICAgICAgICBsZXQgcmVwZWF0ID0gODtcbiAgICAgICAgbGV0IGludGVydmFsID0gNjA7XG4gICAgICAgIGxldCBhbmltYXRpb247XG4gICAgICAgIGxldCBzaGFrZSA9ICgpID0+IHtcbiAgICAgICAgICAgIGlmIChsZWZ0KSB7IHRoaXMuX3ggLT0gNTsgfVxuICAgICAgICAgICAgZWxzZSB7IHRoaXMuX3ggKz0gNTsgfVxuXG4gICAgICAgICAgICBsZWZ0ID0gIWxlZnQ7XG4gICAgICAgICAgICByZXBlYXQtLTtcblxuICAgICAgICAgICAgaWYgKHJlcGVhdCkge1xuICAgICAgICAgICAgICAgIGFuaW1hdGlvbiA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoc2hha2UpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUoYW5pbWF0aW9uKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuX3ggPSBCT1VOREFSSUVTLmxlZnQ7XG4gICAgICAgICAgICAgICAgdGhpcy5feSA9IEJPVU5EQVJJRVMuZG93bjtcblxuICAgICAgICAgICAgICAgIHRoaXMuX2FuaW1hdGluZ0NvbGxpc2lvbiA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZUxpZmVTcGFuKC0xKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHNoYWtlKTtcbiAgICAgICAgdGhpcy5fYW5pbWF0aW5nQ29sbGlzaW9uID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBoYXNSZWFjaGVkV2F0ZXIoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl93YXRlclJlYWNoZWQ7XG4gICAgfVxuXG4gICAgZ2V0TmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX25hbWU7XG4gICAgfVxuXG4gICAgZ2V0TGlmZXNwYW4oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9saWZlU3BhbjtcbiAgICB9XG5cbiAgICBhbmltYXRpbmdDb2xsaXN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYW5pbWF0aW5nQ29sbGlzaW9uO1xuICAgIH1cblxuICAgIGFsaXZlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbGlmZVNwYW4gPiAwO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE1ha2UgYSBtb3ZlIGJhc2VkIG9uIHRoZSBrZXkgcHJlc3NlZFxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfb25LZXlQcmVzc2VkKGV2ZW50KSB7XG4gICAgICAgIHRoaXMuX2hhbmRsZUlucHV0KEFMTE9XRURfS0VZU1tldmVudC5rZXlDb2RlXSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTWFrZSBhIG1vdmUgYmFzZWQgb24gdGhlIGNsaWNrIGNvb3JkaW5hdGVzXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9vbkNsaWNrKGV2ZW50KSB7XG4gICAgICAgIGxldCBtb3ZlO1xuICAgICAgICBjb25zb2xlLmluZm8oZXZlbnQub2Zmc2V0WClcblxuICAgICAgICBpZiAoZXZlbnQub2Zmc2V0WCAtIDUwID49IHRoaXMuX3ggKyA2MCkge1xuICAgICAgICAgICAgbW92ZSA9IFwicmlnaHRcIjtcbiAgICAgICAgfSBlbHNlXG4gICAgICAgIGlmIChldmVudC5vZmZzZXRYIC0gNTAgPD0gdGhpcy5feCAtIDYwKSB7XG4gICAgICAgICAgICBtb3ZlID0gXCJsZWZ0XCI7XG4gICAgICAgIH0gZWxzZVxuICAgICAgICBpZiAoZXZlbnQub2Zmc2V0WS0xMDAgPj0gdGhpcy5feSkge1xuICAgICAgICAgICAgbW92ZSA9IFwiZG93blwiO1xuICAgICAgICB9IGVsc2VcbiAgICAgICAgaWYgKGV2ZW50Lm9mZnNldFktMTAwIDw9IHRoaXMuX3kpIHtcbiAgICAgICAgICAgIG1vdmUgPSBcInVwXCI7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9oYW5kbGVJbnB1dChtb3ZlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBVcGRhdGUgdGhlIHBsYXllciBwb3NpdGlvbiBiYXNlZCBvbiB0aGUga2V5IHByZXNzZWRcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBtb3ZlIDxsZWZ0IHwgcmlnaHQgfCB1cCB8IGRvd24+XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfaGFuZGxlSW5wdXQobW92ZSkge1xuICAgICAgICBpZiAoIXRoaXMuX2FuaW1hdGluZykge1xuICAgICAgICAgICAgaWYgKE9iamVjdC5rZXlzKEJPVU5EQVJJRVMpLmluY2x1ZGVzKG1vdmUpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcG9zaXRpb25VcGRhdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN3aXRjaCAobW92ZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgXCJsZWZ0XCI6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3ggLT0gMTAwO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5feCA8IEJPVU5EQVJJRVNbXCJsZWZ0XCJdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl94ID0gQk9VTkRBUklFU1tcImxlZnRcIl07XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9wb3NpdGlvblVwZGF0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIFwidXBcIjpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5feSAtPSA4MDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX3kgPCBCT1VOREFSSUVTW1widXBcIl0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3dhdGVyUmVhY2hlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgdGhpcy5fbWV0aG9kcy5vbktleVByZXNzZWQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJyaWdodFwiOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLl94ICs9IDEwMDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX3ggPiBCT1VOREFSSUVTW1wicmlnaHRcIl0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3ggPSBCT1VOREFSSUVTW1wicmlnaHRcIl07XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9wb3NpdGlvblVwZGF0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIFwiZG93blwiOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLl95ICs9IDgwO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5feSA+IEJPVU5EQVJJRVNbXCJkb3duXCJdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl95ID0gQk9VTkRBUklFU1tcImRvd25cIl07XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9wb3NpdGlvblVwZGF0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIF91cGRhdGVMaWZlU3BhbihkZWx0YSkge1xuICAgICAgICB0aGlzLl9saWZlU3BhbiArPSBkZWx0YTtcblxuICAgICAgICBsZXQgbGlmZVNwYW5QZXJjID0gMTAwICogdGhpcy5fbGlmZVNwYW4gLyBNQVhfTElGRVNQQU47XG5cbiAgICAgICAgaWYgKGxpZmVTcGFuUGVyYyA+IDEwMCkgeyBsaWZlU3BhblBlcmMgPSAxMDA7IH1cblxuICAgICAgICB0aGlzLl9saWZlU3BhbkJhci5xdWVyeVNlbGVjdG9yKFwiLnByb2dyZXNzLWJhci1pbm5lclwiKS5zdHlsZS53aWR0aCA9IGAke2xpZmVTcGFuUGVyY30lYDtcbiAgICB9XG59XG5cbmV4cG9ydCB7RW5lbXksIFBsYXllcn07XG4iLCJjb25zdCBNQVhfU1RBUlMgPSA1O1xuXG5jb25zdCBNQVhfTElGRVNQQU4gPSAxMDtcblxuY29uc3QgR0FNRV9MRVZFTFMgPSB7XG5cdDA6IFwiRWFzeVwiLFxuXHQxOiBcIkNsYXNzaWNcIixcblx0MjogXCJBZHZlbnR1cmVcIlxufTtcblxuY29uc3QgQUxMT1dFRF9LRVlTID0ge1xuICAgIDM3OiBcImxlZnRcIixcbiAgICAzODogXCJ1cFwiLFxuICAgIDM5OiBcInJpZ2h0XCIsXG4gICAgNDA6IFwiZG93blwiXG59XG5cbmNvbnN0IEJPVU5EQVJJRVMgPSB7XG4gICAgXCJsZWZ0XCI6IDAsXG4gICAgXCJ1cFwiOiA2MCxcbiAgICBcInJpZ2h0XCI6IDQwMCxcbiAgICBcImRvd25cIjogMzgwXG59XG5cbmNvbnN0IEVORU1JRVMgPSB7XG4gICAgMDogMyxcbiAgICAxOiA1LFxuICAgIDI6IDdcbn1cblxuY29uc3QgQ0hBUkFDVEVSUyA9IHtcbiAgICBcImJveVwiOiB7XG4gICAgICAgIFwiYXNzZXRQYXRoXCI6IFwiY2hhci1ib3kucG5nXCIsXG4gICAgICAgIFwibmFtZVwiOiBcIkJ1Z2d5IEJveVwiXG4gICAgfSxcbiAgICBcImNhdEdpcmxcIjoge1xuICAgICAgICBcImFzc2V0UGF0aFwiOiBcImNoYXItY2F0LWdpcmwucG5nXCIsXG4gICAgICAgIFwibmFtZVwiOiBcIkNhdCBHaXJsXCJcbiAgICB9LFxuICAgIFwiaG9ybkdpcmxcIjoge1xuICAgICAgICBcImFzc2V0UGF0aFwiOiBcImNoYXItaG9ybi1naXJsLnBuZ1wiLFxuICAgICAgICBcIm5hbWVcIjogXCJTcGlreVwiXG4gICAgfSxcbiAgICBcInBpbmtHaXJsXCI6IHtcbiAgICAgICAgXCJhc3NldFBhdGhcIjogXCJjaGFyLXBpbmstZ2lybC5wbmdcIixcbiAgICAgICAgXCJuYW1lXCI6IFwiUGlua3lcIlxuICAgIH0sXG4gICAgXCJwcmluY2Vzc0dpcmxcIjoge1xuICAgICAgICBcImFzc2V0UGF0aFwiOiBcImNoYXItcHJpbmNlc3MtZ2lybC5wbmdcIixcbiAgICAgICAgXCJuYW1lXCI6IFwiUHJpbmNlc3NcIlxuICAgIH1cbn1cblxuY29uc3QgR0FNRV9TT1VORFMgPSB7XG5cdFwiYXdhcmRcIjogeyBcImF1ZGlvXCI6IG5ldyBBdWRpbyhcImF1ZGlvL2F3YXJkLndhdlwiKSwgXCJwbGF5aW5nXCI6IGZhbHNlIH0sXG5cdFwiY29sbGlzaW9uXCI6IHsgXCJhdWRpb1wiOiBuZXcgQXVkaW8oXCJhdWRpby9jb2xsaXNpb24ud2F2XCIpLCBcInBsYXlpbmdcIjogZmFsc2UgfSxcblx0XCJjcmF3bFwiOiB7IFwiYXVkaW9cIjogbmV3IEF1ZGlvKFwiYXVkaW8vY3Jhd2xpbmctYnVncy53YXZcIiksIFwicGxheWluZ1wiOiBmYWxzZSB9LFxuXHRcImdhbWVUaGVtZVwiOiB7IFwiYXVkaW9cIjogbmV3IEF1ZGlvKFwiYXVkaW8vdGhlbWUud2F2XCIpLCBcInBsYXlpbmdcIjogZmFsc2UgfSxcblx0XCJqaW5nbGVMb29zZVwiOiB7IFwiYXVkaW9cIjogbmV3IEF1ZGlvKFwiYXVkaW8vamluZ2xlTG9vc2Uud2F2XCIpLCBcInBsYXlpbmdcIjogZmFsc2UgfSxcblx0XCJqaW5nbGVXaW5cIjogeyBcImF1ZGlvXCI6IG5ldyBBdWRpbyhcImF1ZGlvL2ppbmdsZVdpbi53YXZcIiksIFwicGxheWluZ1wiOiBmYWxzZSB9LFxuXHRcInBvd2VyVXBcIjogeyBcImF1ZGlvXCI6IG5ldyBBdWRpbyhcImF1ZGlvL3Bvd2VyVXAud2F2XCIpLCBcInBsYXlpbmdcIjogZmFsc2UgfSxcblx0XCJzdGVwXCI6IHsgXCJhdWRpb1wiOiBuZXcgQXVkaW8oXCJhdWRpby9zdGVwLndhdlwiKSwgXCJwbGF5aW5nXCI6IGZhbHNlIH0sXG59O1xuXG5leHBvcnQge01BWF9TVEFSUywgTUFYX0xJRkVTUEFOLCBHQU1FX0xFVkVMUywgQUxMT1dFRF9LRVlTLCBCT1VOREFSSUVTLCBFTkVNSUVTLCBDSEFSQUNURVJTLCBHQU1FX1NPVU5EU307XG4iLCJpbXBvcnQge01BWF9MSUZFU1BBTiwgR0FNRV9MRVZFTFMsIEVORU1JRVMsIENIQVJBQ1RFUlMsIEdBTUVfU09VTkRTfSBmcm9tIFwiLi9jb25zdC5qc1wiO1xuaW1wb3J0IHtFbmVteSwgUGxheWVyfSBmcm9tIFwiLi9jaGFyYWN0ZXJzLmpzXCI7XG5pbXBvcnQge1Jlc291cmNlc30gZnJvbSBcIi4vcmVzb3VyY2VzLmpzXCI7XG5pbXBvcnQge2Zvcm1hdFRpbWVUb1N0cmluZ30gZnJvbSBcIi4vdXRpbHMuanNcIjtcblxuY2xhc3MgQXJjYWRlR2FtZSB7XG4gICAgY29uc3RydWN0b3Iob25MZXZlbENvbXBsZXRlZCkge1xuICAgICAgICB0aGlzLl9vbkxldmVsQ29tcGxldGVkQ2FsbGJhY2sgPSBvbkxldmVsQ29tcGxldGVkO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEluaXRpYWxpc2UgZ2FtZSBieSBsb2FkaW5nIHRoZSBnYW1lIGFzc2V0cyxcbiAgICAgKiBjcmVhdGluZyB0aGUgZ2FtZSBjYW52YXMsIHBsYXllciBhbmQgZW5lbWllc1xuICAgICAqIGFuZCBzdGFydGluZyB0aGUgcmVuZGVyZXJpbmcgbG9vcFxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBpbml0aWFsaXNlKGxldmVsLCBwbGF5ZXJDaGFyYWN0ZXIpIHtcbiAgICAgICAgdGhpcy5fZ2FtZUNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjZ2FtZUNvbnRhaW5lclwiKTtcbiAgICAgICAgdGhpcy5fc3RhcnRUaW1lID0gbmV3IERhdGUoKTtcbiAgICAgICAgdGhpcy5fc3RvcFRpbWUgPSBudWxsO1xuICAgICAgICB0aGlzLl9sYXN0VGltZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgIHRoaXMuX3NlbGVjdGVkTGV2ZWwgPSBsZXZlbDtcbiAgICAgICAgdGhpcy5fc2VsZWN0ZWRDaGFyYWN0ZXIgPSBwbGF5ZXJDaGFyYWN0ZXI7XG4gICAgICAgIHRoaXMuX2Fzc2V0c1JlYWR5ID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX2Fzc2V0cyA9IFtcbiAgICAgICAgICAgIFwiaW1hZ2VzL2Fzc2V0cy9zdG9uZS1ibG9jay5wbmdcIixcbiAgICAgICAgICAgIFwiaW1hZ2VzL2Fzc2V0cy93YXRlci1ibG9jay5wbmdcIixcbiAgICAgICAgICAgIFwiaW1hZ2VzL2Fzc2V0cy9ncmFzcy1ibG9jay5wbmdcIixcbiAgICAgICAgICAgIFwiaW1hZ2VzL2Fzc2V0cy9lbmVteS1idWcucG5nXCIsXG4gICAgICAgICAgICBgaW1hZ2VzL2Fzc2V0cy8ke0NIQVJBQ1RFUlNbdGhpcy5fc2VsZWN0ZWRDaGFyYWN0ZXJdLmFzc2V0UGF0aH1gXG4gICAgICAgIF07XG4gICAgICAgIHRoaXMuX2dhbWVDb21wbGV0ZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fcmVxdWVzdEZyYW1lSUQgPSBudWxsO1xuICAgICAgICB0aGlzLl9jcmF3bEF1ZGlvUGxheWluZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9hdWRpb1BhdXNlZCA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMuX2NyZWF0ZUxpZmVTcGFuQmFyKCk7XG4gICAgICAgIHRoaXMuX2luaXRpYWxpc2VHYW1lQ29udGFpbmVyKCk7XG5cbiAgICBcdHRoaXMuc3RhcnRBdWRpbyhcImdhbWVUaGVtZVwiKTtcbiAgICB9XG5cbiAgICAvKipcblx0KiBSZXR1cm5zIHRoZSBsZXZlbCBvZiB0aGUgZ2FtZVxuXHQqXG5cdCogQHJldHVybnMge051bWJlcn0gKGZvciBhIGxpc3Qgb2YgYXZhaWxhYmxlIGxldmVscyBzZWUgR0FNRV9MRVZFTFMgY29uc3QpXG5cdCovXG5cdGdldExldmVsKCkge1xuXHRcdHJldHVybiB0aGlzLl9zZWxlY3RlZExldmVsO1xuXHR9XG5cblx0LyoqXG5cdCogTWV0aG9kIHRvIGdldCB0aGUgdGltZSBwYXNzZWQgZnJvbSB0aGUgc3RhcnQgb2YgdGhlIGdhbWUuXG5cdCogSWYgdGhlIGdhbWUgaXMgY29tcGxldGVkIHdpbGwgYWx3YXlzIHJldHVybiB0aGUgdG90YWwgdGltZSBvZiB0aGUgZ2FtZS5cblx0KiBOT1RFOiB0aGlzIG1ldGhvZCByZXR1cm5zIGEgbmljZWx5IGZvcm1hdHRlZCBzdHJpbmcgYXMgXCIoZGQ6OiloaDptbTpzc1wiXG5cdCpcblx0KiBAcmV0dXJucyB7U3RyaW5nfVxuXHQqL1xuXHRnZXRFbGFwc2VkVGltZSgpIHtcblx0XHRsZXQgZW5kVGltZSA9IHRoaXMuX3N0b3BUaW1lID8gdGhpcy5fc3RvcFRpbWUgOiBuZXcgRGF0ZSgpO1xuXHRcdGxldCBtc0VsYXBzZWQgPSBlbmRUaW1lIC0gdGhpcy5fc3RhcnRUaW1lO1xuXHRcdGxldCBmb3JtYXR0ZWRFbGFwc2VkVGltZSA9IGZvcm1hdFRpbWVUb1N0cmluZyhtc0VsYXBzZWQpO1xuXG5cdFx0cmV0dXJuIGZvcm1hdHRlZEVsYXBzZWRUaW1lO1xuXHR9XG5cbiAgICAvKipcbiAgICAgKiBDaGVjayBpZiB0aGUgZ2FtZSBoYXMgYmVlbiBjb21wbGV0ZWRcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICovXG4gICAgZ2FtZUNvbXBsZXRlZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2dhbWVDb21wbGV0ZWQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IHRoZSBzdGFyIHJhdGluZy5cbiAgICAgKiBTdGFyIFJhdGluZyBpcyBjb21wdXRlZCBieSBjaGVja2luZyB0aGUgcmF0aW8gYmV0d2VlbiB0aGUgbGlmZXNwYW5cbiAgICAgKiBhbmQgdGhlIHRpbWUgZWxhcHNlZC5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge051bWJlcn1cbiAgICAgKi9cbiAgICBnZXRTdGFyUmF0aW5nKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcGxheWVyLmdldExpZmVzcGFuKCkgKiAxMDAgLyBNQVhfTElGRVNQQU47XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2xlYXIgY2FudmFzLCByZW1vdmUgaXQgZnJvbSB0aGUgRE9NIGFuZCByZXNldCBhbGwgZ2FtZSBhdHRyaWJ1dGVzXG4gICAgICovXG4gICAgZGVzdHJveSgpIHtcbiAgICAgICAgbGV0IGN0eCA9IHRoaXMuX2NhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXG4gICAgICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5fY2FudmFzLndpZHRoLCB0aGlzLl9jYW52YXMuaGVpZ2h0KTtcblxuICAgICAgICB0aGlzLl9nYW1lQ29udGFpbmVyLmlubmVySFRNTCA9IFwiXCI7XG5cbiAgICAgICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKHRoaXMuX3JlcXVlc3RGcmFtZUlEKTtcblxuICAgICAgICB0aGlzLl9hbGxFbmVtaWVzID0gW107XG4gICAgICAgIHRoaXMuX3BsYXllciA9IFtdO1xuICAgICAgICB0aGlzLl9nYW1lQ29tcGxldGVkID0gdHJ1ZTtcblxuICAgICAgICB0aGlzLnN0b3BBdWRpbygpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFVwZGF0ZXMgZW5lbWllcyBhbmQgcGxheWVyIHBvc2l0aW9uLFxuICAgICAqIGNoZWNrcyBpZiBwbGF5ZXIgdG91Y2hlZCBhIGxhZHliaXJkIChjaGVja0NvbGxpc2lvbnMpLFxuICAgICAqIGNoZWNrcyBpZiB0aGUgcGxheWVyIGhhcyByZWFjaGVkIHRoZSB3YXRlciAoZ2FtZUNvbXBsZXRlZCkuXG4gICAgICogUmVjdXJzaXZlIG1ldGhvZCBvbiBuZXh0IGZyYW1lLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICB1cGRhdGUoKSB7XG4gICAgICAgIGxldCBub3cgPSBEYXRlLm5vdygpO1xuICAgICAgICBsZXQgZHQgPSAobm93IC0gdGhpcy5fbGFzdFRpbWUpIC8gMTAwMC4wO1xuXG4gICAgICAgIC8vIHVwZGF0ZSBjaGFyYWN0ZXJzIHBvc2l0aW9uc1xuICAgICAgICB0aGlzLl9hbGxFbmVtaWVzLmZvckVhY2goZnVuY3Rpb24oZW5lbXkpIHtcbiAgICAgICAgICAgIGVuZW15LnVwZGF0ZShkdCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICh0aGlzLl9wbGF5ZXIucG9zaXRpb25VcGRhdGVkKCkpIHtcbiAgICAgICAgICAgIHRoaXMuX3BsYXllci51cGRhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuc3RhcnRBdWRpbyhcInN0ZXBcIik7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBjaGVjayBmb3IgY29sbGlzaW9uc1xuICAgICAgICBpZiAodGhpcy5fY2hlY2tDb2xsaXNpb25zKCkgJiYgIXRoaXMuX3BsYXllci5hbmltYXRpbmdDb2xsaXN0aW9uKCkpIHtcbiAgICAgICAgICAgIHRoaXMuX3BsYXllci5vbkxhZHliaXJkVG91Y2goKTtcbiAgICAgICAgICAgIHRoaXMuc3RvcEF1ZGlvKFwiY29sbGlzaW9uXCIpO1xuICAgICAgICAgICAgdGhpcy5zdGFydEF1ZGlvKFwiY29sbGlzaW9uXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fY2hlY2tBdWRpbygpO1xuXG4gICAgICAgIC8vIGNoZWNrIGlmIHRoZSBnYW1lIGlzIGNvbXBsZXRlZFxuICAgICAgICB0aGlzLl9nYW1lQ29tcGxldGVkID0gdGhpcy5fcGxheWVyLmhhc1JlYWNoZWRXYXRlcigpIHx8ICF0aGlzLl9wbGF5ZXIuYWxpdmUoKTtcblxuICAgICAgICAvLyByZS1yZW5kZXJlciBvbiBzY3JlZW5cbiAgICAgICAgdGhpcy5fcmVuZGVyKCk7XG5cbiAgICAgICAgdGhpcy5fbGFzdFRpbWUgPSBub3c7XG5cbiAgICAgICAgaWYgKHRoaXMuX2dhbWVDb21wbGV0ZWQpIHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQodGhpcy5fb25MZXZlbENvbXBsZXRlZC5iaW5kKHRoaXMpLCAxMDApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fcmVxdWVzdEZyYW1lSUQgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMudXBkYXRlLmJpbmQodGhpcykpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUGF1c2UgYWxsIGF1ZGlvXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdHJhY2tOYW1lIHtTdHJpbmd9XG4gICAgICovXG4gICAgcGF1c2VBdWRpbyh0cmFja05hbWUpIHtcbiAgICAgICAgaWYgKHRyYWNrTmFtZSkge1xuICAgICAgICAgICAgR0FNRV9TT1VORFNbdHJhY2tOYW1lXS5hdWRpby5wYXVzZSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZm9yIChsZXQgc291bmQgaW4gR0FNRV9TT1VORFMpIHtcbiAgICAgICAgICAgICAgICBHQU1FX1NPVU5EU1tzb3VuZF0uYXVkaW8ucGF1c2UoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fYXVkaW9QYXVzZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU3RhcnQgYXVkaW8gaW4gcGxheWluZyBzdGF0dXNcbiAgICAgKlxuICAgICAqIEBwYXJhbSB0cmFja05hbWUge1N0cmluZ31cbiAgICAgKiBAcGFyYW0gZm9yY2Uge0Jvb2xlYW59IHBsYXkgdHJhY2sgZXZlbiBpZiBzdGF0ZSBpcyBub3QgY3VycmVudGx5IHBsYXlpbmdcbiAgICAgKi9cbiAgICBzdGFydEF1ZGlvKHRyYWNrTmFtZSwgZm9yY2U9dHJ1ZSkge1xuICAgICAgICBpZiAodHlwZW9mIHRyYWNrTmFtZSA9PT0gXCJib29sZWFuXCIpIHtcbiAgICAgICAgICAgIGZvcmNlID0gdHJhY2tOYW1lO1xuICAgICAgICAgICAgdHJhY2tOYW1lID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0cmFja05hbWUpIHtcbiAgICAgICAgICAgIGlmIChmb3JjZSB8fCBHQU1FX1NPVU5EU1t0cmFja05hbWVdLnBsYXlpbmcpIHtcbiAgICAgICAgICAgICAgICBHQU1FX1NPVU5EU1t0cmFja05hbWVdLmF1ZGlvLnBsYXkoKTtcbiAgICAgICAgICAgICAgICBHQU1FX1NPVU5EU1t0cmFja05hbWVdLnBsYXlpbmcgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZm9yIChsZXQgc291bmQgaW4gR0FNRV9TT1VORFMpIHtcbiAgICAgICAgICAgICAgICBpZiAoZm9yY2UgfHwgR0FNRV9TT1VORFNbc291bmRdLnBsYXlpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgR0FNRV9TT1VORFNbc291bmRdLmF1ZGlvLnBsYXkoKTtcbiAgICAgICAgICAgICAgICAgICAgR0FNRV9TT1VORFNbc291bmRdLnBsYXlpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fYXVkaW9QYXVzZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFN0b3AgYWxsIGF1ZGlvIG9yIGEgc3BlY2lmaWMgdHJhY2tcbiAgICAgKlxuICAgICAqIEBwYXJhbSB0cmFja05hbWUge1N0cmluZ31cbiAgICAgKi9cbiAgICBzdG9wQXVkaW8odHJhY2tOYW1lKSB7XG4gICAgICAgIGlmICh0cmFja05hbWUpIHtcbiAgICAgICAgICAgIEdBTUVfU09VTkRTW3RyYWNrTmFtZV0uYXVkaW8ucGF1c2UoKTtcbiAgICAgICAgICAgIEdBTUVfU09VTkRTW3RyYWNrTmFtZV0uYXVkaW8ubG9hZCgpO1xuICAgICAgICAgICAgR0FNRV9TT1VORFNbdHJhY2tOYW1lXS5wbGF5aW5nID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmb3IgKGxldCBzb3VuZCBpbiBHQU1FX1NPVU5EUykge1xuICAgICAgICAgICAgICAgIEdBTUVfU09VTkRTW3NvdW5kXS5hdWRpby5wYXVzZSgpO1xuICAgICAgICAgICAgICAgIEdBTUVfU09VTkRTW3NvdW5kXS5hdWRpby5sb2FkKCk7XG4gICAgICAgICAgICAgICAgR0FNRV9TT1VORFNbc291bmRdLnBsYXlpbmcgPSBmYWxzZTtcbiAgICAgICAgXHR9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTdXBwb3J0IG1ldGhvZCB0byBjcmVhdGUgdGhlIGxpZmVzcGFuIGJhciBmb3IgdGhlIHBsYXllci5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX2NyZWF0ZUxpZmVTcGFuQmFyKCkge1xuICAgICAgICBsZXQgcHJvZ3Jlc3NCYXJPdXRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIGxldCBwcm9ncmVzc0JhcklubmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblxuICAgICAgICB0aGlzLl9saWZlU3BhbkJhciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cbiAgICAgICAgcHJvZ3Jlc3NCYXJPdXRlci5jbGFzc0xpc3QuYWRkKFwicHJvZ3Jlc3MtYmFyLW91dGVyXCIpO1xuICAgICAgICBwcm9ncmVzc0JhcklubmVyLmNsYXNzTGlzdC5hZGQoXCJwcm9ncmVzcy1iYXItaW5uZXJcIik7XG4gICAgICAgIHRoaXMuX2xpZmVTcGFuQmFyLmNsYXNzTGlzdC5hZGQoXCJwcm9ncmVzcy1iYXJcIik7XG4gICAgICAgIHRoaXMuX2xpZmVTcGFuQmFyLmlkID0gXCJsaWZlU3BhbkJhclwiO1xuXG4gICAgICAgIHByb2dyZXNzQmFyT3V0ZXIuYXBwZW5kQ2hpbGQocHJvZ3Jlc3NCYXJJbm5lcik7XG4gICAgICAgIHRoaXMuX2xpZmVTcGFuQmFyLmFwcGVuZENoaWxkKHByb2dyZXNzQmFyT3V0ZXIpO1xuICAgICAgICB0aGlzLl9nYW1lQ29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuX2xpZmVTcGFuQmFyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTdXBwb3J0IG1ldGhvZCB0byBjcmVhdGUgdGhlIGdhbWUgY2FudmFzLCBjaGFyYWN0ZXJzIGFuZCBsb2FkIHRoZSBhc3NldHNcbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX2luaXRpYWxpc2VHYW1lQ29udGFpbmVyKCkge1xuICAgICAgICAvLyBjcmVhdGUgZ2FtZSBjYW52YXNcbiAgICAgICAgdGhpcy5fY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgICAgIHRoaXMuX2NhbnZhcy53aWR0aCA9IDUwNTtcbiAgICAgICAgdGhpcy5fY2FudmFzLmhlaWdodCA9IDU4NjtcbiAgICAgICAgdGhpcy5fY2FudmFzLmlkID0gXCJnYW1lQ2FudmFzXCI7XG4gICAgICAgIHRoaXMuX2dhbWVDb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5fY2FudmFzKTtcblxuICAgICAgICAvLyBjcmVhdGUgY2hhcmFjdGVyc1xuICAgICAgICB0aGlzLl9hbGxFbmVtaWVzID0gWy4uLm5ldyBBcnJheShFTkVNSUVTW3RoaXMuX3NlbGVjdGVkTGV2ZWxdKV0ubWFwKCgpID0+IG5ldyBFbmVteSgpKTtcbiAgICAgICAgdGhpcy5fcGxheWVyID0gbmV3IFBsYXllcih0aGlzLl9zZWxlY3RlZENoYXJhY3RlciwgdGhpcy5fbGlmZVNwYW5CYXIpO1xuXG4gICAgICAgIC8vIGxvYWQgcmVzb3VyY2VzXG4gICAgICAgIFJlc291cmNlcy5sb2FkKHRoaXMuX2Fzc2V0cyk7XG5cbiAgICAgICAgaWYgKFJlc291cmNlcy5pc1JlYWR5KCkpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBSZXNvdXJjZXMub25SZWFkeSh0aGlzLnVwZGF0ZS5iaW5kKHRoaXMpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrIGlmIGEgcGxheWVyIGhhcyB0b3VjaGVkIGEgbGFkeWJpcmRcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59IGNvbGxpc2lvblxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX2NoZWNrQ29sbGlzaW9ucygpIHtcbiAgICAgICAgbGV0IGNvbGxpc2lvbiA9IGZhbHNlO1xuXG4gICAgICAgIGZvciAobGV0IGVuZW15IG9mIHRoaXMuX2FsbEVuZW1pZXMpIHtcbiAgICAgICAgICAgIGNvbGxpc2lvbiA9ICgodGhpcy5fcGxheWVyLmdldFBvc2l0aW9uWCgpID49IGVuZW15LmdldFBvc2l0aW9uWCgpIC0gNTApICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgKHRoaXMuX3BsYXllci5nZXRQb3NpdGlvblgoKSA8PSBlbmVteS5nZXRQb3NpdGlvblgoKSArIDUwKSkgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICgodGhpcy5fcGxheWVyLmdldFBvc2l0aW9uWSgpID49IGVuZW15LmdldFBvc2l0aW9uWSgpIC0gMzcpICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgKHRoaXMuX3BsYXllci5nZXRQb3NpdGlvblkoKSA8PSBlbmVteS5nZXRQb3NpdGlvblkoKSArIDM3KSk7XG4gICAgICAgICAgICBpZiAoY29sbGlzaW9uKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY29sbGlzaW9uO1xuICAgIH1cblxuICAgIF9jaGVja0F1ZGlvKCkge1xuICAgICAgICBpZiAoIXRoaXMuX2F1ZGlvUGF1c2VkKSB7XG4gICAgICAgICAgICBsZXQgb25TY3JlZW4gPSBbXTtcblxuICAgICAgICAgICAgdGhpcy5fYWxsRW5lbWllcy5mb3JFYWNoKCBlbmVteSA9PiBvblNjcmVlbi5wdXNoKGVuZW15Lm9uU2NyZWVuKCkpICk7XG5cbiAgICAgICAgICAgIC8vIGlmIG5vIGJ1Z3MgYXJlIG9uIHNjcmVlbiwgcGF1c2UgYXVkaW9cbiAgICAgICAgICAgIGlmIChvblNjcmVlbi5ldmVyeSh4ID0+ICF4KSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RvcEF1ZGlvKFwiY3Jhd2xcIik7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCFHQU1FX1NPVU5EUy5jcmF3bC5wbGF5aW5nKXtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0QXVkaW8oXCJjcmF3bFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlZHJhdyB0aGUgd2hvbGUgY2FudmFzIHdpdGggYWxsIGNoYXJhY3RlcnMgaW4gdGhlaXIgdXBkYXRlZCBwb3NpdGlvbnNcbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX3JlbmRlcigpIHtcbiAgICAgICAgbGV0IGN0eCA9IHRoaXMuX2NhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXG4gICAgICAgIC8vIGFkZCBnYW1lIGJhY2tncm91bmQgdG8gY2FudmFzXG4gICAgICAgIGxldCByb3dJbWFnZXMgPSBbXG4gICAgICAgICAgICAgICAgJ2ltYWdlcy9hc3NldHMvd2F0ZXItYmxvY2sucG5nJywgICAvLyBUb3Agcm93IGlzIHdhdGVyXG4gICAgICAgICAgICAgICAgJ2ltYWdlcy9hc3NldHMvc3RvbmUtYmxvY2sucG5nJywgICAvLyBSb3cgMSBvZiAzIG9mIHN0b25lXG4gICAgICAgICAgICAgICAgJ2ltYWdlcy9hc3NldHMvc3RvbmUtYmxvY2sucG5nJywgICAvLyBSb3cgMiBvZiAzIG9mIHN0b25lXG4gICAgICAgICAgICAgICAgJ2ltYWdlcy9hc3NldHMvc3RvbmUtYmxvY2sucG5nJywgICAvLyBSb3cgMyBvZiAzIG9mIHN0b25lXG4gICAgICAgICAgICAgICAgJ2ltYWdlcy9hc3NldHMvZ3Jhc3MtYmxvY2sucG5nJywgICAvLyBSb3cgMSBvZiAyIG9mIGdyYXNzXG4gICAgICAgICAgICAgICAgJ2ltYWdlcy9hc3NldHMvZ3Jhc3MtYmxvY2sucG5nJyAgICAvLyBSb3cgMiBvZiAyIG9mIGdyYXNzXG4gICAgICAgICAgICBdO1xuICAgICAgICBsZXQgbnVtUm93cyA9IDY7XG4gICAgICAgIGxldCBudW1Db2xzID0gNTtcblxuICAgICAgICAvLyBCZWZvcmUgZHJhd2luZywgY2xlYXIgZXhpc3RpbmcgY2FudmFzXG4gICAgICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5fY2FudmFzLndpZHRoLCB0aGlzLl9jYW52YXMuaGVpZ2h0KTtcblxuICAgICAgICAvLyBMb29wIHRocm91Z2ggdGhlIG51bWJlciBvZiByb3dzIGFuZCBjb2x1bW5zIHdlJ3ZlIGRlZmluZWQgYWJvdmVcbiAgICAgICAgLy8gYW5kLCB1c2luZyB0aGUgcm93SW1hZ2VzIGFycmF5LCBkcmF3IHRoZSBjb3JyZWN0IGltYWdlIGZvciB0aGF0XG4gICAgICAgIC8vIHBvcnRpb24gb2YgdGhlIFwiZ3JpZFwiXG4gICAgICAgIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IG51bVJvd3M7IHJvdysrKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCBudW1Db2xzOyBjb2wrKykge1xuICAgICAgICAgICAgICAgIGN0eC5kcmF3SW1hZ2UoUmVzb3VyY2VzLmdldChyb3dJbWFnZXNbcm93XSksIGNvbCAqIDEwMSwgcm93ICogODMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gcmVuZGVyZXIgY2hhcmFjdGVyc1xuICAgICAgICB0aGlzLl9hbGxFbmVtaWVzLmZvckVhY2goZnVuY3Rpb24oZW5lbXkpIHtcbiAgICAgICAgICAgIGVuZW15LnJlbmRlcigpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLl9wbGF5ZXIucmVuZGVyKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRGlzcGxheSBnYW1lIHJlc3VsdCBkaWFsb2cgd2l0aCB1cGRhdGVkIGxldmVsJ3MgaW5mb3JtYXRpb25zXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9vbkxldmVsQ29tcGxldGVkKCkge1xuICAgICAgICBsZXQgdHJhY2tOYW1lID0gXCJqaW5nbGVcIiArICh0aGlzLl9wbGF5ZXIuYWxpdmUoKT9cIldpblwiOlwiTG9vc2VcIik7XG4gICAgICAgIGNvbnNvbGUuaW5mbyh0cmFja05hbWUpXG5cbiAgICAgICAgdGhpcy5fc3RvcFRpbWUgPSBuZXcgRGF0ZSgpO1xuXG4gICAgICAgIHRoaXMuX29uTGV2ZWxDb21wbGV0ZWRDYWxsYmFjayh0aGlzLl9wbGF5ZXIuYWxpdmUoKSk7XG4gICAgICAgIHRoaXMuc3RhcnRBdWRpbyh0cmFja05hbWUpO1xuICAgIH1cbn1cblxuZXhwb3J0IHtBcmNhZGVHYW1lfTtcbiIsImltcG9ydCB7TUFYX1NUQVJTLCBHQU1FX0xFVkVMUywgRU5FTUlFUywgQ0hBUkFDVEVSUywgR0FNRV9TT1VORFN9IGZyb20gXCIuL2NvbnN0LmpzXCI7XG5pbXBvcnQge0FyY2FkZUdhbWV9IGZyb20gXCIuL2dhbWUuanNcIjtcblxubGV0IGNoZWNrR2FtZUZvY3VzSW50ZXJ2YWxJRCA9IG51bGwsXG5cdGNsb2NrSUQgPSBudWxsLFxuXHRnYW1lTWF0Y2ggPSBudWxsO1xuXG5jb25zdCBpbml0aWFsaXNlSG9tZVBhZ2UgPSAoKSA9PiB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGxvYWRHYW1lTGV2ZWxzKCk7XG5cdGxvYWRHYW1lQ2hhcmFjdGVycygpO1xufVxuXG5jb25zdCBsb2FkR2FtZUxldmVscyA9ICgpID0+IHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0Zm9yIChsZXQga2V5IGluIEdBTUVfTEVWRUxTKSB7XG5cdFx0bGV0IHZhbHVlID0gR0FNRV9MRVZFTFNba2V5XTtcblx0XHRsZXQgZnJvbnRGYWNlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblx0XHRsZXQgYmFja0ZhY2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXHRcdGxldCBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuXG5cdFx0ZnJvbnRGYWNlLmNsYXNzTGlzdC5hZGQoXCJmbGlwLWZhY2VcIiwgXCJmbGlwLWZhY2UtZnJvbnRcIik7XG5cdFx0YmFja0ZhY2UuY2xhc3NMaXN0LmFkZChcImZsaXAtZmFjZVwiLCBcImZsaXAtZmFjZS1iYWNrXCIpO1xuXHRcdGJ1dHRvbi5jbGFzc0xpc3QuYWRkKFwiYnRuLWxldmVsXCIsIFwiZmxpcFwiLCBcImZsaXAtdmVydGljYWxcIik7XG5cblx0XHRmcm9udEZhY2UuaW5uZXJUZXh0ID0gYHgke0VORU1JRVNba2V5XX1gO1xuXHRcdGJhY2tGYWNlLmlubmVyVGV4dCA9IHZhbHVlO1xuXG5cdFx0YnV0dG9uLnNldEF0dHJpYnV0ZShcImRhdGEtbGV2ZWxcIiwga2V5KTtcblxuXHRcdGJ1dHRvbi5hcHBlbmRDaGlsZChmcm9udEZhY2UpO1xuXHRcdGJ1dHRvbi5hcHBlbmRDaGlsZChiYWNrRmFjZSk7XG5cblx0XHRpZiAoa2V5ID09PSBcIjBcIikge1xuXHRcdFx0YnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJzZWxlY3RlZFwiKTtcblx0XHR9XG5cblx0XHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2hvbWVTZWN0aW9uICNsZXZlbE9wdGlvbnNcIikuYXBwZW5kQ2hpbGQoYnV0dG9uKTtcblx0fVxufTtcblxuY29uc3QgbG9hZEdhbWVDaGFyYWN0ZXJzID0gKCkgPT4ge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRmb3IgKGxldCBjaGFyYWN0ZXIgaW4gQ0hBUkFDVEVSUykge1xuXHRcdGxldCB7YXNzZXRQYXRofSA9IENIQVJBQ1RFUlNbY2hhcmFjdGVyXTtcblx0XHRsZXQgY2hhcmFjdGVyT2JqID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblxuXHRcdGNoYXJhY3Rlck9iai5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBgdXJsKFwiaW1hZ2VzL2Fzc2V0cy8ke2Fzc2V0UGF0aH1cIilgO1xuXHRcdGNoYXJhY3Rlck9iai5jbGFzc0xpc3QuYWRkKFwiY2hhcmFjdGVyLWVudHJ5XCIpO1xuXHRcdGNoYXJhY3Rlck9iai5zZXRBdHRyaWJ1dGUoXCJkYXRhLWlkXCIsIGNoYXJhY3Rlcik7XG5cblx0XHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2NoYXJhY3RlcnNMaXN0XCIpLmFwcGVuZENoaWxkKGNoYXJhY3Rlck9iaik7XG5cdH1cblx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNjaGFyYWN0ZXJzTGlzdCAuY2hhcmFjdGVyLWVudHJ5Om50aC1jaGlsZCgxKVwiKS5jbGFzc0xpc3QuYWRkKFwic2VsZWN0ZWRcIik7XG5cdHVwZGF0ZVNlbGVjdGVkQ2hhcmFjdGVyKCk7XG59XG5cbi8qKlxuICogVXBkYXRlZCB0aGUgY2hhcmFjdGVyIHNlbGVjdGVkIGZvciB0aGUgUGxheWVyXG4gKi9cbmNvbnN0IHVwZGF0ZVNlbGVjdGVkQ2hhcmFjdGVyID0gKCkgPT4ge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRsZXQgc2VsZWN0ZWRDaGFyYWN0ZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2NoYXJhY3RlcnNMaXN0IC5jaGFyYWN0ZXItZW50cnkuc2VsZWN0ZWRcIik7XG5cdGxldCBzZWxlY3RlZE9iakltZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY2hhcmFjdGVyU2VsZWN0ZWQgZGl2Om50aC1jaGlsZCgxKVwiKTtcblx0bGV0IHNlbGVjdGVkT2JqTmFtZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY2hhcmFjdGVyU2VsZWN0ZWQgZGl2Om50aC1jaGlsZCgyKVwiKTtcblx0bGV0IGNoYXJhY3RlciA9IHNlbGVjdGVkQ2hhcmFjdGVyLmdldEF0dHJpYnV0ZShcImRhdGEtaWRcIik7XG5cblx0c2VsZWN0ZWRPYmpJbWcuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gc2VsZWN0ZWRDaGFyYWN0ZXIuc3R5bGUuYmFja2dyb3VuZEltYWdlO1xuXHRzZWxlY3RlZE9iak5hbWUuaW5uZXJUZXh0ID0gQ0hBUkFDVEVSU1tjaGFyYWN0ZXJdLm5hbWU7XG59XG5cbi8qKlxuICogVXBkYXRlIHBsYXllciBjaGFyYWN0ZXJcbiAqL1xuY29uc3Qgc2VsZWN0Q2hhcmFjdGVyID0gZXZlbnQgPT4ge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRpZiAoZXZlbnQudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhcImNoYXJhY3Rlci1lbnRyeVwiKSkge1xuXHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY2hhcmFjdGVyc0xpc3QgLmNoYXJhY3Rlci1lbnRyeS5zZWxlY3RlZFwiKS5jbGFzc0xpc3QucmVtb3ZlKFwic2VsZWN0ZWRcIik7XG5cdFx0ZXZlbnQudGFyZ2V0LmNsYXNzTGlzdC5hZGQoXCJzZWxlY3RlZFwiKTtcblxuXHRcdHVwZGF0ZVNlbGVjdGVkQ2hhcmFjdGVyKCk7XG5cdH1cbn1cblxuLyoqXG4gKiBQYXVzZSBnYW1lIHRoZW1lIHNvdW5kIHdoZW4gcGFnZSBsb3NlcyBmb2N1c1xuICovXG5jb25zdCBjaGVja0dhbWVGb2N1cyA9ICgpID0+IHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0aWYgKGRvY3VtZW50Lmhhc0ZvY3VzKCkpIHtcblx0XHRnYW1lTWF0Y2guc3RhcnRBdWRpbyhmYWxzZSk7XG5cdH0gZWxzZSB7XG5cdFx0Z2FtZU1hdGNoLnBhdXNlQXVkaW8oKTtcblx0fVxufVxuXG4vKlxuICogU2hvdyBob21lIHBhZ2Ugc2VjdGlvbiAoaGlkZSBhbGwgdGhlIG90aGVycylcbiAqL1xuY29uc3Qgc2hvd0hvbWUgPSAoKSA9PiB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaG9tZVNlY3Rpb25cIikuY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcblx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnYW1lU2VjdGlvblwiKS5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xuXG5cdGlmICghZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnYW1lUmVzdWx0U2VjdGlvblwiKS5jbGFzc0xpc3QuY29udGFpbnMoXCJoaWRkZW5cIikpIHtcblx0XHRkaXNtaXNzR2FtZVJlc3VsdCgpO1xuXHR9XG5cblx0YWRkSG9tZUxpc3RlbmVycygpO1xuXHRyZW1vdmVHYW1lTGlzdGVuZXJzKCk7XG5cdGNoZWNrUmVzdW1lQnV0dG9uKCk7XG59XG5cbi8qXG4gKiBTaG93IGdhbWUgc2VjdGlvbiAoaGlkZSBhbGwgdGhlIG90aGVycylcbiAqL1xuY29uc3Qgc2hvd0dhbWUgPSAoKSA9PiB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaG9tZVNlY3Rpb25cIikuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcblx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnYW1lU2VjdGlvblwiKS5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpO1xuXG5cdGlmICghZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnYW1lUmVzdWx0U2VjdGlvblwiKS5jbGFzc0xpc3QuY29udGFpbnMoXCJoaWRkZW5cIikpIHtcblx0XHRkaXNtaXNzR2FtZVJlc3VsdCgpO1xuXHR9XG5cblx0cmVtb3ZlSG9tZUxpc3RlbmVycygpO1xuXHRhZGRHYW1lTGlzdGVuZXJzKCk7XG59XG5cbi8qXG4gKiBTaG93IGdhbWUgcmVzdWx0IFwiZGlhbG9nXCJcbiAqL1xuY29uc3Qgc2hvd0dhbWVSZXN1bHQgPSBzdWNjZXNzID0+IHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0aWYgKCFnYW1lTWF0Y2guZ2FtZUNvbXBsZXRlZCgpKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0bGV0IGdhbWVSZXN1bHRTZWN0aW9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnYW1lUmVzdWx0U2VjdGlvblwiKTtcblxuXHRnYW1lUmVzdWx0U2VjdGlvbi5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpO1xuXG5cdC8vIHRvIHNpbXVsYXRlIGEgcmVhbCBkaWFsb2cgcHJldmVudCBwYWdlIHNjcm9sbGluZyBieSBoaWRpbmcgb3ZlcmZsb3dcblx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImJvZHlcIikuY2xhc3NMaXN0LmFkZChcImZ1bGwtc2NyZWVuXCIpO1xuXG5cdC8vIHVwZGF0ZSBkaWFsb2cgd2l0aCBnYW1lIHJlc3VsdHNcblx0Z2FtZVJlc3VsdFNlY3Rpb24ucXVlcnlTZWxlY3RvcihcIiNnYW1lUmVzdWx0VGV4dFwiKS5pbm5lclRleHQgPSBzdWNjZXNzPyBcIkxldmVsIENvbXBsZXRlZCFcIiA6IFwiWW91IExvc3Qg4pi5XCI7XG5cdGdhbWVSZXN1bHRTZWN0aW9uLnF1ZXJ5U2VsZWN0b3IoXCIjZ2FtZVRvdGFsVGltZVwiKS5pbm5lclRleHQgPSBgVG90YWwgdGltZTogJHtnYW1lTWF0Y2guZ2V0RWxhcHNlZFRpbWUoKX1gO1xuXG5cdC8vIHVwZGF0ZSBzdGFycyByYXRpbmdcblx0bGV0IHJhdGluZyA9IGdhbWVNYXRjaC5nZXRTdGFyUmF0aW5nKCk7XG5cdGxldCBzdGFyUmF0ZSA9IDEwMCAvIE1BWF9TVEFSUztcblx0Zm9yIChsZXQgc3RhciBvZiBnYW1lUmVzdWx0U2VjdGlvbi5xdWVyeVNlbGVjdG9yQWxsKFwiLnN0YXJcIikpIHtcblx0XHRpZiAocmF0aW5nIC0gc3RhclJhdGUgPiAwKSB7XG5cdFx0XHRzdGFyLnF1ZXJ5U2VsZWN0b3IoXCIuc3Rhci1pbm5lclwiKS5zdHlsZS53aWR0aCA9IFwiMTAwJVwiO1xuXHRcdFx0cmF0aW5nIC09IHN0YXJSYXRlO1xuXHRcdH0gZWxzZSBpZiAocmF0aW5nID4gMCkge1xuXHRcdFx0bGV0IHN0YXJQZXJjID0gKDEwMCAqIHJhdGluZykgLyBzdGFyUmF0ZTtcblx0XHRcdHN0YXIucXVlcnlTZWxlY3RvcihcIi5zdGFyLWlubmVyXCIpLnN0eWxlLndpZHRoID0gYCR7c3RhclBlcmN9JWA7XG5cdFx0XHRyYXRpbmcgLT0gc3RhclJhdGU7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHN0YXIucXVlcnlTZWxlY3RvcihcIi5zdGFyLWlubmVyXCIpLnN0eWxlLndpZHRoID0gXCIwJVwiO1xuXHRcdH1cblx0fVxuXG5cdGRpc2FibGVSZXN1bWVCdXR0b25zKCk7XG5cdHJlbW92ZUhvbWVMaXN0ZW5lcnMoKTtcblx0cmVtb3ZlR2FtZUxpc3RlbmVycygpO1xuXHRhZGRHYW1lUmVzdWx0TGlzdGVuZXJzKCk7XG59XG5cbi8qXG4gKiBIaWRlIGdhbWUgcmVzdWx0IGRpYWxvZ1xuICovXG5jb25zdCBkaXNtaXNzR2FtZVJlc3VsdCA9ICgpID0+IHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnYW1lUmVzdWx0U2VjdGlvblwiKS5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xuXG5cdC8vIHJlLWVuYWJsZSBvdmVyZmxvdyBvbiBwYWdlXG5cdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJib2R5XCIpLmNsYXNzTGlzdC5yZW1vdmUoXCJmdWxsLXNjcmVlblwiKTtcblxuXHRyZW1vdmVHYW1lUmVzdWx0TGlzdGVuZXJzKCk7XG59XG5cbi8qXG4gKiBVcGRhdGUgdGhlIGxldmVsIGFuZCBzdGFydCBjbG9jayBpbiB0aGUgZ2FtZSBwYWdlXG4gKi9cbmNvbnN0IHVwZGF0ZUdhbWVJbmZvcyA9ICgpID0+IHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0Y2xlYXJJbnRlcnZhbChjbG9ja0lEKTtcblx0Y2xvY2tJRCA9IHNldEludGVydmFsKCgpID0+IHtcblx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdhbWVUaW1lRWxhcHNlZFwiKS5pbm5lclRleHQgPSBnYW1lTWF0Y2guZ2V0RWxhcHNlZFRpbWUoKTtcblx0fSwgMTAwMCk7XG5cblx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnYW1lTGV2ZWxEZXNjcmlwdGlvblwiKS5pbm5lclRleHQgPSBgTGV2ZWwgJHtHQU1FX0xFVkVMU1tnYW1lTWF0Y2guZ2V0TGV2ZWwoKV19YDtcbn1cblxuLyoqXG4gKiBNYWtlIHJlc3VtZSBidXR0b25zIGF2YWlsYWJsZVxuICovXG5jb25zdCBlbmFibGVSZXN1bWVCdXR0b25zID0gKCkgPT4ge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRmb3IgKGxldCBidG4gb2YgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5idG4tcmVzdW1lXCIpKSB7XG5cdFx0YnRuLmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRkZW5cIik7XG5cdH1cbn1cblxuLyoqXG4gKiBNYWtlIHJlc3VtZSBidXR0b25zIHVuYXZhaWxhYmxlXG4gKi9cbmNvbnN0IGRpc2FibGVSZXN1bWVCdXR0b25zID0gKCkgPT4ge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRmb3IgKGxldCBidG4gb2YgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5idG4tcmVzdW1lXCIpKSB7XG5cdFx0YnRuLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG5cdH1cbn1cblxuLyoqXG4gKiBEaXNhYmxlIHJlc3VtZSBidXR0b24gd2hlbiBzZWxlY3RlZCBsZXZlbCBidXR0b24gZG9lcyBub3QgbWF0Y2ggd2l0aCBjdXJyZW50XG4gKiBnYW1lIGxldmVsLiBFbmFibGUgb3RoZXJ3aXNlLlxuICovXG5jb25zdCBjaGVja1Jlc3VtZUJ1dHRvbiA9ICgpID0+IHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0bGV0IHJlc3VtZUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYnRuLXJlc3VtZVwiKTtcblx0bGV0IHNlbGVjdGVkTGV2ZWxCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmJ0bi1sZXZlbC5zZWxlY3RlZFwiKTtcblxuXHRpZiAoIXJlc3VtZUJ0bi5jbGFzc0xpc3QuY29udGFpbnMoXCJoaWRkZW5cIikpIHtcblx0XHRpZiAoc2VsZWN0ZWRMZXZlbEJ1dHRvbi5kYXRhc2V0LmxldmVsID09PSBnYW1lTWF0Y2guZ2V0TGV2ZWwoKSkge1xuXHRcdFx0cmVzdW1lQnRuLmRpc2FibGVkID0gZmFsc2U7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJlc3VtZUJ0bi5kaXNhYmxlZCA9IHRydWU7XG5cdFx0fVxuXHR9XG59XG5cbi8qXG4gKiBTdGFydCBhIG5ldyBnYW1lIG9uIGEgc3BlY2lmaWVkIGxldmVsXG4gKiBAcGFyYW0gbGV2ZWwge051bWJlcn1cbiAqL1xuY29uc3QgaW5pdGlhbGlzZUdhbWUgPSBsZXZlbCA9PiB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGxldCBzZWxlY3RlZENoYXJhY3RlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY2hhcmFjdGVyc0xpc3QgLnNlbGVjdGVkXCIpLmdldEF0dHJpYnV0ZShcImRhdGEtaWRcIik7XG5cblx0aWYgKGdhbWVNYXRjaCkge1xuXHRcdGdhbWVNYXRjaC5kZXN0cm95KCk7XG5cdH0gZWxzZSB7XG5cdFx0Z2FtZU1hdGNoID0gbmV3IEFyY2FkZUdhbWUoc2hvd0dhbWVSZXN1bHQpO1xuXHR9XG5cblx0Z2FtZU1hdGNoLmluaXRpYWxpc2UobGV2ZWwsIHNlbGVjdGVkQ2hhcmFjdGVyKTtcblxuXHRlbmFibGVSZXN1bWVCdXR0b25zKCk7XG5cdHNob3dHYW1lKCk7XG5cdHVwZGF0ZUdhbWVJbmZvcygpO1xufVxuXG4vKlxuICogU3RhcnQgYSBuZXcgZ2FtZSBmcm9tIHRoZSBzZWxlY3RlZCBsZXZlbFxuICovXG5jb25zdCBzdGFydEdhbWUgPSAoKSA9PiB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGxldCBsZXZlbFNlbGVjdGVkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5idG4tbGV2ZWwuc2VsZWN0ZWRcIikuZGF0YXNldC5sZXZlbDtcblxuXHRpbml0aWFsaXNlR2FtZShsZXZlbFNlbGVjdGVkKTtcbn1cblxuLypcbiAqIFN0YXJ0IGEgbmV3IGdhbWUgZnJvbSB0aGUgY3VycmVudCBnYW1lIGxldmVsXG4gKi9cbmNvbnN0IHJlc2V0R2FtZSA9ICgpID0+IHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0bGV0IGxldmVsID0gZ2FtZU1hdGNoLmdldExldmVsKCk7XG5cblx0aW5pdGlhbGlzZUdhbWUobGV2ZWwpO1xufVxuXG4vKlxuICogUmVzZXQgdG8gYSBuZXcgZ2FtZSB3aXRoIGhpZ2hlciBsZXZlbFxuICovXG5jb25zdCBsZXZlbFVwID0gKCkgPT4ge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRsZXQgbmV4dExldmVsID0gcGFyc2VJbnQoZ2FtZU1hdGNoLmdldExldmVsKCksIDEwKSArIDE7XG5cblx0aW5pdGlhbGlzZUdhbWUobmV4dExldmVsKTtcbn1cblxuLypcbiAqIEV2ZW50IGNhbGxiYWNrIG1ldGhvZCB0byBzZWxlY3QgYSBsZXZlbFxuICogQHBhcmFtIGV2ZW50IHtPYmplY3R9XG4gKi9cbmNvbnN0IHNlbGVjdExldmVsID0gZXZlbnQgPT4ge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRpZiAoZXZlbnQudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhcImJ0bi1sZXZlbFwiKSkge1xuXHRcdC8vIHJlbW92ZSBzZWxlY3Rpb24gZnJvbSBjdXJyZW50bHkgc2VsZWN0ZWQgYnV0dG9uXG5cdFx0bGV0IGN1cnJlbnRseVNlbGVjdGVkQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5idG4tbGV2ZWwuc2VsZWN0ZWRcIik7XG5cdFx0aWYgKGN1cnJlbnRseVNlbGVjdGVkQnV0dG9uKSB7XG5cdFx0XHRjdXJyZW50bHlTZWxlY3RlZEJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKFwic2VsZWN0ZWRcIilcblx0XHR9XG5cdFx0Ly8gYWRkIHNlbGVjdGlvbiB0byB0aGUgYnV0dG9uIHRoYXQgaGFzIGp1c3QgYmVlbiBjbGlja2VkXG5cdFx0ZXZlbnQudGFyZ2V0LmNsYXNzTGlzdC5hZGQoXCJzZWxlY3RlZFwiKTtcblxuXHRcdC8vIGV2ZW50dWFsbHkgZGlzYWJsZSByZXN1bWUgb3B0aW9uXG5cdFx0Y2hlY2tSZXN1bWVCdXR0b24oKTtcblx0fVxufVxuXG4vKipcbiAqIEFkZCBsb2FkaW5nIGNsYXNzIHRvIGNsaWNrZWQgYnV0dG9uIHRoZW4gc2hvdyB0aGUgZ2FtZSBwYWdlXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGV2ZW50XG4gKi9cbmNvbnN0IGxvYWRHYW1lID0gZXZlbnQgPT4ge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRsZXQgY2FsbGJhY2sgPSBzdGFydEdhbWU7XG5cdGV2ZW50LnRhcmdldC5jbGFzc0xpc3QuYWRkKFwibG9hZGluZ1wiKTtcblxuXHRpZiAoZXZlbnQudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhcImJ0bi1yZXN1bWVcIikpIHtcblx0XHRjYWxsYmFjayA9ICgpID0+IHtcblx0XHRcdHNob3dHYW1lKCk7XG5cdFx0XHRnYW1lTWF0Y2guc3RhcnRBdWRpbyhmYWxzZSk7XG5cdFx0fVxuXHR9XG5cblx0c2V0VGltZW91dCgoKSA9PiB7XG5cdFx0Zm9yIChsZXQgbG9hZGluZ0VsZW1lbnQgb2YgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5sb2FkaW5nXCIpKSB7XG5cdFx0XHRsb2FkaW5nRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKFwibG9hZGluZ1wiKTtcblx0XHR9XG5cblx0XHRjYWxsYmFjaygpO1xuXHR9LCAxMDAwKTtcbn1cblxuLypcbiAqIExpc3RlbiB0byBhIGNsaWNrIGV2ZW50IG9uIHRoZSBsZXZlbCBidXR0b25zIHRvIHNlbGVjdCBpdC5cbiAqIEFsc28gbGlzdGVuIHRvIHRoZSByZXN1bWUgYnV0dG9uIHRvIGdvIGJhY2sgdG8gdGhlIGdhbWUgd2l0aG91dCByZXN0YXJ0aW5nIGl0LlxuICovXG5jb25zdCBhZGRIb21lTGlzdGVuZXJzID0gKCkgPT4ge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxldmVsQ2hhcmFjdGVyXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBzZWxlY3RDaGFyYWN0ZXIpO1xuXHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxldmVsT3B0aW9uc1wiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgc2VsZWN0TGV2ZWwpO1xuXHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmJ0bi1yZXN1bWVcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGxvYWRHYW1lKTtcbn1cblxuLypcbiAqIFN0b3AgbGlzdGVuaW5nIHRvIHRoZSBpbnRlcmFjdGlvbnMgb24gdGhlIGxldmVsIGFuZCByZXN1bWUgYnV0dG9ucy5cbiAqL1xuY29uc3QgcmVtb3ZlSG9tZUxpc3RlbmVycyA9ICgpID0+IHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsZXZlbE9wdGlvbnNcIikucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHNlbGVjdExldmVsKTtcblx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5idG4tcmVzdW1lXCIpLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBsb2FkR2FtZSk7XG59XG5cbi8qXG4gKiBMaXN0ZW4gdG8gYSBjbGljayBldmVudCBvbiBlYWNoIGNhcmQgaW4gdGhlIGdyaWQgaW4gb3JkZXIgdG8gZmxpcCB0aGUgY2FyZFxuICovXG5jb25zdCBhZGRHYW1lTGlzdGVuZXJzID0gKCkgPT4ge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRjaGVja0dhbWVGb2N1c0ludGVydmFsSUQgPSBzZXRJbnRlcnZhbChjaGVja0dhbWVGb2N1cywgMzAwKTtcbn1cblxuLypcbiAqIFN0b3AgbGlzdGVuaW5nIHRvIHRoZSBpbnRlcmFjdGlvbnMgb24gdGhlIGNhcmRzXG4gKi9cbmNvbnN0IHJlbW92ZUdhbWVMaXN0ZW5lcnMgPSAoKSA9PiB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGNsZWFySW50ZXJ2YWwoY2hlY2tHYW1lRm9jdXNJbnRlcnZhbElEKTtcblx0Z2FtZU1hdGNoLnBhdXNlQXVkaW8oKTtcbn1cblxuLypcbiAqIExpc3RlbiB0byBhIGNsaWNrIGV2ZW4gb24gdGhlIGxldmVsIHVwIGJ1dHRvblxuICovXG5jb25zdCBhZGRHYW1lUmVzdWx0TGlzdGVuZXJzID0gKCkgPT4ge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2dhbWVSZXN1bHRTZWN0aW9uIC5kaWFsb2cgLmJ0bi1sZXZlbHVwXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBsZXZlbFVwKTtcbn1cblxuLypcbiAqIFN0b3AgbGlzdGVuaW5nIHRvIHRoZSBsZXZlbCB1cCBidXR0b24gY2xpY2tcbiAqL1xuY29uc3QgcmVtb3ZlR2FtZVJlc3VsdExpc3RlbmVycyA9ICgpID0+IHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNnYW1lUmVzdWx0U2VjdGlvbiAuZGlhbG9nIC5idG4tbGV2ZWx1cFwiKS5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgbGV2ZWxVcCk7XG59XG5cbi8qXG4gKiBMaXN0ZW4gdG8gYSBjbGljayBldmVudCBvbiBhbGwgdGhlIGJ1dHRvbnMgaW4gdGhlIHBhZ2VzXG4gKi9cbmNvbnN0IGFkZE5hdmlnYXRpb25MaXN0ZW5lcnMgPSAoKSA9PiB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdC8vIHdoZW4gYSBzdGFydCBvciByZXNldCBidXR0b24gaXMgY2xpY2tlZCwgaW5pdGlhbGlzZSBhIG5ldyBnYW1lIHdpdGggdGhlIHNlbGVjdGVkIGxldmVsXG5cdGxldCBzdGFydEdhbWVCdXR0b25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5idG4tc3RhcnRcIik7XG5cdGZvciAobGV0IGJ0biBvZiBzdGFydEdhbWVCdXR0b25zKSB7XG5cdFx0YnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBsb2FkR2FtZSk7XG5cdH1cblxuXHRsZXQgcmVzZXRHYW1lQnV0dG9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuYnRuLXJlc2V0XCIpO1xuXHRmb3IgKGxldCBidG4gb2YgcmVzZXRHYW1lQnV0dG9ucykge1xuXHRcdGJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgcmVzZXRHYW1lKTtcblx0fVxuXG5cdC8vIHdoZW4gYW4gaG9tZSBidXR0b24gaXMgY2xpY2tlZCwgc2hvdyB0aGUgaG9tZSBzZWN0aW9uXG5cdGxldCBob21lQnV0dG9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuYnRuLWhvbWVcIik7XG5cdGZvciAobGV0IGJ0biBvZiBob21lQnV0dG9ucykge1xuXHRcdGJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgc2hvd0hvbWUpO1xuXHR9XG59XG5cbi8qKlxuICogU3VwcG9ydCBtZXRob2QgdG8gcmVkdWNlIHRyYWNrcyB2b2x1bWUsXG4gKiBpbml0aWFsaXNlIGxvb3BhYmxlIHRyYWNrcyBhbmQgaW5pdGlhbGlzZSBsaXN0ZW5lcnMgZm9yIHRyYWNrIGNvbXBsZXRpb25cbiAqIHRvIHVwZGF0ZSB0aGUgdHJhY2sgc3RhdGUuXG4gKi9cbmNvbnN0IHNldHRsZUF1ZGlvVHJhY2tzID0gKCkgPT4ge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRHQU1FX1NPVU5EUy5nYW1lVGhlbWUuYXVkaW8ubG9vcCA9IHRydWU7XG5cdEdBTUVfU09VTkRTLmdhbWVUaGVtZS5hdWRpby52b2x1bWUgPSAwLjU7XG5cdEdBTUVfU09VTkRTLnN0ZXAuYXVkaW8udm9sdW1lID0gMC41O1xuXHRHQU1FX1NPVU5EUy5qaW5nbGVMb29zZS5hdWRpby52b2x1bWUgPSAwLjI7XG5cdEdBTUVfU09VTkRTLmppbmdsZVdpbi5hdWRpby52b2x1bWUgPSAwLjI7XG5cdEdBTUVfU09VTkRTLmNyYXdsLmF1ZGlvLmxvb3AgPSB0cnVlO1xuXG5cdGZvciAobGV0IHRyYWNrIGluIEdBTUVfU09VTkRTKSB7XG5cdFx0R0FNRV9TT1VORFNbdHJhY2tdLmF1ZGlvLmFkZEV2ZW50TGlzdGVuZXIoXCJlbmRlZFwiLCAoKSA9PiB7XG5cdFx0XHRHQU1FX1NPVU5EU1t0cmFja10ucGxheWluZyA9IGZhbHNlO1xuXHRcdH0pO1xuXHR9XG59XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdHNldHRsZUF1ZGlvVHJhY2tzKCk7XG5cdGluaXRpYWxpc2VIb21lUGFnZSgpO1xuXHRhZGROYXZpZ2F0aW9uTGlzdGVuZXJzKCk7XG5cdGFkZEhvbWVMaXN0ZW5lcnMoKTtcbn0pO1xuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgKCkgPT4ge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2dhbWVSZXN1bHRTZWN0aW9uXCIpLnN0eWxlLnRvcCA9IGAke3dpbmRvdy5zY3JvbGxZfXB4YDtcbn0pO1xuIiwiLyoqIFJlc291cmNlcy5qc1xuICogVGhpcyBpcyBzaW1wbHkgYW4gaW1hZ2UgbG9hZGluZyB1dGlsaXR5LiBJdCBlYXNlcyB0aGUgcHJvY2VzcyBvZiBsb2FkaW5nXG4gKiBpbWFnZSBmaWxlcyBzbyB0aGF0IHRoZXkgY2FuIGJlIHVzZWQgd2l0aGluIHlvdXIgZ2FtZS4gSXQgYWxzbyBpbmNsdWRlc1xuICogYSBzaW1wbGUgXCJjYWNoaW5nXCIgbGF5ZXIgc28gaXQgd2lsbCByZXVzZSBjYWNoZWQgaW1hZ2VzIGlmIHlvdSBhdHRlbXB0XG4gKiB0byBsb2FkIHRoZSBzYW1lIGltYWdlIG11bHRpcGxlIHRpbWVzLlxuICovXG4oZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBsZXQgcmVzb3VyY2VDYWNoZSA9IHt9O1xuICAgIGxldCByZWFkeUNhbGxiYWNrcyA9IFtdO1xuXG4gICAgLyoqXG4gICAgICogVGhpcyBpcyB0aGUgcHVibGljbHkgYWNjZXNzaWJsZSBpbWFnZSBsb2FkaW5nIGZ1bmN0aW9uLiBJdCBhY2NlcHRzXG4gICAgICogYW4gYXJyYXkgb2Ygc3RyaW5ncyBwb2ludGluZyB0byBpbWFnZSBmaWxlcyBvciBhIHN0cmluZyBmb3IgYSBzaW5nbGVcbiAgICAgKiBpbWFnZS4gSXQgd2lsbCB0aGVuIGNhbGwgb3VyIHByaXZhdGUgaW1hZ2UgbG9hZGluZyBmdW5jdGlvbiBhY2NvcmRpbmdseS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB1cmxPckFyciB7U3RyaW5nfEFycmF5fVxuICAgICAqL1xuICAgIGNvbnN0IGxvYWQgPSB1cmxPckFyciA9PiB7XG4gICAgICAgIGlmICh1cmxPckFyciBpbnN0YW5jZW9mIEFycmF5KSB7XG5cbiAgICAgICAgICAgIC8qIElmIHRoZSBkZXZlbG9wZXIgcGFzc2VkIGluIGFuIGFycmF5IG9mIGltYWdlc1xuICAgICAgICAgICAgICogbG9vcCB0aHJvdWdoIGVhY2ggdmFsdWUgYW5kIGNhbGwgb3VyIGltYWdlXG4gICAgICAgICAgICAgKiBsb2FkZXIgb24gdGhhdCBpbWFnZSBmaWxlXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHVybE9yQXJyLmZvckVhY2goZnVuY3Rpb24odXJsKSB7XG4gICAgICAgICAgICAgICAgX2xvYWQodXJsKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAvKiBUaGUgZGV2ZWxvcGVyIGRpZCBub3QgcGFzcyBhbiBhcnJheSB0byB0aGlzIGZ1bmN0aW9uLFxuICAgICAgICAgICAgICogYXNzdW1lIHRoZSB2YWx1ZSBpcyBhIHN0cmluZyBhbmQgY2FsbCBvdXIgaW1hZ2UgbG9hZGVyXG4gICAgICAgICAgICAgKiBkaXJlY3RseS5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgX2xvYWQodXJsT3JBcnIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhpcyBpcyBvdXIgcHJpdmF0ZSBpbWFnZSBsb2FkZXIgZnVuY3Rpb24sIGl0IGlzXG4gICAgICogY2FsbGVkIGJ5IHRoZSBwdWJsaWMgaW1hZ2UgbG9hZGVyIGZ1bmN0aW9uLlxuICAgICAqL1xuICAgIGNvbnN0IF9sb2FkID0gdXJsID0+IHtcbiAgICAgICAgaWYgKHJlc291cmNlQ2FjaGVbdXJsXSkge1xuXG4gICAgICAgICAgICAvKiBJZiB0aGlzIFVSTCBoYXMgYmVlbiBwcmV2aW91c2x5IGxvYWRlZCBpdCB3aWxsIGV4aXN0IHdpdGhpblxuICAgICAgICAgICAgICogb3VyIHJlc291cmNlQ2FjaGUgYXJyYXkuIEp1c3QgcmV0dXJuIHRoYXQgaW1hZ2UgcmF0aGVyIHRoYW5cbiAgICAgICAgICAgICAqIHJlLWxvYWRpbmcgdGhlIGltYWdlLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICByZXR1cm4gcmVzb3VyY2VDYWNoZVt1cmxdO1xuICAgICAgICB9XG5cbiAgICAgICAgLyogVGhpcyBVUkwgaGFzIG5vdCBiZWVuIHByZXZpb3VzbHkgbG9hZGVkIGFuZCBpcyBub3QgcHJlc2VudFxuICAgICAgICAgKiB3aXRoaW4gb3VyIGNhY2hlOyB3ZSdsbCBuZWVkIHRvIGxvYWQgdGhpcyBpbWFnZS5cbiAgICAgICAgICovXG4gICAgICAgIGxldCBpbWcgPSBuZXcgSW1hZ2UoKTtcblxuICAgICAgICBpbWcub25sb2FkID0gKCkgPT4ge1xuXG4gICAgICAgICAgICAvKiBPbmNlIG91ciBpbWFnZSBoYXMgcHJvcGVybHkgbG9hZGVkLCBhZGQgaXQgdG8gb3VyIGNhY2hlXG4gICAgICAgICAgICAgKiBzbyB0aGF0IHdlIGNhbiBzaW1wbHkgcmV0dXJuIHRoaXMgaW1hZ2UgaWYgdGhlIGRldmVsb3BlclxuICAgICAgICAgICAgICogYXR0ZW1wdHMgdG8gbG9hZCB0aGlzIGZpbGUgaW4gdGhlIGZ1dHVyZS5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgcmVzb3VyY2VDYWNoZVt1cmxdID0gaW1nO1xuXG4gICAgICAgICAgICAvKiBPbmNlIHRoZSBpbWFnZSBpcyBhY3R1YWxseSBsb2FkZWQgYW5kIHByb3Blcmx5IGNhY2hlZCxcbiAgICAgICAgICAgICAqIGNhbGwgYWxsIG9mIHRoZSBvblJlYWR5KCkgY2FsbGJhY2tzIHdlIGhhdmUgZGVmaW5lZC5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgaWYgKGlzUmVhZHkoKSkge1xuICAgICAgICAgICAgICAgIHJlYWR5Q2FsbGJhY2tzLmZvckVhY2goY2FsbGJhY2sgPT4gY2FsbGJhY2soKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLyogU2V0IHRoZSBpbml0aWFsIGNhY2hlIHZhbHVlIHRvIGZhbHNlLCB0aGlzIHdpbGwgY2hhbmdlIHdoZW5cbiAgICAgICAgICogdGhlIGltYWdlJ3Mgb25sb2FkIGV2ZW50IGhhbmRsZXIgaXMgY2FsbGVkLiBGaW5hbGx5LCBwb2ludFxuICAgICAgICAgKiB0aGUgaW1hZ2UncyBzcmMgYXR0cmlidXRlIHRvIHRoZSBwYXNzZWQgaW4gVVJMLlxuICAgICAgICAgKi9cbiAgICAgICAgcmVzb3VyY2VDYWNoZVt1cmxdID0gZmFsc2U7XG4gICAgICAgIGltZy5zcmMgPSB1cmw7XG5cbiAgICAgICAgcmV0dXJuIGltZztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGlzIGlzIHVzZWQgYnkgZGV2ZWxvcGVycyB0byBncmFiIHJlZmVyZW5jZXMgdG8gaW1hZ2VzIHRoZXkga25vd1xuICAgICAqIGhhdmUgYmVlbiBwcmV2aW91c2x5IGxvYWRlZC4gSWYgYW4gaW1hZ2UgaXMgY2FjaGVkLCB0aGlzIGZ1bmN0aW9uc1xuICAgICAqIHRoZSBzYW1lIGFzIGNhbGxpbmcgbG9hZCgpIG9uIHRoYXQgVVJMLlxuICAgICAqL1xuICAgIGNvbnN0IGdldCA9IHVybCA9PiByZXNvdXJjZUNhY2hlW3VybF07XG5cbiAgICAvKiBUaGlzIGZ1bmN0aW9uIGRldGVybWluZXMgaWYgYWxsIG9mIHRoZSBpbWFnZXMgdGhhdCBoYXZlIGJlZW4gcmVxdWVzdGVkXG4gICAgICogZm9yIGxvYWRpbmcgaGF2ZSBpbiBmYWN0IGJlZW4gcHJvcGVybHkgbG9hZGVkLlxuICAgICAqL1xuICAgIGNvbnN0IGlzUmVhZHkgPSAoKSA9PiB7XG4gICAgICAgIGxldCByZWFkeSA9IHRydWU7XG5cbiAgICAgICAgZm9yIChsZXQgayBpbiByZXNvdXJjZUNhY2hlKSB7XG4gICAgICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHJlc291cmNlQ2FjaGUsIGspICYmICFyZXNvdXJjZUNhY2hlW2tdKSB7XG4gICAgICAgICAgICAgICAgcmVhZHkgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZWFkeTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIHdpbGwgYWRkIGEgZnVuY3Rpb24gdG8gdGhlIGNhbGxiYWNrIHN0YWNrIHRoYXQgaXMgY2FsbGVkXG4gICAgICogd2hlbiBhbGwgcmVxdWVzdGVkIGltYWdlcyBhcmUgcHJvcGVybHkgbG9hZGVkLlxuICAgICAqL1xuICAgIGNvbnN0IG9uUmVhZHkgPSBjYWxsYmFjayA9PiB7XG4gICAgICAgIHJlYWR5Q2FsbGJhY2tzLnB1c2goY2FsbGJhY2spO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoaXMgb2JqZWN0IGRlZmluZXMgdGhlIHB1YmxpY2x5IGFjY2Vzc2libGUgZnVuY3Rpb25zIGF2YWlsYWJsZSB0b1xuICAgICAqIGRldmVsb3BlcnMgYnkgY3JlYXRpbmcgYSBnbG9iYWwgUmVzb3VyY2VzIG9iamVjdC5cbiAgICAgKi9cbiAgICB3aW5kb3cuUmVzb3VyY2VzID0ge1xuICAgICAgICBnZXQsXG4gICAgICAgIGlzUmVhZHksXG4gICAgICAgIGxvYWQsXG4gICAgICAgIG9uUmVhZHlcbiAgICB9O1xufSgpKTtcblxuZXhwb3J0IHtSZXNvdXJjZXN9O1xuIiwiZnVuY3Rpb24gZ2V0UmFuZG9tTnVtYmVyKG1pbiwgbWF4KSB7XG4gIHJldHVybiBNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbikgKyBtaW47XG59XG5cbmZ1bmN0aW9uIGdldFJhbmRvbUludChtaW4sIG1heCkge1xuICAgIHJldHVybiBNYXRoLmZsb29yKGdldFJhbmRvbU51bWJlcihtaW4sIG1heCkpO1xufVxuXG5mdW5jdGlvbiBmb3JtYXRUaW1lVG9TdHJpbmcobXMpIHtcbiAgICBsZXQgZm9ybWF0dGVkVGltZVBhcnRzID0gW107XG4gICAgbGV0IGRheVRvTXMgPSAyNCAqIDYwICogNjAgKiAxMDAwO1xuICAgIGxldCBob3VyVG9NcyA9IDYwICogNjAgKiAxMDAwO1xuICAgIGxldCBtaW51dGVUb01zID0gNjAgKiAxMDAwO1xuICAgIGxldCBzZWNvbmRUb01zID0gMTAwMDtcblxuICAgIGxldCBkYXlzID0gTWF0aC5mbG9vcihtcyAvIGRheVRvTXMpO1xuICAgIGxldCBob3VycyA9IE1hdGguZmxvb3IoKG1zIC0gKGRheXMgKiBkYXlUb01zKSkgLyBob3VyVG9Ncyk7XG4gICAgbGV0IG1pbnV0ZXMgPSBNYXRoLmZsb29yKChtcyAtIChob3VycyAqIGhvdXJUb01zKSkgLyBtaW51dGVUb01zKTtcbiAgICBsZXQgc2Vjb25kcyA9IE1hdGguZmxvb3IoKG1zIC0gKG1pbnV0ZXMgKiBtaW51dGVUb01zKSkgLyBzZWNvbmRUb01zKTtcblxuICAgIGlmIChkYXlzKSB7IGZvcm1hdHRlZFRpbWVQYXJ0cy5wdXNoKGAke2RheXN9ZGApOyB9XG4gICAgaWYgKGhvdXJzIHx8IGZvcm1hdHRlZFRpbWVQYXJ0cy5sZW5ndGgpIHsgZm9ybWF0dGVkVGltZVBhcnRzLnB1c2goYCR7aG91cnN9aGApOyB9XG4gICAgaWYgKG1pbnV0ZXMgfHwgZm9ybWF0dGVkVGltZVBhcnRzLmxlbmd0aCkgeyBmb3JtYXR0ZWRUaW1lUGFydHMucHVzaChgJHttaW51dGVzfW1gKTsgfVxuICAgIGlmIChzZWNvbmRzIHx8IGZvcm1hdHRlZFRpbWVQYXJ0cy5sZW5ndGgpIHsgZm9ybWF0dGVkVGltZVBhcnRzLnB1c2goYCR7c2Vjb25kc31zYCk7IH1cblxuICAgIHJldHVybiBmb3JtYXR0ZWRUaW1lUGFydHMuam9pbihcIiBcIik7XG59XG5cbmV4cG9ydCB7Z2V0UmFuZG9tTnVtYmVyLCBnZXRSYW5kb21JbnQsIGZvcm1hdFRpbWVUb1N0cmluZ307XG4iXX0=

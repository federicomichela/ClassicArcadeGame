(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Player = exports.Enemy = void 0;

var _const = require("./const.mjs");

var _resources = require("./resources.mjs");

var _utils = require("./utils.mjs");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Character =
/*#__PURE__*/
function () {
  function Character(sprite, positionX, positionY) {
    _classCallCheck(this, Character);

    this.sprite = sprite;
    this._x = positionX || 0;
    this._y = positionY || 0;
  }

  _createClass(Character, [{
    key: "update",
    value: function update() {// noop
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
      ctx.drawImage(_resources.Resources.get(this.sprite), this._x, this._y);
    }
  }]);

  return Character;
}(); // Enemies our player must avoid


var Enemy =
/*#__PURE__*/
function (_Character) {
  _inherits(Enemy, _Character);

  function Enemy(positionX, positionY) {
    _classCallCheck(this, Enemy);

    return _possibleConstructorReturn(this, _getPrototypeOf(Enemy).call(this, 'images/assets/enemy-bug.png', positionX || -100 + (0, _utils.getRandomInt)(1, 6) * 100, positionY || -20 + (0, _utils.getRandomInt)(1, 4) * 80));
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
}(Character); // Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.


exports.Enemy = Enemy;

var Player =
/*#__PURE__*/
function (_Character2) {
  _inherits(Player, _Character2);

  function Player(character, lifeSpanBar) {
    var _this;

    _classCallCheck(this, Player);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Player).call(this, "images/assets/".concat(_const.CHARACTERS[character].assetPath), _const.BOUNDARIES.left, _const.BOUNDARIES.down));
    _this._name = _const.CHARACTERS[character].name;
    _this._lifeSpan = _const.MAX_LIFESPAN;
    _this._lifeSpanBar = lifeSpanBar;
    _this._animatingCollision = false;
    _this._waterReached = false;
    _this._positionUpdated = false;
    _this._methods = {
      "onClick": _this._onClick.bind(_assertThisInitialized(_this)),
      "onKeyPressed": _this._onKeyPressed.bind(_assertThisInitialized(_this))
    };
    document.addEventListener("keyup", _this._methods.onKeyPressed);
    document.getElementById("gameCanvas").addEventListener("click", _this._methods.onClick);
    return _this;
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
      var _this2 = this;

      var left = false;
      var repeat = 8;
      var animation = null;

      var shake = function shake() {
        if (left) {
          _this2._x -= 5;
        } else {
          _this2._x += 5;
        }

        left = !left;
        repeat--;

        if (repeat) {
          animation = window.requestAnimationFrame(shake);
        } else {
          window.cancelAnimationFrame(animation);
          _this2._x = _const.BOUNDARIES.left;
          _this2._y = _const.BOUNDARIES.down;
          _this2._animatingCollision = false;

          _this2._updateLifeSpan(-1);
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
      var move = null;

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

            if (this._x < _const.BOUNDARIES.left) {
              this._x = _const.BOUNDARIES.left;
              this._positionUpdated = false;
            }

            break;

          case "up":
            this._y -= 80;

            if (this._y < _const.BOUNDARIES.up) {
              this._waterReached = true;
              document.removeEventListener("keyup", this._methods.onKeyPressed);
            }

            break;

          case "right":
            this._x += 100;

            if (this._x > _const.BOUNDARIES.right) {
              this._x = _const.BOUNDARIES.right;
              this._positionUpdated = false;
            }

            break;

          case "down":
            this._y += 80;

            if (this._y > _const.BOUNDARIES.down) {
              this._y = _const.BOUNDARIES.down;
              this._positionUpdated = false;
            }

            break;

          default:
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

      this._lifeSpanBar.querySelector(".progress-bar-inner").style.width = "".concat(lifeSpanPerc, "%");
    }
  }]);

  return Player;
}(Character);

exports.Player = Player;

},{"./const.mjs":2,"./resources.mjs":5,"./utils.mjs":6}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GAME_SOUNDS = exports.CHARACTERS = exports.ENEMIES = exports.BOUNDARIES = exports.ALLOWED_KEYS = exports.GAME_LEVELS = exports.MAX_LIFESPAN = exports.MAX_STARS = void 0;
var MAX_STARS = 5;
exports.MAX_STARS = MAX_STARS;
var MAX_LIFESPAN = 10;
exports.MAX_LIFESPAN = MAX_LIFESPAN;
var GAME_LEVELS = {
  "0": "Easy",
  "1": "Classic",
  "2": "Adventure"
};
exports.GAME_LEVELS = GAME_LEVELS;
var ALLOWED_KEYS = {
  "37": "left",
  "38": "up",
  "39": "right",
  "40": "down"
};
exports.ALLOWED_KEYS = ALLOWED_KEYS;
var BOUNDARIES = {
  "down": 380,
  "left": 0,
  "right": 400,
  "up": 60
};
exports.BOUNDARIES = BOUNDARIES;
var ENEMIES = {
  "0": 3,
  "1": 5,
  "2": 7
};
exports.ENEMIES = ENEMIES;
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
exports.CHARACTERS = CHARACTERS;
var GAME_SOUNDS = {
  "award": {
    "audio": new Audio("audio/award.wav"),
    "playing": false
  },
  "collision": {
    "audio": new Audio("audio/collision.wav"),
    "playing": false
  },
  "crawl": {
    "audio": new Audio("audio/crawling-bugs.wav"),
    "playing": false
  },
  "gameTheme": {
    "audio": new Audio("audio/theme.wav"),
    "playing": false
  },
  "jingleLoose": {
    "audio": new Audio("audio/jingleLoose.wav"),
    "playing": false
  },
  "jingleWin": {
    "audio": new Audio("audio/jingleWin.wav"),
    "playing": false
  },
  "powerUp": {
    "audio": new Audio("audio/powerUp.wav"),
    "playing": false
  },
  "step": {
    "audio": new Audio("audio/step.wav"),
    "playing": false
  }
};
exports.GAME_SOUNDS = GAME_SOUNDS;

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ArcadeGame = void 0;

var _const = require("./const.mjs");

var _characters = require("./characters.mjs");

var _resources = require("./resources.mjs");

var _utils = require("./utils.mjs");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ArcadeGame =
/*#__PURE__*/
function () {
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
      this._assets = ["images/assets/stone-block.png", "images/assets/water-block.png", "images/assets/grass-block.png", "images/assets/enemy-bug.png", "images/assets/".concat(_const.CHARACTERS[this._selectedCharacter].assetPath)];
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
      var dt = (now - this._lastTime) / 1000.0; // update characters positions

      this._allEnemies.forEach(function (enemy) {
        enemy.update(dt);
      });

      if (this._player.positionUpdated()) {
        this._player.update();

        this.startAudio("step");
      } // check for collisions


      if (this._checkCollisions() && !this._player.animatingCollistion()) {
        this._player.onLadybirdTouch();

        this.stopAudio("collision");
        this.startAudio("collision");
      }

      this._checkAudio(); // check if the game is completed


      this._gameCompleted = this._player.hasReachedWater() || !this._player.alive(); // re-renderer on screen

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

      this._gameContainer.appendChild(this._canvas); // create characters


      this._allEnemies = _toConsumableArray(new Array(_const.ENEMIES[this._selectedLevel])).map(function () {
        return new _characters.Enemy();
      });
      this._player = new _characters.Player(this._selectedCharacter, this._lifeSpanBar); // load resources

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
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
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
        }); // if no bugs are on screen, pause audio


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
      var ctx = this._canvas.getContext('2d'); // add game background to canvas


      var rowImages = ['images/assets/water-block.png', // Top row is water
      'images/assets/stone-block.png', // Row 1 of 3 of stone
      'images/assets/stone-block.png', // Row 2 of 3 of stone
      'images/assets/stone-block.png', // Row 3 of 3 of stone
      'images/assets/grass-block.png', // Row 1 of 2 of grass
      'images/assets/grass-block.png' // Row 2 of 2 of grass
      ];
      var numRows = 6;
      var numCols = 5; // Before drawing, clear existing canvas

      ctx.clearRect(0, 0, this._canvas.width, this._canvas.height); // Loop through the number of rows and columns we've defined above
      // and, using the rowImages array, draw the correct image for that
      // portion of the "grid"

      for (var row = 0; row < numRows; row++) {
        for (var col = 0; col < numCols; col++) {
          ctx.drawImage(_resources.Resources.get(rowImages[row]), col * 101, row * 83);
        }
      } // renderer characters


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

},{"./characters.mjs":1,"./const.mjs":2,"./resources.mjs":5,"./utils.mjs":6}],4:[function(require,module,exports){
"use strict";

var _const = require("./const.mjs");

var _game = require("./game.mjs");

var checkGameFocusIntervalID = null,
    clockID = null,
    gameMatch = null;

var initialiseHomePage = function initialiseHomePage() {
  loadGameLevels();
  loadGameCharacters();
};

var loadGameLevels = function loadGameLevels() {
  for (var key in _const.GAME_LEVELS) {
    var value = _const.GAME_LEVELS[key];
    var frontFace = document.createElement("div");
    var backFace = document.createElement("div");
    var button = document.createElement("button");
    frontFace.classList.add("flip-face", "flip-face-front");
    backFace.classList.add("flip-face", "flip-face-back");
    button.classList.add("btn-level", "flip", "flip-vertical");
    frontFace.innerText = "x".concat(_const.ENEMIES[key]);
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
  for (var character in _const.CHARACTERS) {
    var assetPath = _const.CHARACTERS[character].assetPath;
    var characterObj = document.createElement("div");
    characterObj.style.backgroundImage = "url(\"images/assets/".concat(assetPath, "\")");
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
  if (!gameMatch.gameCompleted()) {
    return;
  }

  var gameResultSection = document.getElementById("gameResultSection");
  gameResultSection.classList.remove("hidden"); // to simulate a real dialog prevent page scrolling by hiding overflow

  document.querySelector("body").classList.add("full-screen"); // update dialog with game results

  gameResultSection.querySelector("#gameResultText").innerText = success ? "Level Completed!" : "You Lost ☹";
  gameResultSection.querySelector("#gameTotalTime").innerText = "Total time: ".concat(gameMatch.getElapsedTime()); // update stars rating

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
        star.querySelector(".star-inner").style.width = "".concat(starPerc, "%");
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
      if (!_iteratorNormalCompletion && _iterator["return"] != null) {
        _iterator["return"]();
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
  document.getElementById("gameResultSection").classList.add("hidden"); // re-enable overflow on page

  document.querySelector("body").classList.remove("full-screen");
  removeGameResultListeners();
};
/*
 * Update the level and start clock in the game page
 */


var updateGameInfos = function updateGameInfos() {
  clearInterval(clockID);
  clockID = setInterval(function () {
    document.getElementById("gameTimeElapsed").innerText = gameMatch.getElapsedTime();
  }, 1000);
  document.getElementById("gameLevelDescription").innerText = "Level ".concat(_const.GAME_LEVELS[gameMatch.getLevel()]);
};
/**
 * Make resume buttons available
 */


var enableResumeButtons = function enableResumeButtons() {
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
      if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
        _iterator2["return"]();
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
      if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
        _iterator3["return"]();
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
  var levelSelected = document.querySelector(".btn-level.selected").dataset.level;
  initialiseGame(levelSelected);
};
/*
 * Start a new game from the current game level
 */


var resetGame = function resetGame() {
  var level = gameMatch.getLevel();
  initialiseGame(level);
};
/*
 * Reset to a new game with higher level
 */


var levelUp = function levelUp() {
  var nextLevel = parseInt(gameMatch.getLevel(), 10) + 1;
  initialiseGame(nextLevel);
};
/*
 * Event callback method to select a level
 * @param event {Object}
 */


var selectLevel = function selectLevel(event) {
  if (event.target.classList.contains("btn-level")) {
    // remove selection from currently selected button
    var currentlySelectedButton = document.querySelector(".btn-level.selected");

    if (currentlySelectedButton) {
      currentlySelectedButton.classList.remove("selected");
    } // add selection to the button that has just been clicked


    event.target.classList.add("selected"); // eventually disable resume option

    checkResumeButton();
  }
};
/**
 * Add loading class to clicked button then show the game page
 *
 * @param {Object} event
 */


var loadGame = function loadGame(event) {
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
        if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
          _iterator4["return"]();
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
  document.getElementById("levelCharacter").addEventListener("click", selectCharacter);
  document.getElementById("levelOptions").addEventListener("click", selectLevel);
  document.querySelector(".btn-resume").addEventListener("click", loadGame);
};
/*
 * Stop listening to the interactions on the level and resume buttons.
 */


var removeHomeListeners = function removeHomeListeners() {
  document.getElementById("levelOptions").removeEventListener("click", selectLevel);
  document.querySelector(".btn-resume").removeEventListener("click", loadGame);
};
/*
 * Listen to a click event on each card in the grid in order to flip the card
 */


var addGameListeners = function addGameListeners() {
  checkGameFocusIntervalID = setInterval(checkGameFocus, 300);
};
/*
 * Stop listening to the interactions on the cards
 */


var removeGameListeners = function removeGameListeners() {
  clearInterval(checkGameFocusIntervalID);
  gameMatch.pauseAudio();
};
/*
 * Listen to a click even on the level up button
 */


var addGameResultListeners = function addGameResultListeners() {
  document.querySelector("#gameResultSection .dialog .btn-levelup").addEventListener("click", levelUp);
};
/*
 * Stop listening to the level up button click
 */


var removeGameResultListeners = function removeGameResultListeners() {
  document.querySelector("#gameResultSection .dialog .btn-levelup").removeEventListener("click", levelUp);
};
/*
 * Listen to a click event on all the buttons in the pages
 */


var addNavigationListeners = function addNavigationListeners() {
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
      if (!_iteratorNormalCompletion5 && _iterator5["return"] != null) {
        _iterator5["return"]();
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
    } // when an home button is clicked, show the home section

  } catch (err) {
    _didIteratorError6 = true;
    _iteratorError6 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion6 && _iterator6["return"] != null) {
        _iterator6["return"]();
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
      if (!_iteratorNormalCompletion7 && _iterator7["return"] != null) {
        _iterator7["return"]();
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
  settleAudioTracks();
  initialiseHomePage();
  addNavigationListeners();
  addHomeListeners();
});
window.addEventListener('scroll', function () {
  document.querySelector("#gameResultSection").style.top = "".concat(window.scrollY, "px");
});

},{"./const.mjs":2,"./game.mjs":3}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Resources = void 0;

/** Resources.js
 * This is simply an image loading utility. It eases the process of loading
 * image files so that they can be used within your game. It also includes
 * a simple "caching" layer so it will reuse cached images if you attempt
 * to load the same image multiple times.
 */
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


var Resources = {
  get: get,
  isReady: isReady,
  load: load,
  onReady: onReady
};
exports.Resources = Resources;

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatTimeToString = exports.getRandomInt = exports.getRandomNumber = void 0;

var getRandomNumber = function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
};

exports.getRandomNumber = getRandomNumber;

var getRandomInt = function getRandomInt(min, max) {
  return Math.floor(getRandomNumber(min, max));
};

exports.getRandomInt = getRandomInt;

var formatTimeToString = function formatTimeToString(ms) {
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
    formattedTimeParts.push("".concat(days, "d"));
  }

  if (hours || formattedTimeParts.length) {
    formattedTimeParts.push("".concat(hours, "h"));
  }

  if (minutes || formattedTimeParts.length) {
    formattedTimeParts.push("".concat(minutes, "m"));
  }

  if (seconds || formattedTimeParts.length) {
    formattedTimeParts.push("".concat(seconds, "s"));
  }

  return formattedTimeParts.join(" ");
};

exports.formatTimeToString = formatTimeToString;

},{}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9jaGFyYWN0ZXJzLm1qcyIsImpzL2NvbnN0Lm1qcyIsImpzL2dhbWUubWpzIiwianMvbWFpbi5qcyIsImpzL3Jlc291cmNlcy5tanMiLCJqcy91dGlscy5tanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7O0FDQUE7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBRU0sUzs7O0FBQ0YscUJBQVksTUFBWixFQUFvQixTQUFwQixFQUErQixTQUEvQixFQUEwQztBQUFBOztBQUN0QyxTQUFLLE1BQUwsR0FBYyxNQUFkO0FBQ0EsU0FBSyxFQUFMLEdBQVUsU0FBUyxJQUFJLENBQXZCO0FBQ0EsU0FBSyxFQUFMLEdBQVUsU0FBUyxJQUFJLENBQXZCO0FBQ0g7Ozs7NkJBRVMsQ0FDTjtBQUNIOzs7bUNBRWM7QUFDWCxhQUFPLEtBQUssRUFBWjtBQUNIOzs7bUNBRWM7QUFDWCxhQUFPLEtBQUssRUFBWjtBQUNIOzs7NkJBRVE7QUFDTCxVQUFJLEdBQUcsR0FBRyxRQUFRLENBQUMsY0FBVCxDQUF3QixZQUF4QixFQUFzQyxVQUF0QyxDQUFpRCxJQUFqRCxDQUFWO0FBRUEsTUFBQSxHQUFHLENBQUMsU0FBSixDQUFjLHFCQUFVLEdBQVYsQ0FBYyxLQUFLLE1BQW5CLENBQWQsRUFBMEMsS0FBSyxFQUEvQyxFQUFtRCxLQUFLLEVBQXhEO0FBQ0g7Ozs7S0FHTDs7O0lBQ00sSzs7Ozs7QUFDRixpQkFBWSxTQUFaLEVBQXVCLFNBQXZCLEVBQWtDO0FBQUE7O0FBQUEsOEVBRTFCLDZCQUYwQixFQUcxQixTQUFTLElBQUssQ0FBQyxHQUFELEdBQVEseUJBQWEsQ0FBYixFQUFnQixDQUFoQixJQUFxQixHQUhqQixFQUkxQixTQUFTLElBQUssQ0FBQyxFQUFELEdBQU8seUJBQWEsQ0FBYixFQUFnQixDQUFoQixJQUFxQixFQUpoQjtBQU1qQzs7OzsyQkFFTSxFLEVBQUk7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OiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiaW1wb3J0IHtBTExPV0VEX0tFWVMsIEJPVU5EQVJJRVMsIENIQVJBQ1RFUlMsIE1BWF9MSUZFU1BBTn0gZnJvbSBcIi4vY29uc3QubWpzXCI7XG5pbXBvcnQge1Jlc291cmNlc30gZnJvbSBcIi4vcmVzb3VyY2VzLm1qc1wiO1xuaW1wb3J0IHtnZXRSYW5kb21JbnR9IGZyb20gXCIuL3V0aWxzLm1qc1wiO1xuXG5jbGFzcyBDaGFyYWN0ZXIge1xuICAgIGNvbnN0cnVjdG9yKHNwcml0ZSwgcG9zaXRpb25YLCBwb3NpdGlvblkpIHtcbiAgICAgICAgdGhpcy5zcHJpdGUgPSBzcHJpdGU7XG4gICAgICAgIHRoaXMuX3ggPSBwb3NpdGlvblggfHwgMDtcbiAgICAgICAgdGhpcy5feSA9IHBvc2l0aW9uWSB8fCAwO1xuICAgIH1cblxuICAgIHVwZGF0ZSAoKSB7XG4gICAgICAgIC8vIG5vb3BcbiAgICB9XG5cbiAgICBnZXRQb3NpdGlvblgoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl94O1xuICAgIH1cblxuICAgIGdldFBvc2l0aW9uWSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3k7XG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICBsZXQgY3R4ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dhbWVDYW52YXMnKS5nZXRDb250ZXh0KCcyZCcpO1xuXG4gICAgICAgIGN0eC5kcmF3SW1hZ2UoUmVzb3VyY2VzLmdldCh0aGlzLnNwcml0ZSksIHRoaXMuX3gsIHRoaXMuX3kpO1xuICAgIH1cbn1cblxuLy8gRW5lbWllcyBvdXIgcGxheWVyIG11c3QgYXZvaWRcbmNsYXNzIEVuZW15IGV4dGVuZHMgQ2hhcmFjdGVyIHtcbiAgICBjb25zdHJ1Y3Rvcihwb3NpdGlvblgsIHBvc2l0aW9uWSkge1xuICAgICAgICBzdXBlcihcbiAgICAgICAgICAgICdpbWFnZXMvYXNzZXRzL2VuZW15LWJ1Zy5wbmcnLFxuICAgICAgICAgICAgcG9zaXRpb25YIHx8ICgtMTAwICsgKGdldFJhbmRvbUludCgxLCA2KSAqIDEwMCkpLFxuICAgICAgICAgICAgcG9zaXRpb25ZIHx8ICgtMjAgKyAoZ2V0UmFuZG9tSW50KDEsIDQpICogODApKVxuICAgICAgICApO1xuICAgIH1cblxuICAgIHVwZGF0ZShkdCkge1xuICAgICAgICBpZiAodGhpcy5feCA+PSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdhbWVDYW52YXNcIikud2lkdGgpIHtcbiAgICAgICAgICAgIHRoaXMuX3ggPSAtMTAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5feCArPSBNYXRoLnJhbmRvbSgpICogZHQgKiAxMDA7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvblNjcmVlbigpIHtcbiAgICAgICAgcmV0dXJuICh0aGlzLl94ID4gMCkgJiYgKHRoaXMuX3kgPCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdhbWVDYW52YXNcIikud2lkdGgpO1xuICAgIH1cbn1cblxuLy8gTm93IHdyaXRlIHlvdXIgb3duIHBsYXllciBjbGFzc1xuLy8gVGhpcyBjbGFzcyByZXF1aXJlcyBhbiB1cGRhdGUoKSwgcmVuZGVyKCkgYW5kXG4vLyBhIGhhbmRsZUlucHV0KCkgbWV0aG9kLlxuY2xhc3MgUGxheWVyIGV4dGVuZHMgQ2hhcmFjdGVyIHtcbiAgICBjb25zdHJ1Y3RvcihjaGFyYWN0ZXIsIGxpZmVTcGFuQmFyKSB7XG4gICAgICAgIHN1cGVyKFxuICAgICAgICAgICAgYGltYWdlcy9hc3NldHMvJHtDSEFSQUNURVJTW2NoYXJhY3Rlcl0uYXNzZXRQYXRofWAsXG4gICAgICAgICAgICBCT1VOREFSSUVTLmxlZnQsXG4gICAgICAgICAgICBCT1VOREFSSUVTLmRvd25cbiAgICAgICAgKTtcblxuICAgICAgICB0aGlzLl9uYW1lID0gQ0hBUkFDVEVSU1tjaGFyYWN0ZXJdLm5hbWU7XG4gICAgICAgIHRoaXMuX2xpZmVTcGFuID0gTUFYX0xJRkVTUEFOO1xuICAgICAgICB0aGlzLl9saWZlU3BhbkJhciA9IGxpZmVTcGFuQmFyO1xuICAgICAgICB0aGlzLl9hbmltYXRpbmdDb2xsaXNpb24gPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fd2F0ZXJSZWFjaGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX3Bvc2l0aW9uVXBkYXRlZCA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMuX21ldGhvZHMgPSB7XG4gICAgICAgICAgICBcIm9uQ2xpY2tcIjogdGhpcy5fb25DbGljay5iaW5kKHRoaXMpLFxuICAgICAgICAgICAgXCJvbktleVByZXNzZWRcIjogdGhpcy5fb25LZXlQcmVzc2VkLmJpbmQodGhpcylcbiAgICAgICAgfVxuXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCB0aGlzLl9tZXRob2RzLm9uS2V5UHJlc3NlZCk7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2FtZUNhbnZhc1wiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdGhpcy5fbWV0aG9kcy5vbkNsaWNrKTtcbiAgICB9XG5cbiAgICB1cGRhdGUoKSB7XG4gICAgICAgIHRoaXMuX3Bvc2l0aW9uVXBkYXRlZCA9IGZhbHNlO1xuICAgIH1cblxuICAgIHBvc2l0aW9uVXBkYXRlZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Bvc2l0aW9uVXBkYXRlZDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBXaGVuZXZlciB0aGUgcGxheWVyIGlzIHRvdWNoaW5nIGEgbGFkeSBiaXJkIHBsYXkgYSBzaGFrZSBhbmltYXRpb25cbiAgICAgKiBvbiB0aGUgcGxheWVyLlxuICAgICAqL1xuICAgIG9uTGFkeWJpcmRUb3VjaCgpIHtcbiAgICAgICAgbGV0IGxlZnQgPSBmYWxzZTtcbiAgICAgICAgbGV0IHJlcGVhdCA9IDg7XG4gICAgICAgIGxldCBhbmltYXRpb24gPSBudWxsO1xuICAgICAgICBsZXQgc2hha2UgPSAoKSA9PiB7XG4gICAgICAgICAgICBpZiAobGVmdCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3ggLT0gNTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5feCArPSA1O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZWZ0ID0gIWxlZnQ7XG4gICAgICAgICAgICByZXBlYXQtLTtcblxuICAgICAgICAgICAgaWYgKHJlcGVhdCkge1xuICAgICAgICAgICAgICAgIGFuaW1hdGlvbiA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoc2hha2UpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUoYW5pbWF0aW9uKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuX3ggPSBCT1VOREFSSUVTLmxlZnQ7XG4gICAgICAgICAgICAgICAgdGhpcy5feSA9IEJPVU5EQVJJRVMuZG93bjtcblxuICAgICAgICAgICAgICAgIHRoaXMuX2FuaW1hdGluZ0NvbGxpc2lvbiA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZUxpZmVTcGFuKC0xKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHNoYWtlKTtcbiAgICAgICAgdGhpcy5fYW5pbWF0aW5nQ29sbGlzaW9uID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBoYXNSZWFjaGVkV2F0ZXIoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl93YXRlclJlYWNoZWQ7XG4gICAgfVxuXG4gICAgZ2V0TmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX25hbWU7XG4gICAgfVxuXG4gICAgZ2V0TGlmZXNwYW4oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9saWZlU3BhbjtcbiAgICB9XG5cbiAgICBhbmltYXRpbmdDb2xsaXN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYW5pbWF0aW5nQ29sbGlzaW9uO1xuICAgIH1cblxuICAgIGFsaXZlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbGlmZVNwYW4gPiAwO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE1ha2UgYSBtb3ZlIGJhc2VkIG9uIHRoZSBrZXkgcHJlc3NlZFxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfb25LZXlQcmVzc2VkKGV2ZW50KSB7XG4gICAgICAgIHRoaXMuX2hhbmRsZUlucHV0KEFMTE9XRURfS0VZU1tldmVudC5rZXlDb2RlXSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTWFrZSBhIG1vdmUgYmFzZWQgb24gdGhlIGNsaWNrIGNvb3JkaW5hdGVzXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9vbkNsaWNrKGV2ZW50KSB7XG4gICAgICAgIGxldCBtb3ZlID0gbnVsbDtcblxuICAgICAgICBpZiAoZXZlbnQub2Zmc2V0WCAtIDUwID49IHRoaXMuX3ggKyA2MCkge1xuICAgICAgICAgICAgbW92ZSA9IFwicmlnaHRcIjtcbiAgICAgICAgfSBlbHNlXG4gICAgICAgIGlmIChldmVudC5vZmZzZXRYIC0gNTAgPD0gdGhpcy5feCAtIDYwKSB7XG4gICAgICAgICAgICBtb3ZlID0gXCJsZWZ0XCI7XG4gICAgICAgIH0gZWxzZVxuICAgICAgICBpZiAoZXZlbnQub2Zmc2V0WS0xMDAgPj0gdGhpcy5feSkge1xuICAgICAgICAgICAgbW92ZSA9IFwiZG93blwiO1xuICAgICAgICB9IGVsc2VcbiAgICAgICAgaWYgKGV2ZW50Lm9mZnNldFktMTAwIDw9IHRoaXMuX3kpIHtcbiAgICAgICAgICAgIG1vdmUgPSBcInVwXCI7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9oYW5kbGVJbnB1dChtb3ZlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBVcGRhdGUgdGhlIHBsYXllciBwb3NpdGlvbiBiYXNlZCBvbiB0aGUga2V5IHByZXNzZWRcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBtb3ZlIDxsZWZ0IHwgcmlnaHQgfCB1cCB8IGRvd24+XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfaGFuZGxlSW5wdXQobW92ZSkge1xuICAgICAgICBpZiAoIXRoaXMuX2FuaW1hdGluZykge1xuICAgICAgICAgICAgaWYgKE9iamVjdC5rZXlzKEJPVU5EQVJJRVMpLmluY2x1ZGVzKG1vdmUpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcG9zaXRpb25VcGRhdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN3aXRjaCAobW92ZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgXCJsZWZ0XCI6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3ggLT0gMTAwO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5feCA8IEJPVU5EQVJJRVMubGVmdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5feCA9IEJPVU5EQVJJRVMubGVmdDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3Bvc2l0aW9uVXBkYXRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJ1cFwiOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLl95IC09IDgwO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5feSA8IEJPVU5EQVJJRVMudXApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3dhdGVyUmVhY2hlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgdGhpcy5fbWV0aG9kcy5vbktleVByZXNzZWQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJyaWdodFwiOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLl94ICs9IDEwMDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX3ggPiBCT1VOREFSSUVTLnJpZ2h0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl94ID0gQk9VTkRBUklFUy5yaWdodDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3Bvc2l0aW9uVXBkYXRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJkb3duXCI6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3kgKz0gODA7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl95ID4gQk9VTkRBUklFUy5kb3duKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl95ID0gQk9VTkRBUklFUy5kb3duO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fcG9zaXRpb25VcGRhdGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfdXBkYXRlTGlmZVNwYW4oZGVsdGEpIHtcbiAgICAgICAgdGhpcy5fbGlmZVNwYW4gKz0gZGVsdGE7XG5cbiAgICAgICAgbGV0IGxpZmVTcGFuUGVyYyA9IDEwMCAqIHRoaXMuX2xpZmVTcGFuIC8gTUFYX0xJRkVTUEFOO1xuXG4gICAgICAgIGlmIChsaWZlU3BhblBlcmMgPiAxMDApIHtcbiAgICAgICAgICAgIGxpZmVTcGFuUGVyYyA9IDEwMDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2xpZmVTcGFuQmFyLnF1ZXJ5U2VsZWN0b3IoXCIucHJvZ3Jlc3MtYmFyLWlubmVyXCIpLnN0eWxlLndpZHRoID0gYCR7bGlmZVNwYW5QZXJjfSVgO1xuICAgIH1cbn1cblxuZXhwb3J0IHtFbmVteSwgUGxheWVyfTtcbiIsImNvbnN0IE1BWF9TVEFSUyA9IDU7XG5cbmNvbnN0IE1BWF9MSUZFU1BBTiA9IDEwO1xuXG5jb25zdCBHQU1FX0xFVkVMUyA9IHtcblx0XCIwXCI6IFwiRWFzeVwiLFxuXHRcIjFcIjogXCJDbGFzc2ljXCIsXG5cdFwiMlwiOiBcIkFkdmVudHVyZVwiXG59O1xuXG5jb25zdCBBTExPV0VEX0tFWVMgPSB7XG4gICAgXCIzN1wiOiBcImxlZnRcIixcbiAgICBcIjM4XCI6IFwidXBcIixcbiAgICBcIjM5XCI6IFwicmlnaHRcIixcbiAgICBcIjQwXCI6IFwiZG93blwiXG59XG5cbmNvbnN0IEJPVU5EQVJJRVMgPSB7XG5cdFwiZG93blwiOiAzODAsXG5cdFwibGVmdFwiOiAwLFxuICAgIFwicmlnaHRcIjogNDAwLFxuICAgIFwidXBcIjogNjBcbn1cblxuY29uc3QgRU5FTUlFUyA9IHtcbiAgICBcIjBcIjogMyxcbiAgICBcIjFcIjogNSxcbiAgICBcIjJcIjogN1xufVxuXG5jb25zdCBDSEFSQUNURVJTID0ge1xuICAgIFwiYm95XCI6IHtcbiAgICAgICAgXCJhc3NldFBhdGhcIjogXCJjaGFyLWJveS5wbmdcIixcbiAgICAgICAgXCJuYW1lXCI6IFwiQnVnZ3kgQm95XCJcbiAgICB9LFxuICAgIFwiY2F0R2lybFwiOiB7XG4gICAgICAgIFwiYXNzZXRQYXRoXCI6IFwiY2hhci1jYXQtZ2lybC5wbmdcIixcbiAgICAgICAgXCJuYW1lXCI6IFwiQ2F0IEdpcmxcIlxuICAgIH0sXG4gICAgXCJob3JuR2lybFwiOiB7XG4gICAgICAgIFwiYXNzZXRQYXRoXCI6IFwiY2hhci1ob3JuLWdpcmwucG5nXCIsXG4gICAgICAgIFwibmFtZVwiOiBcIlNwaWt5XCJcbiAgICB9LFxuICAgIFwicGlua0dpcmxcIjoge1xuICAgICAgICBcImFzc2V0UGF0aFwiOiBcImNoYXItcGluay1naXJsLnBuZ1wiLFxuICAgICAgICBcIm5hbWVcIjogXCJQaW5reVwiXG4gICAgfSxcbiAgICBcInByaW5jZXNzR2lybFwiOiB7XG4gICAgICAgIFwiYXNzZXRQYXRoXCI6IFwiY2hhci1wcmluY2Vzcy1naXJsLnBuZ1wiLFxuICAgICAgICBcIm5hbWVcIjogXCJQcmluY2Vzc1wiXG4gICAgfVxufVxuXG5jb25zdCBHQU1FX1NPVU5EUyA9IHtcblx0XCJhd2FyZFwiOiB7XG5cdFx0XCJhdWRpb1wiOiBuZXcgQXVkaW8oXCJhdWRpby9hd2FyZC53YXZcIiksXG5cdFx0XCJwbGF5aW5nXCI6IGZhbHNlXG5cdH0sXG5cdFwiY29sbGlzaW9uXCI6IHtcblx0XHRcImF1ZGlvXCI6IG5ldyBBdWRpbyhcImF1ZGlvL2NvbGxpc2lvbi53YXZcIiksXG5cdFx0XCJwbGF5aW5nXCI6IGZhbHNlXG5cdH0sXG5cdFwiY3Jhd2xcIjoge1xuXHRcdFwiYXVkaW9cIjogbmV3IEF1ZGlvKFwiYXVkaW8vY3Jhd2xpbmctYnVncy53YXZcIiksXG5cdFx0XCJwbGF5aW5nXCI6IGZhbHNlXG5cdH0sXG5cdFwiZ2FtZVRoZW1lXCI6IHtcblx0XHRcImF1ZGlvXCI6IG5ldyBBdWRpbyhcImF1ZGlvL3RoZW1lLndhdlwiKSxcblx0XHRcInBsYXlpbmdcIjogZmFsc2Vcblx0fSxcblx0XCJqaW5nbGVMb29zZVwiOiB7XG5cdFx0XCJhdWRpb1wiOiBuZXcgQXVkaW8oXCJhdWRpby9qaW5nbGVMb29zZS53YXZcIiksXG5cdFx0XCJwbGF5aW5nXCI6IGZhbHNlXG5cdH0sXG5cdFwiamluZ2xlV2luXCI6IHtcblx0XHRcImF1ZGlvXCI6IG5ldyBBdWRpbyhcImF1ZGlvL2ppbmdsZVdpbi53YXZcIiksXG5cdFx0XCJwbGF5aW5nXCI6IGZhbHNlXG5cdH0sXG5cdFwicG93ZXJVcFwiOiB7XG5cdFx0XCJhdWRpb1wiOiBuZXcgQXVkaW8oXCJhdWRpby9wb3dlclVwLndhdlwiKSxcblx0XHRcInBsYXlpbmdcIjogZmFsc2Vcblx0fSxcblx0XCJzdGVwXCI6IHtcblx0XHRcImF1ZGlvXCI6IG5ldyBBdWRpbyhcImF1ZGlvL3N0ZXAud2F2XCIpLFxuXHRcdFwicGxheWluZ1wiOiBmYWxzZVxuXHR9XG59O1xuXG5leHBvcnQge01BWF9TVEFSUywgTUFYX0xJRkVTUEFOLCBHQU1FX0xFVkVMUywgQUxMT1dFRF9LRVlTLCBCT1VOREFSSUVTLCBFTkVNSUVTLCBDSEFSQUNURVJTLCBHQU1FX1NPVU5EU307XG4iLCJpbXBvcnQge0NIQVJBQ1RFUlMsIEVORU1JRVMsIEdBTUVfU09VTkRTLCBNQVhfTElGRVNQQU59IGZyb20gXCIuL2NvbnN0Lm1qc1wiO1xuaW1wb3J0IHtFbmVteSwgUGxheWVyfSBmcm9tIFwiLi9jaGFyYWN0ZXJzLm1qc1wiO1xuaW1wb3J0IHtSZXNvdXJjZXN9IGZyb20gXCIuL3Jlc291cmNlcy5tanNcIjtcbmltcG9ydCB7Zm9ybWF0VGltZVRvU3RyaW5nfSBmcm9tIFwiLi91dGlscy5tanNcIjtcblxuY2xhc3MgQXJjYWRlR2FtZSB7XG4gICAgY29uc3RydWN0b3Iob25MZXZlbENvbXBsZXRlZCkge1xuICAgICAgICB0aGlzLl9vbkxldmVsQ29tcGxldGVkQ2FsbGJhY2sgPSBvbkxldmVsQ29tcGxldGVkO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEluaXRpYWxpc2UgZ2FtZSBieSBsb2FkaW5nIHRoZSBnYW1lIGFzc2V0cyxcbiAgICAgKiBjcmVhdGluZyB0aGUgZ2FtZSBjYW52YXMsIHBsYXllciBhbmQgZW5lbWllc1xuICAgICAqIGFuZCBzdGFydGluZyB0aGUgcmVuZGVyZXJpbmcgbG9vcFxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBpbml0aWFsaXNlKGxldmVsLCBwbGF5ZXJDaGFyYWN0ZXIpIHtcbiAgICAgICAgdGhpcy5fZ2FtZUNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjZ2FtZUNvbnRhaW5lclwiKTtcbiAgICAgICAgdGhpcy5fc3RhcnRUaW1lID0gbmV3IERhdGUoKTtcbiAgICAgICAgdGhpcy5fc3RvcFRpbWUgPSBudWxsO1xuICAgICAgICB0aGlzLl9sYXN0VGltZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgIHRoaXMuX3NlbGVjdGVkTGV2ZWwgPSBsZXZlbDtcbiAgICAgICAgdGhpcy5fc2VsZWN0ZWRDaGFyYWN0ZXIgPSBwbGF5ZXJDaGFyYWN0ZXI7XG4gICAgICAgIHRoaXMuX2Fzc2V0c1JlYWR5ID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX2Fzc2V0cyA9IFtcbiAgICAgICAgICAgIFwiaW1hZ2VzL2Fzc2V0cy9zdG9uZS1ibG9jay5wbmdcIixcbiAgICAgICAgICAgIFwiaW1hZ2VzL2Fzc2V0cy93YXRlci1ibG9jay5wbmdcIixcbiAgICAgICAgICAgIFwiaW1hZ2VzL2Fzc2V0cy9ncmFzcy1ibG9jay5wbmdcIixcbiAgICAgICAgICAgIFwiaW1hZ2VzL2Fzc2V0cy9lbmVteS1idWcucG5nXCIsXG4gICAgICAgICAgICBgaW1hZ2VzL2Fzc2V0cy8ke0NIQVJBQ1RFUlNbdGhpcy5fc2VsZWN0ZWRDaGFyYWN0ZXJdLmFzc2V0UGF0aH1gXG4gICAgICAgIF07XG4gICAgICAgIHRoaXMuX2dhbWVDb21wbGV0ZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fcmVxdWVzdEZyYW1lSUQgPSBudWxsO1xuICAgICAgICB0aGlzLl9jcmF3bEF1ZGlvUGxheWluZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9hdWRpb1BhdXNlZCA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMuX2NyZWF0ZUxpZmVTcGFuQmFyKCk7XG4gICAgICAgIHRoaXMuX2luaXRpYWxpc2VHYW1lQ29udGFpbmVyKCk7XG5cbiAgICAgICAgdGhpcy5zdGFydEF1ZGlvKFwiZ2FtZVRoZW1lXCIpO1xuICAgIH1cblxuICAgIC8qKlxuXHQqIFJldHVybnMgdGhlIGxldmVsIG9mIHRoZSBnYW1lXG5cdCpcblx0KiBAcmV0dXJucyB7TnVtYmVyfSAoZm9yIGEgbGlzdCBvZiBhdmFpbGFibGUgbGV2ZWxzIHNlZSBHQU1FX0xFVkVMUyBjb25zdClcblx0Ki9cblx0Z2V0TGV2ZWwoKSB7XG5cdFx0cmV0dXJuIHRoaXMuX3NlbGVjdGVkTGV2ZWw7XG5cdH1cblxuXHQvKipcblx0KiBNZXRob2QgdG8gZ2V0IHRoZSB0aW1lIHBhc3NlZCBmcm9tIHRoZSBzdGFydCBvZiB0aGUgZ2FtZS5cblx0KiBJZiB0aGUgZ2FtZSBpcyBjb21wbGV0ZWQgd2lsbCBhbHdheXMgcmV0dXJuIHRoZSB0b3RhbCB0aW1lIG9mIHRoZSBnYW1lLlxuXHQqIE5PVEU6IHRoaXMgbWV0aG9kIHJldHVybnMgYSBuaWNlbHkgZm9ybWF0dGVkIHN0cmluZyBhcyBcIihkZDo6KWhoOm1tOnNzXCJcblx0KlxuXHQqIEByZXR1cm5zIHtTdHJpbmd9XG5cdCovXG5cdGdldEVsYXBzZWRUaW1lKCkge1xuXHRcdGxldCBlbmRUaW1lID0gdGhpcy5fc3RvcFRpbWUgPyB0aGlzLl9zdG9wVGltZSA6IG5ldyBEYXRlKCk7XG5cdFx0bGV0IG1zRWxhcHNlZCA9IGVuZFRpbWUgLSB0aGlzLl9zdGFydFRpbWU7XG5cdFx0bGV0IGZvcm1hdHRlZEVsYXBzZWRUaW1lID0gZm9ybWF0VGltZVRvU3RyaW5nKG1zRWxhcHNlZCk7XG5cblx0XHRyZXR1cm4gZm9ybWF0dGVkRWxhcHNlZFRpbWU7XG5cdH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrIGlmIHRoZSBnYW1lIGhhcyBiZWVuIGNvbXBsZXRlZFxuICAgICAqXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgKi9cbiAgICBnYW1lQ29tcGxldGVkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZ2FtZUNvbXBsZXRlZDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIHN0YXIgcmF0aW5nLlxuICAgICAqIFN0YXIgUmF0aW5nIGlzIGNvbXB1dGVkIGJ5IGNoZWNraW5nIHRoZSByYXRpbyBiZXR3ZWVuIHRoZSBsaWZlc3BhblxuICAgICAqIGFuZCB0aGUgdGltZSBlbGFwc2VkLlxuICAgICAqXG4gICAgICogQHJldHVybiB7TnVtYmVyfVxuICAgICAqL1xuICAgIGdldFN0YXJSYXRpbmcoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wbGF5ZXIuZ2V0TGlmZXNwYW4oKSAqIDEwMCAvIE1BWF9MSUZFU1BBTjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDbGVhciBjYW52YXMsIHJlbW92ZSBpdCBmcm9tIHRoZSBET00gYW5kIHJlc2V0IGFsbCBnYW1lIGF0dHJpYnV0ZXNcbiAgICAgKi9cbiAgICBkZXN0cm95KCkge1xuICAgICAgICBsZXQgY3R4ID0gdGhpcy5fY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cbiAgICAgICAgY3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLl9jYW52YXMud2lkdGgsIHRoaXMuX2NhbnZhcy5oZWlnaHQpO1xuXG4gICAgICAgIHRoaXMuX2dhbWVDb250YWluZXIuaW5uZXJIVE1MID0gXCJcIjtcblxuICAgICAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy5fcmVxdWVzdEZyYW1lSUQpO1xuXG4gICAgICAgIHRoaXMuX2FsbEVuZW1pZXMgPSBbXTtcbiAgICAgICAgdGhpcy5fcGxheWVyID0gW107XG4gICAgICAgIHRoaXMuX2dhbWVDb21wbGV0ZWQgPSB0cnVlO1xuXG4gICAgICAgIHRoaXMuc3RvcEF1ZGlvKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVXBkYXRlcyBlbmVtaWVzIGFuZCBwbGF5ZXIgcG9zaXRpb24sXG4gICAgICogY2hlY2tzIGlmIHBsYXllciB0b3VjaGVkIGEgbGFkeWJpcmQgKGNoZWNrQ29sbGlzaW9ucyksXG4gICAgICogY2hlY2tzIGlmIHRoZSBwbGF5ZXIgaGFzIHJlYWNoZWQgdGhlIHdhdGVyIChnYW1lQ29tcGxldGVkKS5cbiAgICAgKiBSZWN1cnNpdmUgbWV0aG9kIG9uIG5leHQgZnJhbWUuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHVwZGF0ZSgpIHtcbiAgICAgICAgbGV0IG5vdyA9IERhdGUubm93KCk7XG4gICAgICAgIGxldCBkdCA9IChub3cgLSB0aGlzLl9sYXN0VGltZSkgLyAxMDAwLjA7XG5cbiAgICAgICAgLy8gdXBkYXRlIGNoYXJhY3RlcnMgcG9zaXRpb25zXG4gICAgICAgIHRoaXMuX2FsbEVuZW1pZXMuZm9yRWFjaChmdW5jdGlvbihlbmVteSkge1xuICAgICAgICAgICAgZW5lbXkudXBkYXRlKGR0KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHRoaXMuX3BsYXllci5wb3NpdGlvblVwZGF0ZWQoKSkge1xuICAgICAgICAgICAgdGhpcy5fcGxheWVyLnVwZGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5zdGFydEF1ZGlvKFwic3RlcFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGNoZWNrIGZvciBjb2xsaXNpb25zXG4gICAgICAgIGlmICh0aGlzLl9jaGVja0NvbGxpc2lvbnMoKSAmJiAhdGhpcy5fcGxheWVyLmFuaW1hdGluZ0NvbGxpc3Rpb24oKSkge1xuICAgICAgICAgICAgdGhpcy5fcGxheWVyLm9uTGFkeWJpcmRUb3VjaCgpO1xuICAgICAgICAgICAgdGhpcy5zdG9wQXVkaW8oXCJjb2xsaXNpb25cIik7XG4gICAgICAgICAgICB0aGlzLnN0YXJ0QXVkaW8oXCJjb2xsaXNpb25cIik7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9jaGVja0F1ZGlvKCk7XG5cbiAgICAgICAgLy8gY2hlY2sgaWYgdGhlIGdhbWUgaXMgY29tcGxldGVkXG4gICAgICAgIHRoaXMuX2dhbWVDb21wbGV0ZWQgPSB0aGlzLl9wbGF5ZXIuaGFzUmVhY2hlZFdhdGVyKCkgfHwgIXRoaXMuX3BsYXllci5hbGl2ZSgpO1xuXG4gICAgICAgIC8vIHJlLXJlbmRlcmVyIG9uIHNjcmVlblxuICAgICAgICB0aGlzLl9yZW5kZXIoKTtcblxuICAgICAgICB0aGlzLl9sYXN0VGltZSA9IG5vdztcblxuICAgICAgICBpZiAodGhpcy5fZ2FtZUNvbXBsZXRlZCkge1xuICAgICAgICAgICAgc2V0VGltZW91dCh0aGlzLl9vbkxldmVsQ29tcGxldGVkLmJpbmQodGhpcyksIDEwMCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9yZXF1ZXN0RnJhbWVJRCA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy51cGRhdGUuYmluZCh0aGlzKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQYXVzZSBhbGwgYXVkaW9cbiAgICAgKlxuICAgICAqIEBwYXJhbSB0cmFja05hbWUge1N0cmluZ31cbiAgICAgKi9cbiAgICBwYXVzZUF1ZGlvKHRyYWNrTmFtZSkge1xuICAgICAgICBpZiAodHJhY2tOYW1lKSB7XG4gICAgICAgICAgICBHQU1FX1NPVU5EU1t0cmFja05hbWVdLmF1ZGlvLnBhdXNlKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmb3IgKGxldCBzb3VuZCBpbiBHQU1FX1NPVU5EUykge1xuICAgICAgICAgICAgICAgIEdBTUVfU09VTkRTW3NvdW5kXS5hdWRpby5wYXVzZSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9hdWRpb1BhdXNlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTdGFydCBhdWRpbyBpbiBwbGF5aW5nIHN0YXR1c1xuICAgICAqXG4gICAgICogQHBhcmFtIHRyYWNrTmFtZSB7U3RyaW5nfVxuICAgICAqIEBwYXJhbSBmb3JjZSB7Qm9vbGVhbn0gcGxheSB0cmFjayBldmVuIGlmIHN0YXRlIGlzIG5vdCBjdXJyZW50bHkgcGxheWluZ1xuICAgICAqL1xuICAgIHN0YXJ0QXVkaW8odHJhY2tOYW1lLCBmb3JjZT10cnVlKSB7XG4gICAgICAgIGlmICh0eXBlb2YgdHJhY2tOYW1lID09PSBcImJvb2xlYW5cIikge1xuICAgICAgICAgICAgZm9yY2UgPSB0cmFja05hbWU7XG4gICAgICAgICAgICB0cmFja05hbWUgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRyYWNrTmFtZSkge1xuICAgICAgICAgICAgaWYgKGZvcmNlIHx8IEdBTUVfU09VTkRTW3RyYWNrTmFtZV0ucGxheWluZykge1xuICAgICAgICAgICAgICAgIEdBTUVfU09VTkRTW3RyYWNrTmFtZV0uYXVkaW8ucGxheSgpO1xuICAgICAgICAgICAgICAgIEdBTUVfU09VTkRTW3RyYWNrTmFtZV0ucGxheWluZyA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmb3IgKGxldCBzb3VuZCBpbiBHQU1FX1NPVU5EUykge1xuICAgICAgICAgICAgICAgIGlmIChmb3JjZSB8fCBHQU1FX1NPVU5EU1tzb3VuZF0ucGxheWluZykge1xuICAgICAgICAgICAgICAgICAgICBHQU1FX1NPVU5EU1tzb3VuZF0uYXVkaW8ucGxheSgpO1xuICAgICAgICAgICAgICAgICAgICBHQU1FX1NPVU5EU1tzb3VuZF0ucGxheWluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9hdWRpb1BhdXNlZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU3RvcCBhbGwgYXVkaW8gb3IgYSBzcGVjaWZpYyB0cmFja1xuICAgICAqXG4gICAgICogQHBhcmFtIHRyYWNrTmFtZSB7U3RyaW5nfVxuICAgICAqL1xuICAgIHN0b3BBdWRpbyh0cmFja05hbWUpIHtcbiAgICAgICAgaWYgKHRyYWNrTmFtZSkge1xuICAgICAgICAgICAgR0FNRV9TT1VORFNbdHJhY2tOYW1lXS5hdWRpby5wYXVzZSgpO1xuICAgICAgICAgICAgR0FNRV9TT1VORFNbdHJhY2tOYW1lXS5hdWRpby5sb2FkKCk7XG4gICAgICAgICAgICBHQU1FX1NPVU5EU1t0cmFja05hbWVdLnBsYXlpbmcgPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZvciAobGV0IHNvdW5kIGluIEdBTUVfU09VTkRTKSB7XG4gICAgICAgICAgICAgICAgR0FNRV9TT1VORFNbc291bmRdLmF1ZGlvLnBhdXNlKCk7XG4gICAgICAgICAgICAgICAgR0FNRV9TT1VORFNbc291bmRdLmF1ZGlvLmxvYWQoKTtcbiAgICAgICAgICAgICAgICBHQU1FX1NPVU5EU1tzb3VuZF0ucGxheWluZyA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU3VwcG9ydCBtZXRob2QgdG8gY3JlYXRlIHRoZSBsaWZlc3BhbiBiYXIgZm9yIHRoZSBwbGF5ZXIuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9jcmVhdGVMaWZlU3BhbkJhcigpIHtcbiAgICAgICAgbGV0IHByb2dyZXNzQmFyT3V0ZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBsZXQgcHJvZ3Jlc3NCYXJJbm5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cbiAgICAgICAgdGhpcy5fbGlmZVNwYW5CYXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXG4gICAgICAgIHByb2dyZXNzQmFyT3V0ZXIuY2xhc3NMaXN0LmFkZChcInByb2dyZXNzLWJhci1vdXRlclwiKTtcbiAgICAgICAgcHJvZ3Jlc3NCYXJJbm5lci5jbGFzc0xpc3QuYWRkKFwicHJvZ3Jlc3MtYmFyLWlubmVyXCIpO1xuICAgICAgICB0aGlzLl9saWZlU3BhbkJhci5jbGFzc0xpc3QuYWRkKFwicHJvZ3Jlc3MtYmFyXCIpO1xuICAgICAgICB0aGlzLl9saWZlU3BhbkJhci5pZCA9IFwibGlmZVNwYW5CYXJcIjtcblxuICAgICAgICBwcm9ncmVzc0Jhck91dGVyLmFwcGVuZENoaWxkKHByb2dyZXNzQmFySW5uZXIpO1xuICAgICAgICB0aGlzLl9saWZlU3BhbkJhci5hcHBlbmRDaGlsZChwcm9ncmVzc0Jhck91dGVyKTtcbiAgICAgICAgdGhpcy5fZ2FtZUNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLl9saWZlU3BhbkJhcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU3VwcG9ydCBtZXRob2QgdG8gY3JlYXRlIHRoZSBnYW1lIGNhbnZhcywgY2hhcmFjdGVycyBhbmQgbG9hZCB0aGUgYXNzZXRzXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9pbml0aWFsaXNlR2FtZUNvbnRhaW5lcigpIHtcbiAgICAgICAgLy8gY3JlYXRlIGdhbWUgY2FudmFzXG4gICAgICAgIHRoaXMuX2NhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgICAgICB0aGlzLl9jYW52YXMud2lkdGggPSA1MDU7XG4gICAgICAgIHRoaXMuX2NhbnZhcy5oZWlnaHQgPSA1ODY7XG4gICAgICAgIHRoaXMuX2NhbnZhcy5pZCA9IFwiZ2FtZUNhbnZhc1wiO1xuICAgICAgICB0aGlzLl9nYW1lQ29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuX2NhbnZhcyk7XG5cbiAgICAgICAgLy8gY3JlYXRlIGNoYXJhY3RlcnNcbiAgICAgICAgdGhpcy5fYWxsRW5lbWllcyA9IFsuLi5uZXcgQXJyYXkoRU5FTUlFU1t0aGlzLl9zZWxlY3RlZExldmVsXSldLm1hcCgoKSA9PiBuZXcgRW5lbXkoKSk7XG4gICAgICAgIHRoaXMuX3BsYXllciA9IG5ldyBQbGF5ZXIodGhpcy5fc2VsZWN0ZWRDaGFyYWN0ZXIsIHRoaXMuX2xpZmVTcGFuQmFyKTtcblxuICAgICAgICAvLyBsb2FkIHJlc291cmNlc1xuICAgICAgICBSZXNvdXJjZXMubG9hZCh0aGlzLl9hc3NldHMpO1xuXG4gICAgICAgIGlmIChSZXNvdXJjZXMuaXNSZWFkeSgpKSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgUmVzb3VyY2VzLm9uUmVhZHkodGhpcy51cGRhdGUuYmluZCh0aGlzKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVjayBpZiBhIHBsYXllciBoYXMgdG91Y2hlZCBhIGxhZHliaXJkXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufSBjb2xsaXNpb25cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9jaGVja0NvbGxpc2lvbnMoKSB7XG4gICAgICAgIGxldCBjb2xsaXNpb24gPSBmYWxzZTtcblxuICAgICAgICBmb3IgKGxldCBlbmVteSBvZiB0aGlzLl9hbGxFbmVtaWVzKSB7XG4gICAgICAgICAgICBjb2xsaXNpb24gPSAoKHRoaXMuX3BsYXllci5nZXRQb3NpdGlvblgoKSA+PSBlbmVteS5nZXRQb3NpdGlvblgoKSAtIDUwKSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICh0aGlzLl9wbGF5ZXIuZ2V0UG9zaXRpb25YKCkgPD0gZW5lbXkuZ2V0UG9zaXRpb25YKCkgKyA1MCkpICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAoKHRoaXMuX3BsYXllci5nZXRQb3NpdGlvblkoKSA+PSBlbmVteS5nZXRQb3NpdGlvblkoKSAtIDM3KSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICh0aGlzLl9wbGF5ZXIuZ2V0UG9zaXRpb25ZKCkgPD0gZW5lbXkuZ2V0UG9zaXRpb25ZKCkgKyAzNykpO1xuICAgICAgICAgICAgaWYgKGNvbGxpc2lvbikge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNvbGxpc2lvbjtcbiAgICB9XG5cbiAgICBfY2hlY2tBdWRpbygpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9hdWRpb1BhdXNlZCkge1xuICAgICAgICAgICAgbGV0IG9uU2NyZWVuID0gW107XG5cbiAgICAgICAgICAgIHRoaXMuX2FsbEVuZW1pZXMuZm9yRWFjaCggZW5lbXkgPT4gb25TY3JlZW4ucHVzaChlbmVteS5vblNjcmVlbigpKSApO1xuXG4gICAgICAgICAgICAvLyBpZiBubyBidWdzIGFyZSBvbiBzY3JlZW4sIHBhdXNlIGF1ZGlvXG4gICAgICAgICAgICBpZiAob25TY3JlZW4uZXZlcnkoeCA9PiAheCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0b3BBdWRpbyhcImNyYXdsXCIpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICghR0FNRV9TT1VORFMuY3Jhd2wucGxheWluZyl7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGFydEF1ZGlvKFwiY3Jhd2xcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZWRyYXcgdGhlIHdob2xlIGNhbnZhcyB3aXRoIGFsbCBjaGFyYWN0ZXJzIGluIHRoZWlyIHVwZGF0ZWQgcG9zaXRpb25zXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9yZW5kZXIoKSB7XG4gICAgICAgIGxldCBjdHggPSB0aGlzLl9jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblxuICAgICAgICAvLyBhZGQgZ2FtZSBiYWNrZ3JvdW5kIHRvIGNhbnZhc1xuICAgICAgICBsZXQgcm93SW1hZ2VzID0gW1xuICAgICAgICAgICAgICAgICdpbWFnZXMvYXNzZXRzL3dhdGVyLWJsb2NrLnBuZycsICAgLy8gVG9wIHJvdyBpcyB3YXRlclxuICAgICAgICAgICAgICAgICdpbWFnZXMvYXNzZXRzL3N0b25lLWJsb2NrLnBuZycsICAgLy8gUm93IDEgb2YgMyBvZiBzdG9uZVxuICAgICAgICAgICAgICAgICdpbWFnZXMvYXNzZXRzL3N0b25lLWJsb2NrLnBuZycsICAgLy8gUm93IDIgb2YgMyBvZiBzdG9uZVxuICAgICAgICAgICAgICAgICdpbWFnZXMvYXNzZXRzL3N0b25lLWJsb2NrLnBuZycsICAgLy8gUm93IDMgb2YgMyBvZiBzdG9uZVxuICAgICAgICAgICAgICAgICdpbWFnZXMvYXNzZXRzL2dyYXNzLWJsb2NrLnBuZycsICAgLy8gUm93IDEgb2YgMiBvZiBncmFzc1xuICAgICAgICAgICAgICAgICdpbWFnZXMvYXNzZXRzL2dyYXNzLWJsb2NrLnBuZycgICAgLy8gUm93IDIgb2YgMiBvZiBncmFzc1xuICAgICAgICAgICAgXTtcbiAgICAgICAgbGV0IG51bVJvd3MgPSA2O1xuICAgICAgICBsZXQgbnVtQ29scyA9IDU7XG5cbiAgICAgICAgLy8gQmVmb3JlIGRyYXdpbmcsIGNsZWFyIGV4aXN0aW5nIGNhbnZhc1xuICAgICAgICBjdHguY2xlYXJSZWN0KDAsIDAsIHRoaXMuX2NhbnZhcy53aWR0aCwgdGhpcy5fY2FudmFzLmhlaWdodCk7XG5cbiAgICAgICAgLy8gTG9vcCB0aHJvdWdoIHRoZSBudW1iZXIgb2Ygcm93cyBhbmQgY29sdW1ucyB3ZSd2ZSBkZWZpbmVkIGFib3ZlXG4gICAgICAgIC8vIGFuZCwgdXNpbmcgdGhlIHJvd0ltYWdlcyBhcnJheSwgZHJhdyB0aGUgY29ycmVjdCBpbWFnZSBmb3IgdGhhdFxuICAgICAgICAvLyBwb3J0aW9uIG9mIHRoZSBcImdyaWRcIlxuICAgICAgICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCBudW1Sb3dzOyByb3crKykge1xuICAgICAgICAgICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgbnVtQ29sczsgY29sKyspIHtcbiAgICAgICAgICAgICAgICBjdHguZHJhd0ltYWdlKFJlc291cmNlcy5nZXQocm93SW1hZ2VzW3Jvd10pLCBjb2wgKiAxMDEsIHJvdyAqIDgzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHJlbmRlcmVyIGNoYXJhY3RlcnNcbiAgICAgICAgdGhpcy5fYWxsRW5lbWllcy5mb3JFYWNoKGZ1bmN0aW9uKGVuZW15KSB7XG4gICAgICAgICAgICBlbmVteS5yZW5kZXIoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5fcGxheWVyLnJlbmRlcigpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERpc3BsYXkgZ2FtZSByZXN1bHQgZGlhbG9nIHdpdGggdXBkYXRlZCBsZXZlbCdzIGluZm9ybWF0aW9uc1xuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfb25MZXZlbENvbXBsZXRlZCgpIHtcbiAgICAgICAgbGV0IHRyYWNrTmFtZSA9IFwiamluZ2xlXCIgKyAodGhpcy5fcGxheWVyLmFsaXZlKCk/XCJXaW5cIjpcIkxvb3NlXCIpO1xuICAgICAgICBjb25zb2xlLmluZm8odHJhY2tOYW1lKVxuXG4gICAgICAgIHRoaXMuX3N0b3BUaW1lID0gbmV3IERhdGUoKTtcblxuICAgICAgICB0aGlzLl9vbkxldmVsQ29tcGxldGVkQ2FsbGJhY2sodGhpcy5fcGxheWVyLmFsaXZlKCkpO1xuICAgICAgICB0aGlzLnN0YXJ0QXVkaW8odHJhY2tOYW1lKTtcbiAgICB9XG59XG5cbmV4cG9ydCB7QXJjYWRlR2FtZX07XG4iLCJpbXBvcnQge0NIQVJBQ1RFUlMsIEVORU1JRVMsIEdBTUVfTEVWRUxTLCBHQU1FX1NPVU5EUywgTUFYX1NUQVJTfSBmcm9tIFwiLi9jb25zdC5tanNcIjtcbmltcG9ydCB7QXJjYWRlR2FtZX0gZnJvbSBcIi4vZ2FtZS5tanNcIjtcblxubGV0IGNoZWNrR2FtZUZvY3VzSW50ZXJ2YWxJRCA9IG51bGwsXG5cdGNsb2NrSUQgPSBudWxsLFxuXHRnYW1lTWF0Y2ggPSBudWxsO1xuXG5jb25zdCBpbml0aWFsaXNlSG9tZVBhZ2UgPSAoKSA9PiB7XG5cdGxvYWRHYW1lTGV2ZWxzKCk7XG5cdGxvYWRHYW1lQ2hhcmFjdGVycygpO1xufVxuXG5jb25zdCBsb2FkR2FtZUxldmVscyA9ICgpID0+IHtcblx0Zm9yIChsZXQga2V5IGluIEdBTUVfTEVWRUxTKSB7XG5cdFx0bGV0IHZhbHVlID0gR0FNRV9MRVZFTFNba2V5XTtcblx0XHRsZXQgZnJvbnRGYWNlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblx0XHRsZXQgYmFja0ZhY2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXHRcdGxldCBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuXG5cdFx0ZnJvbnRGYWNlLmNsYXNzTGlzdC5hZGQoXCJmbGlwLWZhY2VcIiwgXCJmbGlwLWZhY2UtZnJvbnRcIik7XG5cdFx0YmFja0ZhY2UuY2xhc3NMaXN0LmFkZChcImZsaXAtZmFjZVwiLCBcImZsaXAtZmFjZS1iYWNrXCIpO1xuXHRcdGJ1dHRvbi5jbGFzc0xpc3QuYWRkKFwiYnRuLWxldmVsXCIsIFwiZmxpcFwiLCBcImZsaXAtdmVydGljYWxcIik7XG5cblx0XHRmcm9udEZhY2UuaW5uZXJUZXh0ID0gYHgke0VORU1JRVNba2V5XX1gO1xuXHRcdGJhY2tGYWNlLmlubmVyVGV4dCA9IHZhbHVlO1xuXG5cdFx0YnV0dG9uLnNldEF0dHJpYnV0ZShcImRhdGEtbGV2ZWxcIiwga2V5KTtcblxuXHRcdGJ1dHRvbi5hcHBlbmRDaGlsZChmcm9udEZhY2UpO1xuXHRcdGJ1dHRvbi5hcHBlbmRDaGlsZChiYWNrRmFjZSk7XG5cblx0XHRpZiAoa2V5ID09PSBcIjBcIikge1xuXHRcdFx0YnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJzZWxlY3RlZFwiKTtcblx0XHR9XG5cblx0XHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2hvbWVTZWN0aW9uICNsZXZlbE9wdGlvbnNcIikuYXBwZW5kQ2hpbGQoYnV0dG9uKTtcblx0fVxufTtcblxuY29uc3QgbG9hZEdhbWVDaGFyYWN0ZXJzID0gKCkgPT4ge1xuXHRmb3IgKGxldCBjaGFyYWN0ZXIgaW4gQ0hBUkFDVEVSUykge1xuXHRcdGxldCB7YXNzZXRQYXRofSA9IENIQVJBQ1RFUlNbY2hhcmFjdGVyXTtcblx0XHRsZXQgY2hhcmFjdGVyT2JqID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblxuXHRcdGNoYXJhY3Rlck9iai5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBgdXJsKFwiaW1hZ2VzL2Fzc2V0cy8ke2Fzc2V0UGF0aH1cIilgO1xuXHRcdGNoYXJhY3Rlck9iai5jbGFzc0xpc3QuYWRkKFwiY2hhcmFjdGVyLWVudHJ5XCIpO1xuXHRcdGNoYXJhY3Rlck9iai5zZXRBdHRyaWJ1dGUoXCJkYXRhLWlkXCIsIGNoYXJhY3Rlcik7XG5cblx0XHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2NoYXJhY3RlcnNMaXN0XCIpLmFwcGVuZENoaWxkKGNoYXJhY3Rlck9iaik7XG5cdH1cblx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNjaGFyYWN0ZXJzTGlzdCAuY2hhcmFjdGVyLWVudHJ5Om50aC1jaGlsZCgxKVwiKS5jbGFzc0xpc3QuYWRkKFwic2VsZWN0ZWRcIik7XG5cdHVwZGF0ZVNlbGVjdGVkQ2hhcmFjdGVyKCk7XG59XG5cbi8qKlxuICogVXBkYXRlZCB0aGUgY2hhcmFjdGVyIHNlbGVjdGVkIGZvciB0aGUgUGxheWVyXG4gKi9cbmNvbnN0IHVwZGF0ZVNlbGVjdGVkQ2hhcmFjdGVyID0gKCkgPT4ge1xuXHRsZXQgc2VsZWN0ZWRDaGFyYWN0ZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2NoYXJhY3RlcnNMaXN0IC5jaGFyYWN0ZXItZW50cnkuc2VsZWN0ZWRcIik7XG5cdGxldCBzZWxlY3RlZE9iakltZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY2hhcmFjdGVyU2VsZWN0ZWQgZGl2Om50aC1jaGlsZCgxKVwiKTtcblx0bGV0IHNlbGVjdGVkT2JqTmFtZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY2hhcmFjdGVyU2VsZWN0ZWQgZGl2Om50aC1jaGlsZCgyKVwiKTtcblx0bGV0IGNoYXJhY3RlciA9IHNlbGVjdGVkQ2hhcmFjdGVyLmdldEF0dHJpYnV0ZShcImRhdGEtaWRcIik7XG5cblx0c2VsZWN0ZWRPYmpJbWcuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gc2VsZWN0ZWRDaGFyYWN0ZXIuc3R5bGUuYmFja2dyb3VuZEltYWdlO1xuXHRzZWxlY3RlZE9iak5hbWUuaW5uZXJUZXh0ID0gQ0hBUkFDVEVSU1tjaGFyYWN0ZXJdLm5hbWU7XG59XG5cbi8qKlxuICogVXBkYXRlIHBsYXllciBjaGFyYWN0ZXJcbiAqL1xuY29uc3Qgc2VsZWN0Q2hhcmFjdGVyID0gZXZlbnQgPT4ge1xuXHRpZiAoZXZlbnQudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhcImNoYXJhY3Rlci1lbnRyeVwiKSkge1xuXHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY2hhcmFjdGVyc0xpc3QgLmNoYXJhY3Rlci1lbnRyeS5zZWxlY3RlZFwiKS5jbGFzc0xpc3QucmVtb3ZlKFwic2VsZWN0ZWRcIik7XG5cdFx0ZXZlbnQudGFyZ2V0LmNsYXNzTGlzdC5hZGQoXCJzZWxlY3RlZFwiKTtcblxuXHRcdHVwZGF0ZVNlbGVjdGVkQ2hhcmFjdGVyKCk7XG5cdH1cbn1cblxuLyoqXG4gKiBQYXVzZSBnYW1lIHRoZW1lIHNvdW5kIHdoZW4gcGFnZSBsb3NlcyBmb2N1c1xuICovXG5jb25zdCBjaGVja0dhbWVGb2N1cyA9ICgpID0+IHtcblx0aWYgKGRvY3VtZW50Lmhhc0ZvY3VzKCkpIHtcblx0XHRnYW1lTWF0Y2guc3RhcnRBdWRpbyhmYWxzZSk7XG5cdH0gZWxzZSB7XG5cdFx0Z2FtZU1hdGNoLnBhdXNlQXVkaW8oKTtcblx0fVxufVxuXG4vKlxuICogU2hvdyBob21lIHBhZ2Ugc2VjdGlvbiAoaGlkZSBhbGwgdGhlIG90aGVycylcbiAqL1xuY29uc3Qgc2hvd0hvbWUgPSAoKSA9PiB7XG5cdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaG9tZVNlY3Rpb25cIikuY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcblx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnYW1lU2VjdGlvblwiKS5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xuXG5cdGlmICghZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnYW1lUmVzdWx0U2VjdGlvblwiKS5jbGFzc0xpc3QuY29udGFpbnMoXCJoaWRkZW5cIikpIHtcblx0XHRkaXNtaXNzR2FtZVJlc3VsdCgpO1xuXHR9XG5cblx0YWRkSG9tZUxpc3RlbmVycygpO1xuXHRyZW1vdmVHYW1lTGlzdGVuZXJzKCk7XG5cdGNoZWNrUmVzdW1lQnV0dG9uKCk7XG59XG5cbi8qXG4gKiBTaG93IGdhbWUgc2VjdGlvbiAoaGlkZSBhbGwgdGhlIG90aGVycylcbiAqL1xuY29uc3Qgc2hvd0dhbWUgPSAoKSA9PiB7XG5cdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaG9tZVNlY3Rpb25cIikuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcblx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnYW1lU2VjdGlvblwiKS5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpO1xuXG5cdGlmICghZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnYW1lUmVzdWx0U2VjdGlvblwiKS5jbGFzc0xpc3QuY29udGFpbnMoXCJoaWRkZW5cIikpIHtcblx0XHRkaXNtaXNzR2FtZVJlc3VsdCgpO1xuXHR9XG5cblx0cmVtb3ZlSG9tZUxpc3RlbmVycygpO1xuXHRhZGRHYW1lTGlzdGVuZXJzKCk7XG59XG5cbi8qXG4gKiBTaG93IGdhbWUgcmVzdWx0IFwiZGlhbG9nXCJcbiAqL1xuY29uc3Qgc2hvd0dhbWVSZXN1bHQgPSBzdWNjZXNzID0+IHtcblx0aWYgKCFnYW1lTWF0Y2guZ2FtZUNvbXBsZXRlZCgpKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0bGV0IGdhbWVSZXN1bHRTZWN0aW9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnYW1lUmVzdWx0U2VjdGlvblwiKTtcblxuXHRnYW1lUmVzdWx0U2VjdGlvbi5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpO1xuXG5cdC8vIHRvIHNpbXVsYXRlIGEgcmVhbCBkaWFsb2cgcHJldmVudCBwYWdlIHNjcm9sbGluZyBieSBoaWRpbmcgb3ZlcmZsb3dcblx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImJvZHlcIikuY2xhc3NMaXN0LmFkZChcImZ1bGwtc2NyZWVuXCIpO1xuXG5cdC8vIHVwZGF0ZSBkaWFsb2cgd2l0aCBnYW1lIHJlc3VsdHNcblx0Z2FtZVJlc3VsdFNlY3Rpb24ucXVlcnlTZWxlY3RvcihcIiNnYW1lUmVzdWx0VGV4dFwiKS5pbm5lclRleHQgPSBzdWNjZXNzPyBcIkxldmVsIENvbXBsZXRlZCFcIiA6IFwiWW91IExvc3Qg4pi5XCI7XG5cdGdhbWVSZXN1bHRTZWN0aW9uLnF1ZXJ5U2VsZWN0b3IoXCIjZ2FtZVRvdGFsVGltZVwiKS5pbm5lclRleHQgPSBgVG90YWwgdGltZTogJHtnYW1lTWF0Y2guZ2V0RWxhcHNlZFRpbWUoKX1gO1xuXG5cdC8vIHVwZGF0ZSBzdGFycyByYXRpbmdcblx0bGV0IHJhdGluZyA9IGdhbWVNYXRjaC5nZXRTdGFyUmF0aW5nKCk7XG5cdGxldCBzdGFyUmF0ZSA9IDEwMCAvIE1BWF9TVEFSUztcblx0Zm9yIChsZXQgc3RhciBvZiBnYW1lUmVzdWx0U2VjdGlvbi5xdWVyeVNlbGVjdG9yQWxsKFwiLnN0YXJcIikpIHtcblx0XHRpZiAocmF0aW5nIC0gc3RhclJhdGUgPiAwKSB7XG5cdFx0XHRzdGFyLnF1ZXJ5U2VsZWN0b3IoXCIuc3Rhci1pbm5lclwiKS5zdHlsZS53aWR0aCA9IFwiMTAwJVwiO1xuXHRcdFx0cmF0aW5nIC09IHN0YXJSYXRlO1xuXHRcdH0gZWxzZSBpZiAocmF0aW5nID4gMCkge1xuXHRcdFx0bGV0IHN0YXJQZXJjID0gKDEwMCAqIHJhdGluZykgLyBzdGFyUmF0ZTtcblx0XHRcdHN0YXIucXVlcnlTZWxlY3RvcihcIi5zdGFyLWlubmVyXCIpLnN0eWxlLndpZHRoID0gYCR7c3RhclBlcmN9JWA7XG5cdFx0XHRyYXRpbmcgLT0gc3RhclJhdGU7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHN0YXIucXVlcnlTZWxlY3RvcihcIi5zdGFyLWlubmVyXCIpLnN0eWxlLndpZHRoID0gXCIwJVwiO1xuXHRcdH1cblx0fVxuXG5cdGRpc2FibGVSZXN1bWVCdXR0b25zKCk7XG5cdHJlbW92ZUhvbWVMaXN0ZW5lcnMoKTtcblx0cmVtb3ZlR2FtZUxpc3RlbmVycygpO1xuXHRhZGRHYW1lUmVzdWx0TGlzdGVuZXJzKCk7XG59XG5cbi8qXG4gKiBIaWRlIGdhbWUgcmVzdWx0IGRpYWxvZ1xuICovXG5jb25zdCBkaXNtaXNzR2FtZVJlc3VsdCA9ICgpID0+IHtcblx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnYW1lUmVzdWx0U2VjdGlvblwiKS5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xuXG5cdC8vIHJlLWVuYWJsZSBvdmVyZmxvdyBvbiBwYWdlXG5cdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJib2R5XCIpLmNsYXNzTGlzdC5yZW1vdmUoXCJmdWxsLXNjcmVlblwiKTtcblxuXHRyZW1vdmVHYW1lUmVzdWx0TGlzdGVuZXJzKCk7XG59XG5cbi8qXG4gKiBVcGRhdGUgdGhlIGxldmVsIGFuZCBzdGFydCBjbG9jayBpbiB0aGUgZ2FtZSBwYWdlXG4gKi9cbmNvbnN0IHVwZGF0ZUdhbWVJbmZvcyA9ICgpID0+IHtcblx0Y2xlYXJJbnRlcnZhbChjbG9ja0lEKTtcblx0Y2xvY2tJRCA9IHNldEludGVydmFsKCgpID0+IHtcblx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdhbWVUaW1lRWxhcHNlZFwiKS5pbm5lclRleHQgPSBnYW1lTWF0Y2guZ2V0RWxhcHNlZFRpbWUoKTtcblx0fSwgMTAwMCk7XG5cblx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnYW1lTGV2ZWxEZXNjcmlwdGlvblwiKS5pbm5lclRleHQgPSBgTGV2ZWwgJHtHQU1FX0xFVkVMU1tnYW1lTWF0Y2guZ2V0TGV2ZWwoKV19YDtcbn1cblxuLyoqXG4gKiBNYWtlIHJlc3VtZSBidXR0b25zIGF2YWlsYWJsZVxuICovXG5jb25zdCBlbmFibGVSZXN1bWVCdXR0b25zID0gKCkgPT4ge1xuXHRmb3IgKGxldCBidG4gb2YgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5idG4tcmVzdW1lXCIpKSB7XG5cdFx0YnRuLmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRkZW5cIik7XG5cdH1cbn1cblxuLyoqXG4gKiBNYWtlIHJlc3VtZSBidXR0b25zIHVuYXZhaWxhYmxlXG4gKi9cbmNvbnN0IGRpc2FibGVSZXN1bWVCdXR0b25zID0gKCkgPT4ge1xuXHRmb3IgKGxldCBidG4gb2YgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5idG4tcmVzdW1lXCIpKSB7XG5cdFx0YnRuLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG5cdH1cbn1cblxuLyoqXG4gKiBEaXNhYmxlIHJlc3VtZSBidXR0b24gd2hlbiBzZWxlY3RlZCBsZXZlbCBidXR0b24gZG9lcyBub3QgbWF0Y2ggd2l0aCBjdXJyZW50XG4gKiBnYW1lIGxldmVsLiBFbmFibGUgb3RoZXJ3aXNlLlxuICovXG5jb25zdCBjaGVja1Jlc3VtZUJ1dHRvbiA9ICgpID0+IHtcblx0bGV0IHJlc3VtZUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYnRuLXJlc3VtZVwiKTtcblx0bGV0IHNlbGVjdGVkTGV2ZWxCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmJ0bi1sZXZlbC5zZWxlY3RlZFwiKTtcblxuXHRpZiAoIXJlc3VtZUJ0bi5jbGFzc0xpc3QuY29udGFpbnMoXCJoaWRkZW5cIikpIHtcblx0XHRpZiAoc2VsZWN0ZWRMZXZlbEJ1dHRvbi5kYXRhc2V0LmxldmVsID09PSBnYW1lTWF0Y2guZ2V0TGV2ZWwoKSkge1xuXHRcdFx0cmVzdW1lQnRuLmRpc2FibGVkID0gZmFsc2U7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJlc3VtZUJ0bi5kaXNhYmxlZCA9IHRydWU7XG5cdFx0fVxuXHR9XG59XG5cbi8qXG4gKiBTdGFydCBhIG5ldyBnYW1lIG9uIGEgc3BlY2lmaWVkIGxldmVsXG4gKiBAcGFyYW0gbGV2ZWwge051bWJlcn1cbiAqL1xuY29uc3QgaW5pdGlhbGlzZUdhbWUgPSBsZXZlbCA9PiB7XG5cdGxldCBzZWxlY3RlZENoYXJhY3RlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY2hhcmFjdGVyc0xpc3QgLnNlbGVjdGVkXCIpLmdldEF0dHJpYnV0ZShcImRhdGEtaWRcIik7XG5cblx0aWYgKGdhbWVNYXRjaCkge1xuXHRcdGdhbWVNYXRjaC5kZXN0cm95KCk7XG5cdH0gZWxzZSB7XG5cdFx0Z2FtZU1hdGNoID0gbmV3IEFyY2FkZUdhbWUoc2hvd0dhbWVSZXN1bHQpO1xuXHR9XG5cblx0Z2FtZU1hdGNoLmluaXRpYWxpc2UobGV2ZWwsIHNlbGVjdGVkQ2hhcmFjdGVyKTtcblxuXHRlbmFibGVSZXN1bWVCdXR0b25zKCk7XG5cdHNob3dHYW1lKCk7XG5cdHVwZGF0ZUdhbWVJbmZvcygpO1xufVxuXG4vKlxuICogU3RhcnQgYSBuZXcgZ2FtZSBmcm9tIHRoZSBzZWxlY3RlZCBsZXZlbFxuICovXG5jb25zdCBzdGFydEdhbWUgPSAoKSA9PiB7XG5cdGxldCBsZXZlbFNlbGVjdGVkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5idG4tbGV2ZWwuc2VsZWN0ZWRcIikuZGF0YXNldC5sZXZlbDtcblxuXHRpbml0aWFsaXNlR2FtZShsZXZlbFNlbGVjdGVkKTtcbn1cblxuLypcbiAqIFN0YXJ0IGEgbmV3IGdhbWUgZnJvbSB0aGUgY3VycmVudCBnYW1lIGxldmVsXG4gKi9cbmNvbnN0IHJlc2V0R2FtZSA9ICgpID0+IHtcblx0bGV0IGxldmVsID0gZ2FtZU1hdGNoLmdldExldmVsKCk7XG5cblx0aW5pdGlhbGlzZUdhbWUobGV2ZWwpO1xufVxuXG4vKlxuICogUmVzZXQgdG8gYSBuZXcgZ2FtZSB3aXRoIGhpZ2hlciBsZXZlbFxuICovXG5jb25zdCBsZXZlbFVwID0gKCkgPT4ge1xuXHRsZXQgbmV4dExldmVsID0gcGFyc2VJbnQoZ2FtZU1hdGNoLmdldExldmVsKCksIDEwKSArIDE7XG5cblx0aW5pdGlhbGlzZUdhbWUobmV4dExldmVsKTtcbn1cblxuLypcbiAqIEV2ZW50IGNhbGxiYWNrIG1ldGhvZCB0byBzZWxlY3QgYSBsZXZlbFxuICogQHBhcmFtIGV2ZW50IHtPYmplY3R9XG4gKi9cbmNvbnN0IHNlbGVjdExldmVsID0gZXZlbnQgPT4ge1xuXHRpZiAoZXZlbnQudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhcImJ0bi1sZXZlbFwiKSkge1xuXHRcdC8vIHJlbW92ZSBzZWxlY3Rpb24gZnJvbSBjdXJyZW50bHkgc2VsZWN0ZWQgYnV0dG9uXG5cdFx0bGV0IGN1cnJlbnRseVNlbGVjdGVkQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5idG4tbGV2ZWwuc2VsZWN0ZWRcIik7XG5cdFx0aWYgKGN1cnJlbnRseVNlbGVjdGVkQnV0dG9uKSB7XG5cdFx0XHRjdXJyZW50bHlTZWxlY3RlZEJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKFwic2VsZWN0ZWRcIilcblx0XHR9XG5cdFx0Ly8gYWRkIHNlbGVjdGlvbiB0byB0aGUgYnV0dG9uIHRoYXQgaGFzIGp1c3QgYmVlbiBjbGlja2VkXG5cdFx0ZXZlbnQudGFyZ2V0LmNsYXNzTGlzdC5hZGQoXCJzZWxlY3RlZFwiKTtcblxuXHRcdC8vIGV2ZW50dWFsbHkgZGlzYWJsZSByZXN1bWUgb3B0aW9uXG5cdFx0Y2hlY2tSZXN1bWVCdXR0b24oKTtcblx0fVxufVxuXG4vKipcbiAqIEFkZCBsb2FkaW5nIGNsYXNzIHRvIGNsaWNrZWQgYnV0dG9uIHRoZW4gc2hvdyB0aGUgZ2FtZSBwYWdlXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGV2ZW50XG4gKi9cbmNvbnN0IGxvYWRHYW1lID0gZXZlbnQgPT4ge1xuXHRsZXQgY2FsbGJhY2sgPSBzdGFydEdhbWU7XG5cblx0ZXZlbnQudGFyZ2V0LmNsYXNzTGlzdC5hZGQoXCJsb2FkaW5nXCIpO1xuXG5cdGlmIChldmVudC50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiYnRuLXJlc3VtZVwiKSkge1xuXHRcdGNhbGxiYWNrID0gKCkgPT4ge1xuXHRcdFx0c2hvd0dhbWUoKTtcblx0XHRcdGdhbWVNYXRjaC5zdGFydEF1ZGlvKGZhbHNlKTtcblx0XHR9XG5cdH1cblxuXHRzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRmb3IgKGxldCBsb2FkaW5nRWxlbWVudCBvZiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmxvYWRpbmdcIikpIHtcblx0XHRcdGxvYWRpbmdFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoXCJsb2FkaW5nXCIpO1xuXHRcdH1cblxuXHRcdGNhbGxiYWNrKCk7XG5cdH0sIDEwMDApO1xufVxuXG4vKlxuICogTGlzdGVuIHRvIGEgY2xpY2sgZXZlbnQgb24gdGhlIGxldmVsIGJ1dHRvbnMgdG8gc2VsZWN0IGl0LlxuICogQWxzbyBsaXN0ZW4gdG8gdGhlIHJlc3VtZSBidXR0b24gdG8gZ28gYmFjayB0byB0aGUgZ2FtZSB3aXRob3V0IHJlc3RhcnRpbmcgaXQuXG4gKi9cbmNvbnN0IGFkZEhvbWVMaXN0ZW5lcnMgPSAoKSA9PiB7XG5cdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibGV2ZWxDaGFyYWN0ZXJcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHNlbGVjdENoYXJhY3Rlcik7XG5cdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibGV2ZWxPcHRpb25zXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBzZWxlY3RMZXZlbCk7XG5cdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYnRuLXJlc3VtZVwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgbG9hZEdhbWUpO1xufVxuXG4vKlxuICogU3RvcCBsaXN0ZW5pbmcgdG8gdGhlIGludGVyYWN0aW9ucyBvbiB0aGUgbGV2ZWwgYW5kIHJlc3VtZSBidXR0b25zLlxuICovXG5jb25zdCByZW1vdmVIb21lTGlzdGVuZXJzID0gKCkgPT4ge1xuXHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxldmVsT3B0aW9uc1wiKS5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgc2VsZWN0TGV2ZWwpO1xuXHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmJ0bi1yZXN1bWVcIikucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGxvYWRHYW1lKTtcbn1cblxuLypcbiAqIExpc3RlbiB0byBhIGNsaWNrIGV2ZW50IG9uIGVhY2ggY2FyZCBpbiB0aGUgZ3JpZCBpbiBvcmRlciB0byBmbGlwIHRoZSBjYXJkXG4gKi9cbmNvbnN0IGFkZEdhbWVMaXN0ZW5lcnMgPSAoKSA9PiB7XG5cdFx0Y2hlY2tHYW1lRm9jdXNJbnRlcnZhbElEID0gc2V0SW50ZXJ2YWwoY2hlY2tHYW1lRm9jdXMsIDMwMCk7XG59XG5cbi8qXG4gKiBTdG9wIGxpc3RlbmluZyB0byB0aGUgaW50ZXJhY3Rpb25zIG9uIHRoZSBjYXJkc1xuICovXG5jb25zdCByZW1vdmVHYW1lTGlzdGVuZXJzID0gKCkgPT4ge1xuXHRcdGNsZWFySW50ZXJ2YWwoY2hlY2tHYW1lRm9jdXNJbnRlcnZhbElEKTtcblx0Z2FtZU1hdGNoLnBhdXNlQXVkaW8oKTtcbn1cblxuLypcbiAqIExpc3RlbiB0byBhIGNsaWNrIGV2ZW4gb24gdGhlIGxldmVsIHVwIGJ1dHRvblxuICovXG5jb25zdCBhZGRHYW1lUmVzdWx0TGlzdGVuZXJzID0gKCkgPT4ge1xuXHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjZ2FtZVJlc3VsdFNlY3Rpb24gLmRpYWxvZyAuYnRuLWxldmVsdXBcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGxldmVsVXApO1xufVxuXG4vKlxuICogU3RvcCBsaXN0ZW5pbmcgdG8gdGhlIGxldmVsIHVwIGJ1dHRvbiBjbGlja1xuICovXG5jb25zdCByZW1vdmVHYW1lUmVzdWx0TGlzdGVuZXJzID0gKCkgPT4ge1xuXHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjZ2FtZVJlc3VsdFNlY3Rpb24gLmRpYWxvZyAuYnRuLWxldmVsdXBcIikucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGxldmVsVXApO1xufVxuXG4vKlxuICogTGlzdGVuIHRvIGEgY2xpY2sgZXZlbnQgb24gYWxsIHRoZSBidXR0b25zIGluIHRoZSBwYWdlc1xuICovXG5jb25zdCBhZGROYXZpZ2F0aW9uTGlzdGVuZXJzID0gKCkgPT4ge1xuXHRcdC8vIHdoZW4gYSBzdGFydCBvciByZXNldCBidXR0b24gaXMgY2xpY2tlZCwgaW5pdGlhbGlzZSBhIG5ldyBnYW1lIHdpdGggdGhlIHNlbGVjdGVkIGxldmVsXG5cdGxldCBzdGFydEdhbWVCdXR0b25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5idG4tc3RhcnRcIik7XG5cdGZvciAobGV0IGJ0biBvZiBzdGFydEdhbWVCdXR0b25zKSB7XG5cdFx0YnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBsb2FkR2FtZSk7XG5cdH1cblxuXHRsZXQgcmVzZXRHYW1lQnV0dG9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuYnRuLXJlc2V0XCIpO1xuXHRmb3IgKGxldCBidG4gb2YgcmVzZXRHYW1lQnV0dG9ucykge1xuXHRcdGJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgcmVzZXRHYW1lKTtcblx0fVxuXG5cdC8vIHdoZW4gYW4gaG9tZSBidXR0b24gaXMgY2xpY2tlZCwgc2hvdyB0aGUgaG9tZSBzZWN0aW9uXG5cdGxldCBob21lQnV0dG9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuYnRuLWhvbWVcIik7XG5cdGZvciAobGV0IGJ0biBvZiBob21lQnV0dG9ucykge1xuXHRcdGJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgc2hvd0hvbWUpO1xuXHR9XG59XG5cbi8qKlxuICogU3VwcG9ydCBtZXRob2QgdG8gcmVkdWNlIHRyYWNrcyB2b2x1bWUsXG4gKiBpbml0aWFsaXNlIGxvb3BhYmxlIHRyYWNrcyBhbmQgaW5pdGlhbGlzZSBsaXN0ZW5lcnMgZm9yIHRyYWNrIGNvbXBsZXRpb25cbiAqIHRvIHVwZGF0ZSB0aGUgdHJhY2sgc3RhdGUuXG4gKi9cbmNvbnN0IHNldHRsZUF1ZGlvVHJhY2tzID0gKCkgPT4ge1xuXHRcdEdBTUVfU09VTkRTLmdhbWVUaGVtZS5hdWRpby5sb29wID0gdHJ1ZTtcblx0R0FNRV9TT1VORFMuZ2FtZVRoZW1lLmF1ZGlvLnZvbHVtZSA9IDAuNTtcblx0R0FNRV9TT1VORFMuc3RlcC5hdWRpby52b2x1bWUgPSAwLjU7XG5cdEdBTUVfU09VTkRTLmppbmdsZUxvb3NlLmF1ZGlvLnZvbHVtZSA9IDAuMjtcblx0R0FNRV9TT1VORFMuamluZ2xlV2luLmF1ZGlvLnZvbHVtZSA9IDAuMjtcblx0R0FNRV9TT1VORFMuY3Jhd2wuYXVkaW8ubG9vcCA9IHRydWU7XG5cblx0Zm9yIChsZXQgdHJhY2sgaW4gR0FNRV9TT1VORFMpIHtcblx0XHRHQU1FX1NPVU5EU1t0cmFja10uYXVkaW8uYWRkRXZlbnRMaXN0ZW5lcihcImVuZGVkXCIsICgpID0+IHtcblx0XHRcdEdBTUVfU09VTkRTW3RyYWNrXS5wbGF5aW5nID0gZmFsc2U7XG5cdFx0fSk7XG5cdH1cbn1cblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHtcblx0XHRzZXR0bGVBdWRpb1RyYWNrcygpO1xuXHRpbml0aWFsaXNlSG9tZVBhZ2UoKTtcblx0YWRkTmF2aWdhdGlvbkxpc3RlbmVycygpO1xuXHRhZGRIb21lTGlzdGVuZXJzKCk7XG59KTtcblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsICgpID0+IHtcblx0XHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2dhbWVSZXN1bHRTZWN0aW9uXCIpLnN0eWxlLnRvcCA9IGAke3dpbmRvdy5zY3JvbGxZfXB4YDtcbn0pO1xuIiwiLyoqIFJlc291cmNlcy5qc1xuICogVGhpcyBpcyBzaW1wbHkgYW4gaW1hZ2UgbG9hZGluZyB1dGlsaXR5LiBJdCBlYXNlcyB0aGUgcHJvY2VzcyBvZiBsb2FkaW5nXG4gKiBpbWFnZSBmaWxlcyBzbyB0aGF0IHRoZXkgY2FuIGJlIHVzZWQgd2l0aGluIHlvdXIgZ2FtZS4gSXQgYWxzbyBpbmNsdWRlc1xuICogYSBzaW1wbGUgXCJjYWNoaW5nXCIgbGF5ZXIgc28gaXQgd2lsbCByZXVzZSBjYWNoZWQgaW1hZ2VzIGlmIHlvdSBhdHRlbXB0XG4gKiB0byBsb2FkIHRoZSBzYW1lIGltYWdlIG11bHRpcGxlIHRpbWVzLlxuICovXG5sZXQgcmVzb3VyY2VDYWNoZSA9IHt9O1xubGV0IHJlYWR5Q2FsbGJhY2tzID0gW107XG5cbi8qKlxuICogVGhpcyBpcyB0aGUgcHVibGljbHkgYWNjZXNzaWJsZSBpbWFnZSBsb2FkaW5nIGZ1bmN0aW9uLiBJdCBhY2NlcHRzXG4gKiBhbiBhcnJheSBvZiBzdHJpbmdzIHBvaW50aW5nIHRvIGltYWdlIGZpbGVzIG9yIGEgc3RyaW5nIGZvciBhIHNpbmdsZVxuICogaW1hZ2UuIEl0IHdpbGwgdGhlbiBjYWxsIG91ciBwcml2YXRlIGltYWdlIGxvYWRpbmcgZnVuY3Rpb24gYWNjb3JkaW5nbHkuXG4gKlxuICogQHBhcmFtIHVybE9yQXJyIHtTdHJpbmd8QXJyYXl9XG4gKi9cbmNvbnN0IGxvYWQgPSB1cmxPckFyciA9PiB7XG4gICAgaWYgKHVybE9yQXJyIGluc3RhbmNlb2YgQXJyYXkpIHtcblxuICAgICAgICAvKiBJZiB0aGUgZGV2ZWxvcGVyIHBhc3NlZCBpbiBhbiBhcnJheSBvZiBpbWFnZXNcbiAgICAgICAgICogbG9vcCB0aHJvdWdoIGVhY2ggdmFsdWUgYW5kIGNhbGwgb3VyIGltYWdlXG4gICAgICAgICAqIGxvYWRlciBvbiB0aGF0IGltYWdlIGZpbGVcbiAgICAgICAgICovXG4gICAgICAgIHVybE9yQXJyLmZvckVhY2goZnVuY3Rpb24odXJsKSB7XG4gICAgICAgICAgICBfbG9hZCh1cmwpO1xuICAgICAgICB9KTtcbiAgICB9IGVsc2Uge1xuXG4gICAgICAgIC8qIFRoZSBkZXZlbG9wZXIgZGlkIG5vdCBwYXNzIGFuIGFycmF5IHRvIHRoaXMgZnVuY3Rpb24sXG4gICAgICAgICAqIGFzc3VtZSB0aGUgdmFsdWUgaXMgYSBzdHJpbmcgYW5kIGNhbGwgb3VyIGltYWdlIGxvYWRlclxuICAgICAgICAgKiBkaXJlY3RseS5cbiAgICAgICAgICovXG4gICAgICAgIF9sb2FkKHVybE9yQXJyKTtcbiAgICB9XG59XG5cbi8qKlxuICogVGhpcyBpcyBvdXIgcHJpdmF0ZSBpbWFnZSBsb2FkZXIgZnVuY3Rpb24sIGl0IGlzXG4gKiBjYWxsZWQgYnkgdGhlIHB1YmxpYyBpbWFnZSBsb2FkZXIgZnVuY3Rpb24uXG4gKi9cbmNvbnN0IF9sb2FkID0gdXJsID0+IHtcbiAgICBpZiAocmVzb3VyY2VDYWNoZVt1cmxdKSB7XG5cbiAgICAgICAgLyogSWYgdGhpcyBVUkwgaGFzIGJlZW4gcHJldmlvdXNseSBsb2FkZWQgaXQgd2lsbCBleGlzdCB3aXRoaW5cbiAgICAgICAgICogb3VyIHJlc291cmNlQ2FjaGUgYXJyYXkuIEp1c3QgcmV0dXJuIHRoYXQgaW1hZ2UgcmF0aGVyIHRoYW5cbiAgICAgICAgICogcmUtbG9hZGluZyB0aGUgaW1hZ2UuXG4gICAgICAgICAqL1xuICAgICAgICByZXR1cm4gcmVzb3VyY2VDYWNoZVt1cmxdO1xuICAgIH1cblxuICAgIC8qIFRoaXMgVVJMIGhhcyBub3QgYmVlbiBwcmV2aW91c2x5IGxvYWRlZCBhbmQgaXMgbm90IHByZXNlbnRcbiAgICAgKiB3aXRoaW4gb3VyIGNhY2hlOyB3ZSdsbCBuZWVkIHRvIGxvYWQgdGhpcyBpbWFnZS5cbiAgICAgKi9cbiAgICBsZXQgaW1nID0gbmV3IEltYWdlKCk7XG5cbiAgICBpbWcub25sb2FkID0gKCkgPT4ge1xuXG4gICAgICAgIC8qIE9uY2Ugb3VyIGltYWdlIGhhcyBwcm9wZXJseSBsb2FkZWQsIGFkZCBpdCB0byBvdXIgY2FjaGVcbiAgICAgICAgICogc28gdGhhdCB3ZSBjYW4gc2ltcGx5IHJldHVybiB0aGlzIGltYWdlIGlmIHRoZSBkZXZlbG9wZXJcbiAgICAgICAgICogYXR0ZW1wdHMgdG8gbG9hZCB0aGlzIGZpbGUgaW4gdGhlIGZ1dHVyZS5cbiAgICAgICAgICovXG4gICAgICAgIHJlc291cmNlQ2FjaGVbdXJsXSA9IGltZztcblxuICAgICAgICAvKiBPbmNlIHRoZSBpbWFnZSBpcyBhY3R1YWxseSBsb2FkZWQgYW5kIHByb3Blcmx5IGNhY2hlZCxcbiAgICAgICAgICogY2FsbCBhbGwgb2YgdGhlIG9uUmVhZHkoKSBjYWxsYmFja3Mgd2UgaGF2ZSBkZWZpbmVkLlxuICAgICAgICAgKi9cbiAgICAgICAgaWYgKGlzUmVhZHkoKSkge1xuICAgICAgICAgICAgcmVhZHlDYWxsYmFja3MuZm9yRWFjaChjYWxsYmFjayA9PiBjYWxsYmFjaygpKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKiBTZXQgdGhlIGluaXRpYWwgY2FjaGUgdmFsdWUgdG8gZmFsc2UsIHRoaXMgd2lsbCBjaGFuZ2Ugd2hlblxuICAgICAqIHRoZSBpbWFnZSdzIG9ubG9hZCBldmVudCBoYW5kbGVyIGlzIGNhbGxlZC4gRmluYWxseSwgcG9pbnRcbiAgICAgKiB0aGUgaW1hZ2UncyBzcmMgYXR0cmlidXRlIHRvIHRoZSBwYXNzZWQgaW4gVVJMLlxuICAgICAqL1xuICAgIHJlc291cmNlQ2FjaGVbdXJsXSA9IGZhbHNlO1xuICAgIGltZy5zcmMgPSB1cmw7XG5cbiAgICByZXR1cm4gaW1nO1xufVxuXG4vKipcbiAqIFRoaXMgaXMgdXNlZCBieSBkZXZlbG9wZXJzIHRvIGdyYWIgcmVmZXJlbmNlcyB0byBpbWFnZXMgdGhleSBrbm93XG4gKiBoYXZlIGJlZW4gcHJldmlvdXNseSBsb2FkZWQuIElmIGFuIGltYWdlIGlzIGNhY2hlZCwgdGhpcyBmdW5jdGlvbnNcbiAqIHRoZSBzYW1lIGFzIGNhbGxpbmcgbG9hZCgpIG9uIHRoYXQgVVJMLlxuICovXG5jb25zdCBnZXQgPSB1cmwgPT4gcmVzb3VyY2VDYWNoZVt1cmxdO1xuXG4vKiBUaGlzIGZ1bmN0aW9uIGRldGVybWluZXMgaWYgYWxsIG9mIHRoZSBpbWFnZXMgdGhhdCBoYXZlIGJlZW4gcmVxdWVzdGVkXG4gKiBmb3IgbG9hZGluZyBoYXZlIGluIGZhY3QgYmVlbiBwcm9wZXJseSBsb2FkZWQuXG4gKi9cbmNvbnN0IGlzUmVhZHkgPSAoKSA9PiB7XG4gICAgbGV0IHJlYWR5ID0gdHJ1ZTtcblxuICAgIGZvciAobGV0IGsgaW4gcmVzb3VyY2VDYWNoZSkge1xuICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHJlc291cmNlQ2FjaGUsIGspICYmICFyZXNvdXJjZUNhY2hlW2tdKSB7XG4gICAgICAgICAgICByZWFkeSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlYWR5O1xufVxuXG4vKipcbiAqIFRoaXMgZnVuY3Rpb24gd2lsbCBhZGQgYSBmdW5jdGlvbiB0byB0aGUgY2FsbGJhY2sgc3RhY2sgdGhhdCBpcyBjYWxsZWRcbiAqIHdoZW4gYWxsIHJlcXVlc3RlZCBpbWFnZXMgYXJlIHByb3Blcmx5IGxvYWRlZC5cbiAqL1xuY29uc3Qgb25SZWFkeSA9IGNhbGxiYWNrID0+IHtcbiAgICByZWFkeUNhbGxiYWNrcy5wdXNoKGNhbGxiYWNrKTtcbn1cblxuLyoqXG4gKiBUaGlzIG9iamVjdCBkZWZpbmVzIHRoZSBwdWJsaWNseSBhY2Nlc3NpYmxlIGZ1bmN0aW9ucyBhdmFpbGFibGUgdG9cbiAqIGRldmVsb3BlcnMgYnkgY3JlYXRpbmcgYSBnbG9iYWwgUmVzb3VyY2VzIG9iamVjdC5cbiAqL1xuY29uc3QgUmVzb3VyY2VzID0ge1xuICAgIGdldCxcbiAgICBpc1JlYWR5LFxuICAgIGxvYWQsXG4gICAgb25SZWFkeVxufTtcblxuZXhwb3J0IHtSZXNvdXJjZXN9O1xuIiwiY29uc3QgZ2V0UmFuZG9tTnVtYmVyID0gKG1pbiwgbWF4KSA9PiAoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4pKSArIG1pbjtcblxuY29uc3QgZ2V0UmFuZG9tSW50ID0gKG1pbiwgbWF4KSA9PiBNYXRoLmZsb29yKGdldFJhbmRvbU51bWJlcihtaW4sIG1heCkpO1xuXG5jb25zdCBmb3JtYXRUaW1lVG9TdHJpbmcgPSBtcyA9PiB7XG4gICAgbGV0IGZvcm1hdHRlZFRpbWVQYXJ0cyA9IFtdO1xuICAgIGxldCBkYXlUb01zID0gMjQgKiA2MCAqIDYwICogMTAwMDtcbiAgICBsZXQgaG91clRvTXMgPSA2MCAqIDYwICogMTAwMDtcbiAgICBsZXQgbWludXRlVG9NcyA9IDYwICogMTAwMDtcbiAgICBsZXQgc2Vjb25kVG9NcyA9IDEwMDA7XG5cbiAgICBsZXQgZGF5cyA9IE1hdGguZmxvb3IobXMgLyBkYXlUb01zKTtcbiAgICBsZXQgaG91cnMgPSBNYXRoLmZsb29yKChtcyAtIChkYXlzICogZGF5VG9NcykpIC8gaG91clRvTXMpO1xuICAgIGxldCBtaW51dGVzID0gTWF0aC5mbG9vcigobXMgLSAoaG91cnMgKiBob3VyVG9NcykpIC8gbWludXRlVG9Ncyk7XG4gICAgbGV0IHNlY29uZHMgPSBNYXRoLmZsb29yKChtcyAtIChtaW51dGVzICogbWludXRlVG9NcykpIC8gc2Vjb25kVG9Ncyk7XG5cbiAgICBpZiAoZGF5cykge1xuICAgICAgICBmb3JtYXR0ZWRUaW1lUGFydHMucHVzaChgJHtkYXlzfWRgKTtcbiAgICB9XG4gICAgaWYgKGhvdXJzIHx8IGZvcm1hdHRlZFRpbWVQYXJ0cy5sZW5ndGgpIHtcbiAgICAgICAgZm9ybWF0dGVkVGltZVBhcnRzLnB1c2goYCR7aG91cnN9aGApO1xuICAgIH1cbiAgICBpZiAobWludXRlcyB8fCBmb3JtYXR0ZWRUaW1lUGFydHMubGVuZ3RoKSB7XG4gICAgICAgIGZvcm1hdHRlZFRpbWVQYXJ0cy5wdXNoKGAke21pbnV0ZXN9bWApO1xuICAgIH1cbiAgICBpZiAoc2Vjb25kcyB8fCBmb3JtYXR0ZWRUaW1lUGFydHMubGVuZ3RoKSB7XG4gICAgICAgIGZvcm1hdHRlZFRpbWVQYXJ0cy5wdXNoKGAke3NlY29uZHN9c2ApO1xuICAgIH1cblxuICAgIHJldHVybiBmb3JtYXR0ZWRUaW1lUGFydHMuam9pbihcIiBcIik7XG59XG5cbmV4cG9ydCB7Z2V0UmFuZG9tTnVtYmVyLCBnZXRSYW5kb21JbnQsIGZvcm1hdFRpbWVUb1N0cmluZ307XG4iXX0=

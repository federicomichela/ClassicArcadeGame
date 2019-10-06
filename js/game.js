class ArcadeGame {
    constructor(onLevelCompleted) {
        this._onLevelCompletedCallback = onLevelCompleted;
    }

    /**
     * Initialise game by loading the game assets,
     * creating the game canvas, player and enemies
     * and starting the renderering loop
     *
     * @private
     */
    initialise(level, playerCharacter) {
        this._startTime = new Date();
        this._stopTime = null;
        this._lastTime = new Date();
        this._selectedLevel = level;
        this._selectedCharacter = playerCharacter;
        this._assetsReady = false;
        this._assets = [
            'images/stone-block.png',
            'images/water-block.png',
            'images/grass-block.png',
            'images/enemy-bug.png',
            `images/${CHARACTERS[this._selectedCharacter].assetPath}`
        ];
        this._gameCompleted = false;
        this._requestFrameID = null;

        // create game canvas
        this._canvas = document.createElement('canvas');
        this._canvas.width = 505;
        this._canvas.height = 606;
        this._canvas.id = "gameCanvas";
        document.querySelector("#gameContainer").appendChild(this._canvas);

        // create characters
        this._allEnemies = [...new Array(ENEMIES[this._selectedLevel])].map(() => new Enemy());
        this._player = new Player(this._selectedCharacter);

        // load resources
        Resources.load(this._assets);

        if (Resources.isReady()) {
            this.update();
        } else {
            Resources.onReady(this.update.bind(this));
        }

    	// removeHomeListeners();
    	// addGameListeners();

    	// sounds.gameTheme.play();
    }

    /**
	* Returns the level of the game
	*
	* @returns {Number} (for a list of available levels see GAME_LEVELS const)
	*/
	getLevel() {
		return this._selectedLevel;
	}

	/**
	* Method to get the time passed from the start of the game.
	* If the game is completed will always return the total time of the game.
	* NOTE: this method returns a nicely formatted string as "(dd::)hh:mm:ss"
	*
	* @returns {String}
	*/
	getElapsedTime() {
		let endTime = this._stopTime ? this._stopTime : new Date();
		let msElapsed = endTime - this._startTime;
		let formattedElapsedTime = formatTimeToString(msElapsed);

		return formattedElapsedTime;
	}

    /**
     * Check if the game has been completed
     *
     * @return {Boolean}
     */
    gameCompleted() {
        return this._gameCompleted;
    }

    /**
     * Get the star rating.
     * Star Rating is computed by checking the ratio between the lifespan
     * and the time elapsed.
     *
     * @return {Number}
     */
    getStarRating() {
        let lifespanRatio = (10-this._player.getLifespan()) * 0.5;
        let timeRatio = (this._stopTime - this._startTime) > 15000 ? (15000 - this._stopTime - this._startTime) * 0.5 : 0;
        let starRating = 100 + timeRatio - lifespanRatio;
        return starRating;
    }

    /**
     * Clear canvas, remove it from the DOM and reset all game attributes
     */
    destroy() {
        let ctx = this._canvas.getContext('2d');

        ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

        this._canvas.remove();

        window.cancelAnimationFrame(this._requestFrameID);

        this._allEnemies = [];
        this._player = [];
        this._gameCompleted = true;
    }

    /**
     * Updates enemies and player position,
     * checks if player touched a ladybird (checkCollisions),
     * checks if the player has reached the water (gameCompleted).
     * Recursive method on next frame.
     *
     * @private
     */
    update() {
        let now = Date.now();
        let dt = (now - this._lastTime) / 1000.0;

        // update characters positions
        this._allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        this._player.update();

        // check for collisions
        if (this._checkCollisions()) {
            this._player.onLadybirdTouch();
        }

        // check if the game is completed
        this._gameCompleted = this._player.hasReachedWater();

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
     * Check if a player has touched a ladybird
     *
     * @return {Boolean} collision
     * @private
     */
    _checkCollisions() {
        let collision = false;

        for (let enemy of this._allEnemies) {
            collision = ((this._player.getPositionX() >= enemy.getPositionX() - 50) &&
                         (this._player.getPositionX() <= enemy.getPositionX() + 50)) &&
                        ((this._player.getPositionY() >= enemy.getPositionY() - 37) &&
                         (this._player.getPositionY() <= enemy.getPositionY() + 37));
            if (collision) {
                break;
            }
        }

        return collision;
    }

    /**
     * Redraw the whole canvas with all characters in their updated positions
     *
     * @private
     */
    _render() {
        let ctx = this._canvas.getContext('2d');

        // add game background to canvas
        let rowImages = [
                'images/water-block.png',   // Top row is water
                'images/stone-block.png',   // Row 1 of 3 of stone
                'images/stone-block.png',   // Row 2 of 3 of stone
                'images/stone-block.png',   // Row 3 of 3 of stone
                'images/grass-block.png',   // Row 1 of 2 of grass
                'images/grass-block.png'    // Row 2 of 2 of grass
            ];
        let numRows = 6;
        let numCols = 5;

        // Before drawing, clear existing canvas
        ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

        // Loop through the number of rows and columns we've defined above
        // and, using the rowImages array, draw the correct image for that
        // portion of the "grid"
        for (let row = 0; row < numRows; row++) {
            for (let col = 0; col < numCols; col++) {
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }

        // renderer characters
        this._allEnemies.forEach(function(enemy) {
            enemy.render();
        });

        this._player.render();
    }

    /**
     * Display game result dialog with updated level's informations
     *
     * @private
     */
    _onLevelCompleted() {
        this._stopTime = new Date();

        this._onLevelCompletedCallback();
    }
}

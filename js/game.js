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
        this._gameContainer = document.querySelector("#gameContainer");
        this._startTime = new Date();
        this._stopTime = null;
        this._lastTime = new Date();
        this._selectedLevel = level;
        this._selectedCharacter = playerCharacter;
        this._assetsReady = false;
        this._assets = [
            'images/assets/stone-block.png',
            'images/assets/water-block.png',
            'images/assets/grass-block.png',
            'images/assets/enemy-bug.png',
            `images/assets/${CHARACTERS[this._selectedCharacter].assetPath}`
        ];
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
        return this._player.getLifespan() * 100 / MAX_LIFESPAN;
    }

    /**
     * Clear canvas, remove it from the DOM and reset all game attributes
     */
    destroy() {
        let ctx = this._canvas.getContext('2d');

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
    update() {
        let now = Date.now();
        let dt = (now - this._lastTime) / 1000.0;

        // update characters positions
        this._allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });

        if (this._player.positionUpdated()) {
            this._player.update();
            this.startAudio("step");
        }

        // check for collisions
        if (this._checkCollisions() && !this._player.animatingCollistion()) {
            this._player.onLadybirdTouch();
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
    pauseAudio(trackName) {
        if (trackName) {
            GAME_SOUNDS[trackName].audio.pause();
        } else {
            for (let sound in GAME_SOUNDS) {
                GAME_SOUNDS[sound].audio.pause();
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
    startAudio(trackName, force=true) {
        if (typeof trackName === "boolean") {
            force = trackName;
            trackName = null;
        }

        if (trackName) {
            if (force || GAME_SOUNDS[trackName].playing) {
                GAME_SOUNDS[trackName].audio.play();
                GAME_SOUNDS[trackName].playing = true;
            }
        } else {
            for (let sound in GAME_SOUNDS) {
                if (force || GAME_SOUNDS[sound].playing) {
                    GAME_SOUNDS[sound].audio.play();
                    GAME_SOUNDS[sound].playing = true;
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
    stopAudio(trackName) {
        if (trackName) {
            GAME_SOUNDS[trackName].audio.pause();
            GAME_SOUNDS[trackName].audio.load();
            GAME_SOUNDS[trackName].playing = false;
        } else {
            for (let sound in GAME_SOUNDS) {
                GAME_SOUNDS[sound].audio.pause();
                GAME_SOUNDS[sound].audio.load();
                GAME_SOUNDS[sound].playing = false;
        	}
        }
    }

    /**
     * Support method to create the lifespan bar for the player.
     *
     * @private
     */
    _createLifeSpanBar() {
        let progressBarOuter = document.createElement("div");
        let progressBarInner = document.createElement("div");

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
    _initialiseGameContainer() {
        // create game canvas
        this._canvas = document.createElement('canvas');
        this._canvas.width = 505;
        this._canvas.height = 606;
        this._canvas.id = "gameCanvas";
        this._gameContainer.appendChild(this._canvas);

        // create characters
        this._allEnemies = [...new Array(ENEMIES[this._selectedLevel])].map(() => new Enemy());
        this._player = new Player(this._selectedCharacter, this._lifeSpanBar);

        // load resources
        Resources.load(this._assets);

        if (Resources.isReady()) {
            this.update();
        } else {
            Resources.onReady(this.update.bind(this));
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

    _checkAudio() {
        if (!this._audioPaused) {
            let onScreen = [];

            this._allEnemies.forEach( enemy => onScreen.push(enemy.onScreen()) );

            // if no bugs are on screen, pause audio
            if (onScreen.every(x => !x)) {
                this.stopAudio("crawl");
            } else if (!GAME_SOUNDS.crawl.playing){
                this.startAudio("crawl");
            }
        }
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
                'images/assets/water-block.png',   // Top row is water
                'images/assets/stone-block.png',   // Row 1 of 3 of stone
                'images/assets/stone-block.png',   // Row 2 of 3 of stone
                'images/assets/stone-block.png',   // Row 3 of 3 of stone
                'images/assets/grass-block.png',   // Row 1 of 2 of grass
                'images/assets/grass-block.png'    // Row 2 of 2 of grass
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
        let trackName = "jingle" + (this._player.alive()?"Win":"Loose");
        console.info(trackName)

        this._stopTime = new Date();

        this._onLevelCompletedCallback();
        this.startAudio(trackName);
    }
}

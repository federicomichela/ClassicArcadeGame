class ArcadeGame {
    constructor() {
        this._lastTime = null;
        this._selectedCharacter = null;
        this._assetsReady = false;

        this._initHomeScreen();
    }

    _initHomeScreen() {
        // load game levels
        for (let key in GAME_LEVELS) {
            let value = GAME_LEVELS[key];
            let frontFace = document.createElement("div");
            let backFace = document.createElement("div");
            let button = document.createElement("button");

            frontFace.classList.add("flip-face", "flip-face-front");
            backFace.classList.add("flip-face", "flip-face-back");
            button.classList.add("btn-level", "flip", "flip-vertical");

            frontFace.innerText = `x${ENEMIES[key]}`;
            backFace.innerText = value;

            button.setAttribute("data-level", key);

            button.appendChild(frontFace);
            button.appendChild(backFace);

            if (key === "0") {
                button.classList.add("selected");
            }

            document.querySelector("#homeSection #levelOptions").appendChild(button);
        };

        // load game characters
        for (let character in CHARACTERS) {
            let assetPath = CHARACTERS[character].assetPath;
            let characterObj = document.createElement("div");

            characterObj.style.backgroundImage = `url("images/${assetPath}")`;
            characterObj.classList.add("character-entry");
            characterObj.setAttribute("data-id", character);

            document.querySelector("#charactersList").appendChild(characterObj);
        }
        document.querySelector("#charactersList .character-entry:nth-child(1)").classList.add("selected");
        this._updateSelectedCharacter();

        this._addHomeListeners();
    }

    _initGameScreen() {
        // create the canvas
        this._canvas = document.createElement('canvas');
        this._ctx = canvas.getContext('2d');

        this._canvas.width = 505;
        this._canvas.height = 606;
        this._canvas.id = "gameCanvas";

        querySelector("#gameGrid").appendChild(canvas);

        // load the resources
        Resources.load([
            'images/stone-block.png',
            'images/water-block.png',
            'images/grass-block.png',
            'images/enemy-bug.png',
            'images/char-boy.png'
        ]);
        Resources.onReady(this._onAssetsReady.bind(this));
    }

    _onResourcesLoaded() {
        this._assetsReady = true;
    }

    _updateSelectedCharacter() {
        let selectedCharacter = document.querySelector("#charactersList .character-entry.selected");
        let selectedObjImg = document.querySelector("#characterSelected div:nth-child(1)");
        let selectedObjName = document.querySelector("#characterSelected div:nth-child(2)");
        let character = selectedCharacter.getAttribute("data-id");

        selectedObjImg.style.backgroundImage = selectedCharacter.style.backgroundImage;
        selectedObjName.innerText = CHARACTERS[character].name;

        this._selectedCharacter = character;
    }

    /*
     * Listen to a click event on the level buttons to select it.
     * Also listen to the resume button to go back to the game without restarting it.
     */
    _addHomeListeners() {
        document.getElementById("levelOptions").addEventListener("click", this._selectLevel.bind(this));
        document.getElementById("levelCharacter").addEventListener("click", this._onCharacterSelected.bind(this))
    	document.querySelector(".btn-resume").addEventListener("click", this._loadGame.bind(this));
    }

    /*
     * Stop listening to the interactions on the level and resume buttons.
     */
    _removeHomeListeners() {
    	document.getElementById("levelOptions").removeEventListener("click", this._selectLevel.bind(this));
    	document.querySelector(".btn-resume").removeEventListener("click", this._loadGame.bind(this));
    }

    /*
     * Event callback method to select a level
     * @param event {Object}
     */
    _selectLevel(event) {
    	if (event.target.classList.contains("btn-level")) {
    		// remove selection from currently selected button
    		let currentlySelectedButton = document.querySelector(".btn-level.selected");
    		if (currentlySelectedButton) {
    			currentlySelectedButton.classList.remove("selected")
    		}
    		// add selection to the button that has just been clicked
    		event.target.classList.add("selected");

    		// eventually disable resume option
    		this._checkResumeButton();
    	}
    }

    /**
     * Add loading class to clicked button then show the game page
     *
     * @param {Object} event
     */
    _loadGame(event) {
    	let callback = startGame;
    	event.target.classList.add("loading");

    	if (event.target.classList.contains("btn-resume")) {
    		callback = showGame;
    	}

    	setTimeout(() => {
    		for (let loadingElement of document.querySelectorAll(".loading")) {
    			loadingElement.classList.remove("loading");
    		}

    		callback();
    	}, 1000);
    }

    /**
     * Disable resume button when selected level button does not match with current
     * game level. Enable otherwise.
     */
    _checkResumeButton() {
    	let resumeBtn = document.querySelector(".btn-resume");
    	let selectedLevelButton = document.querySelector(".btn-level.selected");

    	if (!resumeBtn.classList.contains("hidden")) {
    		if (selectedLevelButton.dataset.level != gameMatch.getLevel()) {
    			resumeBtn.disabled = true;
    		} else {
    			resumeBtn.disabled = false;
    		}
    	}
    }

    _onCharacterSelected(event) {
        if (event.target.classList.contains("character-entry")) {
            document.querySelector("#charactersList .character-entry.selected").classList.remove("selected");
            event.target.classList.add("selected");

            this._updateSelectedCharacter();
        }
    }
}

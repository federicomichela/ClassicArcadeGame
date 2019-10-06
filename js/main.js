let gameMatch, clockID, checkGameFocusIntervalID;
let gameThemePaused = false;
let sounds = {
	"gameTheme": new Audio("audio/celticTheme.wav"),
	"pairMatch": new Audio("audio/matchFound.wav"),
	"wrongMatch": new Audio("audio/wrongMatch.wav"),
	"levelComplete": new Audio("audio/levelComplete.mp3"),
}

sounds.gameTheme.loop = true;

function initialiseHomePage() {
	this.loadGameLevels();
	this.loadGameCharacters();
}

function loadGameLevels() {
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
			this._selectedLevel = key;
		}

		document.querySelector("#homeSection #levelOptions").appendChild(button);
	};
}

function loadGameCharacters() {
	for (let character in CHARACTERS) {
		let assetPath = CHARACTERS[character].assetPath;
		let characterObj = document.createElement("div");

		characterObj.style.backgroundImage = `url("images/${assetPath}")`;
		characterObj.classList.add("character-entry");
		characterObj.setAttribute("data-id", character);

		document.querySelector("#charactersList").appendChild(characterObj);
	}
	document.querySelector("#charactersList .character-entry:nth-child(1)").classList.add("selected");
	updateSelectedCharacter();
}

/**
 * Updated the character selected for the Player
 */
function updateSelectedCharacter() {
	let selectedCharacter = document.querySelector("#charactersList .character-entry.selected");
	let selectedObjImg = document.querySelector("#characterSelected div:nth-child(1)");
	let selectedObjName = document.querySelector("#characterSelected div:nth-child(2)");
	let character = selectedCharacter.getAttribute("data-id");

	selectedObjImg.style.backgroundImage = selectedCharacter.style.backgroundImage;
	selectedObjName.innerText = CHARACTERS[character].name;

	this._selectedCharacter = character;
}

/**
 * Update player character
 */
function selectCharacter(event) {
	if (event.target.classList.contains("character-entry")) {
		document.querySelector("#charactersList .character-entry.selected").classList.remove("selected");
		event.target.classList.add("selected");

		updateSelectedCharacter();
	}
}

/**
 * Pause game theme sound when page loses focus
 */
function checkGameFocus() {
	if (!document.hasFocus()) {
		sounds.gameTheme.pause();
		gameThemePaused = true;
	} else {
		if (gameThemePaused) {
			// sounds.gameTheme.play();
			gameThemePaused = false;
		}
	}
}

/*
 * Show home page section (hide all the others)
 */
function showHome() {
	document.getElementById("homeSection").classList.remove("hidden");
	document.getElementById("gameSection").classList.add("hidden");

	if (!document.getElementById("gameResultSection").classList.contains("hidden")) {
		dismissGameResult();
	}

	addHomeListeners();
	removeGameListeners();
	checkResumeButton();

	sounds.gameTheme.pause();
}

/*
 * Show game section (hide all the others)
 */
function showGame() {
	document.getElementById("homeSection").classList.add("hidden");
	document.getElementById("gameSection").classList.remove("hidden");

	if (!document.getElementById("gameResultSection").classList.contains("hidden")) {
		dismissGameResult();
	}

	removeHomeListeners();
	addGameListeners();

	// sounds.gameTheme.play();
}

/*
 * Show game result "dialog"
 */
function showGameResult() {
	if (!gameMatch.gameCompleted()) { return; }

	document.getElementById("gameResultSection").classList.remove("hidden");

	// to simulate a real dialog prevent page scrolling by hiding overflow
	document.querySelector("body").classList.add("full-screen");

	// update dialog with game results
	document.getElementById("gameTotalTime").innerText = `Total time: ${gameMatch.getElapsedTime()}`;

	// update stars rating
	let rating = gameMatch.getStarRating();
	let starRate = 100 / MAX_STARS;
	for (let star of document.querySelectorAll(".star")) {
		if (rating - starRate > 0) {
			star.querySelector(".star-inner").style.width = "100%";
			rating -= starRate;
		} else if (rating > 0) {
			let starPerc = (100 * rating) / starRate;
			star.querySelector(".star-inner").style.width = `${starPerc}%`;
			rating -= starRate;
		} else {
			star.querySelector(".star-inner").style.width = "0%";
		}
	}

	for (let sound in sounds) {
		sounds[sound].pause();
		sounds[sound].load();
	}
	// sounds.levelComplete.play();

	disableResumeButtons();
	removeHomeListeners();
	removeGameListeners();
	addGameResultListeners();
}

/*
 * Hide game result dialog
 */
function dismissGameResult() {
	document.getElementById("gameResultSection").classList.add("hidden");

	// re-enable overflow on page
	document.querySelector("body").classList.remove("full-screen");

	removeGameResultListeners();
}

/*
 * Update the level and start clock in the game page
 */
function updateGameInfos() {
	clearInterval(clockID);
	clockID = setInterval(() => {
		document.getElementById("gameTimeElapsed").innerText = gameMatch.getElapsedTime();
	}, 1000);

	document.getElementById("gameLevelDescription").innerText = `Level ${GAME_LEVELS[gameMatch.getLevel()]}`;
}

/**
 * Make resume buttons available
 */
function enableResumeButtons() {
	for (let btn of document.querySelectorAll(".btn-resume")) {
		btn.classList.remove("hidden");
	}
}

/**
 * Make resume buttons unavailable
 */
function disableResumeButtons() {
	for (let btn of document.querySelectorAll(".btn-resume")) {
		btn.classList.add("hidden");
	}
}

/**
 * Disable resume button when selected level button does not match with current
 * game level. Enable otherwise.
 */
function checkResumeButton() {
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

/*
 * Start a new game on a specified level
 * @param level {Number}
 */
function initialiseGame(level) {
	let selectedCharacter = document.querySelector("#charactersList .selected").getAttribute("data-id");

	if (gameMatch) {
		gameMatch.destroy();
	} else {
		gameMatch = new ArcadeGame(level, selectedCharacter);
	}

	gameMatch.initialise(level, selectedCharacter);

	enableResumeButtons();
	showGame();
	updateGameInfos();
}

/*
 * Start a new game from the selected level
 */
function startGame() {
	let levelSelected = document.querySelector(".btn-level.selected").dataset.level;

	sounds.gameTheme.load();

	initialiseGame(levelSelected);
}

/*
 * Start a new game from the current game level
 */
function resetGame() {
	let level = gameMatch.getLevel();

	initialiseGame(level);
}

/*
 * Reset to a new game with higher level
 */
function levelUp() {
	let nextLevel = parseInt(gameMatch.getLevel()) + 1;

	initialiseGame(nextLevel);
}

/*
 * Event callback method to select a level
 * @param event {Object}
 */
function selectLevel(event) {
	if (event.target.classList.contains("btn-level")) {
		// remove selection from currently selected button
		let currentlySelectedButton = document.querySelector(".btn-level.selected");
		if (currentlySelectedButton) {
			currentlySelectedButton.classList.remove("selected")
		}
		// add selection to the button that has just been clicked
		event.target.classList.add("selected");

		// eventually disable resume option
		checkResumeButton();
	}
}

/*
 * Callback method to update the DOM based on the result returned by flipping
 * a card.
 * @param result {Object}
 */
function onActionResultReceived(result) {
	switch (result.action) {
		case GAME_ACTIONS.retry:
			setTimeout(shakePair.bind(this, result.pair), 1000);
			setTimeout(coverPair.bind(this, result.pair), 1500);
			break;
		case GAME_ACTIONS.match:
			setTimeout(matchPair.bind(this, result.pair), 750 );

			if (result.completed) {
				// stop clock on game page
				clearInterval(clockID);

				setTimeout(showGameResult, 2000);
			}

			break;
		case GAME_ACTIONS.wait:
			addGameListeners();
			break;
	}
}

/**
 * Add loading class to clicked button then show the game page
 *
 * @param {Object} event
 */
function loadGame(event) {
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

/*
 * Listen to a click event on the level buttons to select it.
 * Also listen to the resume button to go back to the game without restarting it.
 */
function addHomeListeners() {
	document.getElementById("levelCharacter").addEventListener("click", selectCharacter);
	document.getElementById("levelOptions").addEventListener("click", selectLevel);
	document.querySelector(".btn-resume").addEventListener("click", loadGame);
}

/*
 * Stop listening to the interactions on the level and resume buttons.
 */
function removeHomeListeners() {
	document.getElementById("levelOptions").removeEventListener("click", selectLevel);
	document.querySelector(".btn-resume").removeEventListener("click", loadGame);
}

/*
 * Listen to a click event on each card in the grid in order to flip the card
 */
function addGameListeners() {
	checkGameFocusIntervalID = setInterval(checkGameFocus, 300);
}

/*
 * Stop listening to the interactions on the cards
 */
function removeGameListeners() {
clearInterval(checkGameFocusIntervalID);
}

/*
 * Listen to a click even on the level up button
 */
function addGameResultListeners() {
	document.querySelector("#gameResultSection .dialog .btn-levelup").addEventListener("click", levelUp);
}


/*
 * Stop listening to the level up button click
 */
function removeGameResultListeners() {
	document.querySelector("#gameResultSection .dialog .btn-levelup").removeEventListener("click", levelUp);
}

/*
 * Listen to a click event on all the buttons in the pages
 */
function addNavigationListeners() {
	// when a start or reset button is clicked, initialise a new game with the selected level
	let startGameButtons = document.querySelectorAll(".btn-start");
	for (let btn of startGameButtons) {
		btn.addEventListener("click", loadGame);
	}

	let resetGameButtons = document.querySelectorAll(".btn-reset");
	for (let btn of resetGameButtons) {
		btn.addEventListener("click", resetGame);
	}

	// when an home button is clicked, show the home section
	let homeButtons = document.querySelectorAll(".btn-home");
	for (let btn of homeButtons) {
		btn.addEventListener("click", showHome);
	}
}

document.addEventListener('DOMContentLoaded', (event) => {
	initialiseHomePage();
	addNavigationListeners();
	addHomeListeners();
});

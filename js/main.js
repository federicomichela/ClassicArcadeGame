import {MAX_STARS, GAME_LEVELS, ENEMIES, CHARACTERS, GAME_SOUNDS} from "./const.js";
import {ArcadeGame} from "./game.js";

let checkGameFocusIntervalID = null,
	clockID = null,
	gameMatch = null;

const initialiseHomePage = () => {
	"use strict";

	loadGameLevels();
	loadGameCharacters();
}

const loadGameLevels = () => {
	"use strict";

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
	}
};

const loadGameCharacters = () => {
	"use strict";

	for (let character in CHARACTERS) {
		let {assetPath} = CHARACTERS[character];
		let characterObj = document.createElement("div");

		characterObj.style.backgroundImage = `url("images/assets/${assetPath}")`;
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
const updateSelectedCharacter = () => {
	"use strict";

	let selectedCharacter = document.querySelector("#charactersList .character-entry.selected");
	let selectedObjImg = document.querySelector("#characterSelected div:nth-child(1)");
	let selectedObjName = document.querySelector("#characterSelected div:nth-child(2)");
	let character = selectedCharacter.getAttribute("data-id");

	selectedObjImg.style.backgroundImage = selectedCharacter.style.backgroundImage;
	selectedObjName.innerText = CHARACTERS[character].name;
}

/**
 * Update player character
 */
const selectCharacter = event => {
	"use strict";

	if (event.target.classList.contains("character-entry")) {
		document.querySelector("#charactersList .character-entry.selected").classList.remove("selected");
		event.target.classList.add("selected");

		updateSelectedCharacter();
	}
}

/**
 * Pause game theme sound when page loses focus
 */
const checkGameFocus = () => {
	"use strict";

	if (document.hasFocus()) {
		gameMatch.startAudio(false);
	} else {
		gameMatch.pauseAudio();
	}
}

/*
 * Show home page section (hide all the others)
 */
const showHome = () => {
	"use strict";

	document.getElementById("homeSection").classList.remove("hidden");
	document.getElementById("gameSection").classList.add("hidden");

	if (!document.getElementById("gameResultSection").classList.contains("hidden")) {
		dismissGameResult();
	}

	addHomeListeners();
	removeGameListeners();
	checkResumeButton();
}

/*
 * Show game section (hide all the others)
 */
const showGame = () => {
	"use strict";

	document.getElementById("homeSection").classList.add("hidden");
	document.getElementById("gameSection").classList.remove("hidden");

	if (!document.getElementById("gameResultSection").classList.contains("hidden")) {
		dismissGameResult();
	}

	removeHomeListeners();
	addGameListeners();
}

/*
 * Show game result "dialog"
 */
const showGameResult = success => {
	"use strict";

	if (!gameMatch.gameCompleted()) {
		return;
	}

	let gameResultSection = document.getElementById("gameResultSection");

	gameResultSection.classList.remove("hidden");

	// to simulate a real dialog prevent page scrolling by hiding overflow
	document.querySelector("body").classList.add("full-screen");

	// update dialog with game results
	gameResultSection.querySelector("#gameResultText").innerText = success? "Level Completed!" : "You Lost ☹";
	gameResultSection.querySelector("#gameTotalTime").innerText = `Total time: ${gameMatch.getElapsedTime()}`;

	// update stars rating
	let rating = gameMatch.getStarRating();
	let starRate = 100 / MAX_STARS;
	for (let star of gameResultSection.querySelectorAll(".star")) {
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

	disableResumeButtons();
	removeHomeListeners();
	removeGameListeners();
	addGameResultListeners();
}

/*
 * Hide game result dialog
 */
const dismissGameResult = () => {
	"use strict";

	document.getElementById("gameResultSection").classList.add("hidden");

	// re-enable overflow on page
	document.querySelector("body").classList.remove("full-screen");

	removeGameResultListeners();
}

/*
 * Update the level and start clock in the game page
 */
const updateGameInfos = () => {
	"use strict";

	clearInterval(clockID);
	clockID = setInterval(() => {
		document.getElementById("gameTimeElapsed").innerText = gameMatch.getElapsedTime();
	}, 1000);

	document.getElementById("gameLevelDescription").innerText = `Level ${GAME_LEVELS[gameMatch.getLevel()]}`;
}

/**
 * Make resume buttons available
 */
const enableResumeButtons = () => {
	"use strict";

	for (let btn of document.querySelectorAll(".btn-resume")) {
		btn.classList.remove("hidden");
	}
}

/**
 * Make resume buttons unavailable
 */
const disableResumeButtons = () => {
	"use strict";

	for (let btn of document.querySelectorAll(".btn-resume")) {
		btn.classList.add("hidden");
	}
}

/**
 * Disable resume button when selected level button does not match with current
 * game level. Enable otherwise.
 */
const checkResumeButton = () => {
	"use strict";

	let resumeBtn = document.querySelector(".btn-resume");
	let selectedLevelButton = document.querySelector(".btn-level.selected");

	if (!resumeBtn.classList.contains("hidden")) {
		if (selectedLevelButton.dataset.level === gameMatch.getLevel()) {
			resumeBtn.disabled = false;
		} else {
			resumeBtn.disabled = true;
		}
	}
}

/*
 * Start a new game on a specified level
 * @param level {Number}
 */
const initialiseGame = level => {
	"use strict";

	let selectedCharacter = document.querySelector("#charactersList .selected").getAttribute("data-id");

	if (gameMatch) {
		gameMatch.destroy();
	} else {
		gameMatch = new ArcadeGame(showGameResult);
	}

	gameMatch.initialise(level, selectedCharacter);

	enableResumeButtons();
	showGame();
	updateGameInfos();
}

/*
 * Start a new game from the selected level
 */
const startGame = () => {
	"use strict";

	let levelSelected = document.querySelector(".btn-level.selected").dataset.level;

	initialiseGame(levelSelected);
}

/*
 * Start a new game from the current game level
 */
const resetGame = () => {
	"use strict";

	let level = gameMatch.getLevel();

	initialiseGame(level);
}

/*
 * Reset to a new game with higher level
 */
const levelUp = () => {
	"use strict";

	let nextLevel = parseInt(gameMatch.getLevel(), 10) + 1;

	initialiseGame(nextLevel);
}

/*
 * Event callback method to select a level
 * @param event {Object}
 */
const selectLevel = event => {
	"use strict";

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

/**
 * Add loading class to clicked button then show the game page
 *
 * @param {Object} event
 */
const loadGame = event => {
	"use strict";

	let callback = startGame;
	event.target.classList.add("loading");

	if (event.target.classList.contains("btn-resume")) {
		callback = () => {
			showGame();
			gameMatch.startAudio(false);
		}
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
const addHomeListeners = () => {
	"use strict";

	document.getElementById("levelCharacter").addEventListener("click", selectCharacter);
	document.getElementById("levelOptions").addEventListener("click", selectLevel);
	document.querySelector(".btn-resume").addEventListener("click", loadGame);
}

/*
 * Stop listening to the interactions on the level and resume buttons.
 */
const removeHomeListeners = () => {
	"use strict";

	document.getElementById("levelOptions").removeEventListener("click", selectLevel);
	document.querySelector(".btn-resume").removeEventListener("click", loadGame);
}

/*
 * Listen to a click event on each card in the grid in order to flip the card
 */
const addGameListeners = () => {
	"use strict";

	checkGameFocusIntervalID = setInterval(checkGameFocus, 300);
}

/*
 * Stop listening to the interactions on the cards
 */
const removeGameListeners = () => {
	"use strict";

	clearInterval(checkGameFocusIntervalID);
	gameMatch.pauseAudio();
}

/*
 * Listen to a click even on the level up button
 */
const addGameResultListeners = () => {
	"use strict";

	document.querySelector("#gameResultSection .dialog .btn-levelup").addEventListener("click", levelUp);
}

/*
 * Stop listening to the level up button click
 */
const removeGameResultListeners = () => {
	"use strict";

	document.querySelector("#gameResultSection .dialog .btn-levelup").removeEventListener("click", levelUp);
}

/*
 * Listen to a click event on all the buttons in the pages
 */
const addNavigationListeners = () => {
	"use strict";

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

/**
 * Support method to reduce tracks volume,
 * initialise loopable tracks and initialise listeners for track completion
 * to update the track state.
 */
const settleAudioTracks = () => {
	"use strict";

	GAME_SOUNDS.gameTheme.audio.loop = true;
	GAME_SOUNDS.gameTheme.audio.volume = 0.5;
	GAME_SOUNDS.step.audio.volume = 0.5;
	GAME_SOUNDS.jingleLoose.audio.volume = 0.2;
	GAME_SOUNDS.jingleWin.audio.volume = 0.2;
	GAME_SOUNDS.crawl.audio.loop = true;

	for (let track in GAME_SOUNDS) {
		GAME_SOUNDS[track].audio.addEventListener("ended", () => {
			GAME_SOUNDS[track].playing = false;
		});
	}
}

document.addEventListener('DOMContentLoaded', () => {
	"use strict";

	settleAudioTracks();
	initialiseHomePage();
	addNavigationListeners();
	addHomeListeners();
});

window.addEventListener('scroll', () => {
	"use strict";

	document.querySelector("#gameResultSection").style.top = `${window.scrollY}px`;
});

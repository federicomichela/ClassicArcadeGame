const MAX_STARS = 5;

const MAX_LIFESPAN = 10;

const GAME_LEVELS = {
	0: "Easy",
	1: "Classic",
	2: "Adventure"
};

const ALLOWED_KEYS = {
    37: "left",
    38: "up",
    39: "right",
    40: "down"
}

const BOUNDARIES = {
    "left": 0,
    "up": 60,
    "right": 400,
    "down": 380
}

const ENEMIES = {
    0: 3,
    1: 5,
    2: 7
}

const CHARACTERS = {
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
}

const GAME_SOUNDS = {
	"award": { "audio": new Audio("audio/award.wav"), "playing": false },
	"collision": { "audio": new Audio("audio/collision.wav"), "playing": false },
	"crawl": { "audio": new Audio("audio/crawling-bugs.wav"), "playing": false },
	"gameTheme": { "audio": new Audio("audio/theme.wav"), "playing": false },
	"jingleLoose": { "audio": new Audio("audio/jingleLoose.wav"), "playing": false },
	"jingleWin": { "audio": new Audio("audio/jingleWin.wav"), "playing": false },
	"powerUp": { "audio": new Audio("audio/powerUp.wav"), "playing": false },
	"step": { "audio": new Audio("audio/step.wav"), "playing": false },
};

export {MAX_STARS, MAX_LIFESPAN, GAME_LEVELS, ALLOWED_KEYS, BOUNDARIES, ENEMIES, CHARACTERS, GAME_SOUNDS};

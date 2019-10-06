const MAX_STARS = 5;

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
    2: 10
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

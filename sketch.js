let grid;
let player;

let worldWidth = 1000;
let worldHeight = 1000;
let cellSize = 45;
let renderScale = 0.5;

let lastMoveWasDiagonal = false;
let hasMoved = false;
let hasMovedDiagonally = false;

let treeEmojis = ["🌱", "🌳", "🌲"];
let leafEmojis = ["🍂", "🍁", "🍃"];
let flowerEmojis = ["🥀", "🌼", "🌻", "🌸", "🌹", "🌺", "🌷", "🏵️"];

let emojis = treeEmojis.concat(leafEmojis).concat(flowerEmojis);

let markov;

let justCopyPaste = false;

function setup() {

	createCanvas(windowWidth, windowHeight);

	markov = RiTa.markov(3);

	window.addEventListener("copy", copyText);
	window.addEventListener("paste", pasteText);

	angleMode(DEGREES);
	textAlign(CENTER, CENTER);
	imageMode(CENTER);
	textFont("Fira Code");
	noStroke();

	grid = new Grid(worldWidth, worldHeight);
	player = new Player();

    noLoop();
    draw();
}

function draw() {

    background("#E2E2E2");

	push();

	translate(-player.cameraX * cellSize, -player.cameraY * cellSize);

    grid.display();
    player.display();

	pop();

	displayUI();
}

function displayUI() {

	push();

	textAlign(LEFT, TOP);
	textSize(cellSize/3);

	let currentCell = grid.grid[player.x][player.y];

	if (currentCell instanceof EmptyCell == false) {
		text(currentCell.phrase, 10, 10, windowWidth-20, windowHeight-20);
	}

	pop();
}

function keyPressed() {

	if (!player) return;

	if (keyIsDown(CONTROL)) {
		return;
	}

	if (justCopyPaste) {
		justCopyPaste = false;
		return;
	}

	move();
	tend();

    draw();
}

function move() {

	if (lastMoveWasDiagonal) {
		lastMoveWasDiagonal = false;
		return;
	}

   if ((keyCode == UP_ARROW && keyIsDown(LEFT_ARROW)) || (keyCode == LEFT_ARROW && keyIsDown(UP_ARROW))) {
		player.move(-1, -1);
		lastMoveWasDiagonal = true;
		hasMovedDiagonally = true;
	} else if ((keyCode == DOWN_ARROW && keyIsDown(LEFT_ARROW)) || (keyCode == LEFT_ARROW && keyIsDown(DOWN_ARROW))) {
		player.move(-1, 1);
		lastMoveWasDiagonal = true;
		hasMovedDiagonally = true;
	} else if ((keyCode == UP_ARROW && keyIsDown(RIGHT_ARROW)) || (keyCode == RIGHT_ARROW && keyIsDown(UP_ARROW))) {
		player.move(1, -1);
		lastMoveWasDiagonal = true;
		hasMovedDiagonally = true;
	} else if ((keyCode == DOWN_ARROW && keyIsDown(RIGHT_ARROW)) || (keyCode == RIGHT_ARROW && keyIsDown(DOWN_ARROW))) {
		player.move(1, 1);
		lastMoveWasDiagonal = true;
		hasMovedDiagonally = true;
	} else if (keyCode == UP_ARROW) {
		player.move(0, -1);
	} else if (keyCode == DOWN_ARROW) {
		player.move(0, 1);
	} else if (keyCode == LEFT_ARROW) {
		player.move(-1, 0);
	} else if (keyCode == RIGHT_ARROW) {
		player.move(1, 0);
	} else {
		return;
	}

    grid.update();
}

function tend() {

	let currentCell = grid.grid[player.x][player.y];

	let bannedKeys = [BACKSPACE, DELETE, ENTER, RETURN, TAB, ESCAPE, SHIFT, CONTROL, OPTION, ALT, UP_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW];

    if (!bannedKeys.includes(keyCode) && keyCode != 91 && keyCode != 20) {
		if (currentCell instanceof EmptyCell && keyCode != 32) {
			grid.grid[player.x][player.y] = new Tree(player.x, player.y);
			currentCell = grid.grid[player.x][player.y];
		}
		if (currentCell instanceof Tree || currentCell instanceof Leaf) {
			grid.grid[player.x][player.y].addChar(key);
		}
	} else if (keyCode == DELETE || keyCode == BACKSPACE) {

		if (currentCell instanceof Tree || currentCell instanceof Leaf) {
			if (currentCell.phrase.length == 1) {
				grid.grid[player.x][player.y] = new EmptyCell(player.x, player.y);
			} else {
				grid.grid[player.x][player.y].phrase = currentCell.phrase.slice(0, -1);
			}
		}
	}
}

function copyText() {

	justCopyPaste = true;

	let currentCell = grid.grid[player.x][player.y];

	if (currentCell instanceof Tree || currentCell instanceof Leaf) {

		navigator.clipboard.writeText(currentCell.phrase);
	}
}

function pasteText() {

	justCopyPaste = true;

	navigator.clipboard.readText().then(cliptext => pasteMyText(cliptext), err => console.log(err));
}

function pasteMyText(text) {

	let currentCell = grid.grid[player.x][player.y];

	if (currentCell instanceof EmptyCell) {
		grid.grid[player.x][player.y] = new Tree(player.x, player.y, false, text);
	} else {
		grid.grid[player.x][player.y].phrase += text;
	}

	draw();
}


function mod(n, m) {
	return ((n % m) + m) % m;
}

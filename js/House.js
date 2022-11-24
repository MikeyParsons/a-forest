class House {

    constructor(x, y, fog) {

        this.x = x * cellSize;
        this.y = y * cellSize;
        this.symbol = random(houseEmojis);
        this.fog = fog;

        this.data = random(links.links)

        this.phrase = this.data.label + "\n" + this.data.link;
        this.phrase += "\n\npress ENTER to open link";

        this.offsetX = 0;
        this.offsetY = 0;
        this.scale = 1;
    }

    update() {

    }

    display() {

        push();
        translate(this.x, this.y);

        if (this.fog) {
            drawFog();
        } else {
            translate(cellSize/2, cellSize/2);
            translate(this.offsetX, this.offsetY);

            image(this.symbol, 0, 0, cellSize*.8*this.scale, cellSize*.8*this.scale);
        }

        pop();
    }
}
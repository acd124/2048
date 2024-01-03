import { Board } from './board.js'
import { Box } from './box.js'
export class Display {
    constructor(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        this.context.strokeMany = (times = 5) => { // draw darker lines around things
            for(let i = 0; i < times; i++) this.context.stroke();
        };
        this.context.textAlign = 'center'; // sets text to be centered
        
        this.board = new Board(this);
        this.scoreBoard = new Box('Score', this.board.xOffset / 2, this.board.yOffset / 2, this, () => this.board.score);
        this.pauseButton = new Box('Paused', this.width / 2, this.height / 2, this, () => "esc to resume", () => this.board.paused); // pause button
        this.endButton = new Box('Game Over', this.width / 2, this.height / 2, this, () => "R to restart", () => this.board.ended); // button to show end game
        this.winButton = new Box('YOU WON', this.width / 2, this.board.yOffset / 2, this, () => 'YAY!!!!!', () => this.board.grid.some(r => r.some(s => s?.value >= 2048)))
        this.highScore = new Box('High Score', this.width - (this.board.xOffset / 2), this.board.yOffset / 2, this, () => this.board.highScore);
        this.elements = [this.board, this.scoreBoard, this.pauseButton, this.endButton, this.winButton, this.highScore];
        this.bot = null;
        this.draw();
    }

    draw() {
        this.update();
        setTimeout(() => this.draw(), this.board.ticks ? 10 : 50);
    }

    update() { // redraw everything
        this.context.clearRect(0, 0, this.width, this.height);
        this.elements.forEach(e => e.draw());
    }

    reset(bot = null) {
        this.board.ended = true;
        this.bot?.wait();
        this.board.reset();
        this.bot = bot;
        this.bot?.makeMove();
    }

    pause() {
        if(this.board.ended) return;
        this.bot?.wait();
        this.board.paused = !this.board.paused
        if(!this.board.paused) this.bot?.makeMove();
    }

    up() {
        this.board.move('up');
    }

    down() {
        this.board.move('down');
    }

    left() {
        this.board.move('left');
    }

    right() {
        this.board.move('right');
    }
}
import { Square } from './square.js'
export class Board {
    constructor(display) {
        this.display = display; // back reference
        this.ctx = this.display.context; // drawing tool, board does all drawings for things in game
        this.width = 300;
        this.height = 300;
        this.xOffset = (this.display.width - this.width) / 2; // distance from left right
        this.yOffset = (this.display.height - this.height) / 2; // distance from top or bottom
        this.spacing = 25;
        this.gridSize = 50; // size of squares
        
        this.grid = Array.from({ length: 4 }, () => Array.from({ length: 4 }, () => null));
        this.score = 0;
        this.highScore = 0;

        this.ended = false; // if game over
        this.paused = false; // if paused

        this.instructions = [];//instructions are [[x, y], [x, y]]
        this.ticks = 0;
        this.maxTicks = 20;
    }

    reset() {
        this.ended = this.paused = false;
        this.score = 0;
        this.grid = this.futureState();
        this.spawnNew();
        this.spawnNew();
    }

    move(dir) {
        if(this.ticks || this.paused || this.ended) return;
        this.instructions = [];

        let state = this.grid;
        this.grid = this.futureState(dir, true);

        if(this.endGame()) this.ended = true;
        if(state.every((r, j) => r.every((s, i) => this.grid[j][i]?.value === s?.value))) return;
        this.grid.forEach(r => r.filter(s => s).forEach(s => s.merged = false));
        
        this.ticks = this.maxTicks;

        this.score = this.grid.flatMap(r => r).reduce((a, c) => a + (c?.value || 0), 0);
        this.highScore = this.score > this.highScore ? this.score : this.highScore;
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.rect(this.xOffset, this.yOffset, this.width, this.height);
        this.ctx.strokeMany();
        this.ctx.strokeStyle = '#A0A0A0';
        this.ctx.beginPath();
        for(let i = this.gridSize; i < this.height; i += this.gridSize + this.spacing) {
            this.ctx.moveTo(this.xOffset, this.yOffset + this.spacing + i);
            this.ctx.lineTo(this.xOffset + this.width, this.yOffset + this.spacing + i);
        }
        for(let i = this.gridSize; i < this.width; i += this.gridSize + this.spacing) {
            this.ctx.moveTo(this.xOffset + this.spacing + i, this.yOffset);
            this.ctx.lineTo(this.xOffset + this.spacing + i, this.yOffset + this.height);
        }
        this.ctx.stroke();
        this.ctx.strokeStyle = '#000000';
        
        for(let i = 0; i < this.grid.length; i++) {
            for(let j = 0; j < this.grid[i].length; j++) {
                this.drawSquare(j, i);
            }
        }
    }

    drawSquare(x, y) {
        if(!this.grid[y][x]) return;
        let instructs = this.instructions.find(instruct => instruct[1][0] === x && instruct[1][1] === y && (instruct[0][0] !== x || instruct[0][1] !== y));
        let xMoved = instructs && instructs[0][0] !== x;
        
        let xLoc = this.xOffset + (this.spacing / 2) + ((x + (instructs && xMoved ? this.ticks * (instructs[0][0] - x) / this.maxTicks : 0)) * (this.gridSize + this.spacing));
        let yLoc = this.yOffset + (this.spacing / 2) + ((y + (instructs && !xMoved ? this.ticks * (instructs[0][1] - y) / this.maxTicks : 0)) * (this.gridSize + this.spacing));

        this.ctx.beginPath();
        this.ctx.rect(xLoc, yLoc, this.gridSize, this.gridSize);
        this.ctx.strokeMany();

        this.ctx.fillStyle = this.grid[y][x].color;
        this.ctx.fillRect(xLoc + 1, yLoc + 1, this.gridSize - 2, this.gridSize - 2);

        this.ctx.font = '24px sans-serif';
        this.ctx.fillStyle = '#000000';
        this.ctx.fillText(this.grid[y][x].value, xLoc + (this.gridSize / 2), yLoc + (13 * this.gridSize / 20), this.gridSize);
        this.ctx.font = '14px sans-serif';

        if(this.ticks) {
            this.ticks--;
            if(this.ticks === 0) {
                this.spawnNew();
                this.instructions = [];
            }
        }
    }

    futureState(dir, display = false) {
        let state = Array.from({ length: 4 }, () => Array.from({ length: 4 }, () => null));
        switch(dir) {
            case 'up': {
                for(let i = 0; i < this.grid.length; i++) {//through height
                    for(let j = 0; j < this.grid[0].length; j++) {//through width
                        for(let k = 0; k <= i; k++) {
                            if(this.canMove(j, i, j, k, state, dir)) {
                                this.makeMove(j, i, j, k, state, display);
                                break;
                            }
                        }
                    }
                }
                break;
            }
            case 'down': {
                for(let i = this.grid.length - 1; i >= 0; i--) {//through height
                    for(let j = 0; j < this.grid[0].length; j++) {//through width
                        for(let k = this.grid.length - 1; k >= i; k--) {
                            if(this.canMove(j, i, j, k, state, dir)) {
                                this.makeMove(j, i, j, k, state, display);
                                break;
                            }
                        }
                    }
                }
                break;
            }
            case 'left': {
                for(let i = 0; i < this.grid[0].length; i++) {//through width
                    for(let j = 0; j < this.grid.length; j++) {//through height
                        for(let k = 0; k <= i; k++) {
                            if(this.canMove(i, j, k, j, state, dir)) {
                                this.makeMove(i, j, k, j, state, display);
                                break;
                            }
                        }
                    }
                }
                break;
            }
            case 'right': {
                for(let i = this.grid[0].length - 1; i >= 0; i--) {//through width
                    for(let j = 0; j < this.grid.length; j++) {//through height
                        for(let k = this.grid[0].length - 1; k >= i; k--) {
                            if(this.canMove(i, j, k, j, state, dir)) {
                                this.makeMove(i, j, k, j, state, display);
                                break;
                            }
                        }
                    }
                }
                break;
            }
        }
        return state;
    }

    makeMove(x, y, toX, toY, grid, display = false) {
        if((x !== toX || y !== toY) && display) this.instructions.push([[x, y], [toX, toY]]);
        let frm = this.getSquare(x, y);
        let to = this.getSquare(toX, toY, grid);
        grid[toY][toX] = to ? to.merge(frm) : this.getSquare(x, y);
    }

    canMove(x, y, toX, toY, grid, dir) {
        let frm = this.getSquare(x, y);
        let to = this.getSquare(toX, toY, grid);
        if(!frm) return false;
        if(x === toX && y === toY) return true;
        for(let i = 1; i < Math.max(Math.abs(x - toX), Math.abs(y - toY)); i++) {
            if(grid[y + (['up', 'down'].includes(dir) ? (toY > y ? i : -i) : 0)][x + (!['up', 'down'].includes(dir) ? (toX > x ? i : -i) : 0)]) return false;
        }
        return to ? to.canMerge(frm) : !this.oBounds(toX, toY);
    }

    getSquare(x, y, grid = this.grid) {
        return !this.oBounds(x, y) && grid[y][x];
    }

    oBounds(x, y, toX, toY) {
        return x < 0 || x >= this.grid[0].length || y < 0 || y >= this.grid.length;
    }

    endGame() {
        for(let dir of ['up', 'down', 'left', 'right']) {
            let state = this.futureState(dir);
            if(state.some((r, j) => r.some((s, i) => this.grid[j][i]?.value !== s?.value))) return false;
        }
        return true;
    }

    spawnNew() {
        let empties = [];
        for(let i = 0; i < this.grid.length; i++) {
            for(let j = 0; j < this.grid[i].length; j++) {
                if(!this.grid[i][j]) empties.push([i, j]);
            }
        }
        if(!empties.length) return;
        let choice = empties[Math.floor(Math.random() * empties.length)];
        this.grid[choice[0]][choice[1]] = new Square();
    }

    cheat(thing) {
        if(thing !== 'cheatCode') return;
        this.grid[Math.floor(Math.random() * this.grid.length)][Math.floor(Math.random() * this.grid[0].length)] = new Square(2048);
    }
}
export class Bot {
    constructor(display) {
        this.display = display;
        this.board = display.board;
        this.moveTimeout = null;
    }

    wait() { // stop making moves
        clearTimeout(this.moveTimeout);
    }

    makeMove() { // find and choose a move
        const dirs = ['up', 'left', 'right', 'down'];
        let moves = new Map();
        for(let dir of dirs) {
            let state = this.board.futureState(dir);
            if(state.every((r, j) => r.every((s, i) => this.board.grid[j][i]?.value === s?.value))) continue;
            moves.set(dir, this.scoreMove(state));
        }
        let choice;
        //moves.forEach((s, d) => { if(!choice || moves.get(choice) < s) { choice = d; } });
        choice = Array.from(moves.keys()).map(dir => dirs.indexOf(dir)).sort((a, b) => a - b).map(a => dirs[a]).shift();
        console.log(choice);
        //choice = moves.has('up') ? 'up' : moves.has('left') ? 'left' : moves.has('right') ? 'right' : 'down';
        if(!choice) return;
        this.board.move(choice);
        this.moveTimeout = setTimeout(() => this.makeMove(), 20);
    }

    scoreMove(future) { // return a score for a possible move
        let score = 0;
        //let highY = 
        score += this.potentialScore(future);
        return score;
    }

    neighbors(future, x, y) {
        let vals = []
        for(let i = -1; i <= 1; i++) {
            for(let j = -1; j <= 1; j++) {
                if(i === j === 0) continue;
                let toX = x + j;
                let toY = y + i;
                if(toX < 0 || toY < 0 || toY >= future.length || toX >= future[toY].length || !future[toY][toX]) continue;
                vals.push(future[toY][toX]);
            }
        }
        return vals;
    }

    potentialScore(future) { // get the potential score increase
        return Math.pow(future.flatMap(r => r).reduce((a, c) => a + (c ? Math.log2(c.value) : 0), 0) - this.board.grid.flatMap(r => r).reduce((a, c) => a + (c ? Math.log2(c.value) : 0), 0), 2);
    }
}
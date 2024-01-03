import { Display } from './Game/display.js'
import { Bot } from './Bot/interface.js'

let d = new Display(document.getElementById("boardCanvas"));
window.myGame = d;
d.reset();

window.addEventListener('keydown', e => {
    switch(e.keyCode) { // listen to key presses
        case 37:
        return d.left();
        case 39:
        return d.right();
        case 40:
        return d.down();
        case 38:
        return d.up();
        case 27:
        return d.pause();
        case 82:
        return d.reset();
        case 66:
        return d.reset(new Bot(d));
    }
});
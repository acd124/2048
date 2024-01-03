export class Box {
    constructor(name, x, y, display, access, filter = () => true) {
        this.name = name;
        this.width = 100;
        this.height = 50;
        this.xOffset = x - this.width / 2;
        this.yOffset = y - this.height / 2;
        this.display = display
        this.access = access; // function to get data
        this.filter = filter; // funtion to say if the box should show
        this.ctx = display.context;
    }

    draw() {
        if(!this.filter()) return;
        this.ctx.beginPath();
        this.ctx.rect(this.xOffset, this.yOffset, this.width, this.height); // outline of box
        this.ctx.strokeMany();

        this.ctx.fillStyle = this.name === 'YOU WON' ? '#60F030' : '#808080';
        this.ctx.fillRect(this.xOffset, this.yOffset, this.width, this.height); // background of box

        this.ctx.fillStyle = '#000000';
        this.ctx.font = '24px sans-serif'; // Title
        this.ctx.fillText(this.name, this.xOffset + (this.width / 2), this.yOffset + 25, this.width);
        this.ctx.font = '14px sans-serif';
        
        this.ctx.fillText(this.access(), this.xOffset + (this.width / 2), this.yOffset + (4 * this.height / 5), this.width); // explanation text
    }
}
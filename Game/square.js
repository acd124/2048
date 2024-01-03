export class Square {
    constructor(value = null, merged = false) {
        this.value = value || (Math.random() > 0.9 ? 4 : 2);
        this.merged = merged;
    }

    get color() {
        let values = ['#0000FF', '#F5EFDA', '#E3D4AC', '#EDA968', '#E69345', '#E66B45', '#E34A1B', '#EDEA8A', '#F2EE6F', '#EBE64B', '#E8D64D', '#F5DA2F', '#FFD738', '#0BCED9', '#14ACE3', '#148DE3', '#1467E3'];
        return values[Math.log2(this.value)] || values[0];
    }

    canMerge(square) {
        //console.log(square.value, this.value);
        return (square.value === this.value) && !this.merged;
    }

    merge(square) {
        if(square === this) return this;
        return new this.constructor(this.value * 2, true);
    }
}
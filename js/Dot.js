'use strict';

import random from './random.js';
import hueColor from "./hueColor.js";

export default class Dot {

    static list = [];

    static config = {
        color: '#AA0000',
        massFactor: 0.002,
        radius: {
            min: 5,
            max: 20
        }
    }

    constructor(x, y) {

        this.x = x;
        this.y = y;

        this.radius = random(Dot.config.radius.min, Dot.config.radius.max);
        this.color = (Dot.config.color == null) ? `#${random(0, 9)}${random(0, 9)}${random(0, 9)}${random(0, 9)}${random(0, 9)}${random(0, 9)}` : Dot.config.color;
        this.borderColor = `${hueColor(this.color, 20)}`;

        this.mass = this.radius * Dot.config.massFactor;

        this.velocity = {
            x: 0,
            y: 0
        }

        Dot.list.push(this);

    }

}
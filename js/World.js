'use strict';

import Dot from './Dot.js';
import Cursor from './Cursor.js';

window.Dot = Dot;

export default class World {

    static cnv = document.getElementById('world');
    static ctx = World.cnv.getContext('2d');

    static paused = false;

    static config = {
        friction: .95,
        repulsion: 500,
    }

    static bg = '#111';

    static init() {

        this.paused = false;

        this.cnv.width  = window.innerWidth;
        this.cnv.height = window.innerHeight;

        this.cnv.style.background = this.bg;

        this.listeners();

        this.loop();

    }

    static loop() {

        if( !World.paused ) {
            World.render();
            World.physic();
            World.movement();
        }

        requestAnimationFrame(World.loop);

    }

    static render() {

        World.ctx.clearRect(0, 0, World.cnv.width, World.cnv.height);

        /* Dots */
        for ( const dot of Dot.list ) {
            World.ctx.beginPath();
            World.ctx.fillStyle = dot.color;
            World.ctx.strokeStyle = dot.borderColor;
            World.ctx.lineWidth = 3;
            World.ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI*2);
            World.ctx.fill();
            World.ctx.stroke();
            World.ctx.closePath();
        }

        /* Cursor */
        World.ctx.beginPath();
        World.ctx.fillStyle = Cursor.color;
        World.ctx.arc(Cursor.x, Cursor.y, Cursor.radius, 0, Math.PI*2);
        World.ctx.fill();
        World.ctx.closePath();

    }

    static physic() {

        // Dots attraction
        for ( const currentDot of Dot.list ) {

            let acceleration = { x: 0, y: 0 }

            for ( const dot of Dot.list ) {

                if ( currentDot == dot ) continue;

                let delta = {
                    x: dot.x - currentDot.x,
                    y: dot.y - currentDot.y
                }

                let dist = Math.sqrt( Math.pow( delta.x, 2 ) + Math.pow( delta.y, 2 ) ) || 1;

                let attractionForce = ( dist - World.config.repulsion ) / dist * dot.mass;

                acceleration.x += delta.x * attractionForce;
                acceleration.y += delta.y * attractionForce;

            }

            currentDot.velocity.x += (acceleration.x * currentDot.mass);
            currentDot.velocity.y += (acceleration.y * currentDot.mass);

            currentDot.velocity.x *= World.config.friction;
            currentDot.velocity.y *= World.config.friction;
        }

    }

    static movement() {

        for ( const dot of Dot.list ) {
            dot.x += dot.velocity.x;
            dot.y += dot.velocity.y;
        }

    }

    static listeners() {

        let mouseDown = false;

        window.addEventListener('resize', e => {
            this.cnv.width = window.innerWidth;
            this.cnv.height = window.innerHeight;
        });

        World.cnv.addEventListener('mousedown', e => mouseDown = true );
        World.cnv.addEventListener('mouseup', e => mouseDown = false );

        World.cnv.addEventListener('mousemove', ({ clientX, clientY }) => {

            if ( mouseDown ) new Dot(clientX, clientY);

            Cursor.x = clientX;
            Cursor.y = clientY;

        });

        /* Options Panel */
        const repulsionOption = document.getElementById('repulsion');
        const frictionOption = document.getElementById('friction');
        const dotsColor = document.getElementById('dotsColor');
        const dotsRainbow = document.getElementById('dotsRainbow');

        repulsionOption.addEventListener('input', e => World.config.repulsion = repulsionOption.value);
        frictionOption.addEventListener('input', e => World.config.friction = frictionOption.value);
        dotsColor.addEventListener('input', e => Dot.config.color = dotsColor.value);
        dotsRainbow.addEventListener('input', e => {
            dotsRainbow.previousElementSibling.style.color = (Dot.config.color) ? '#0075FF' : 'white';
            Dot.config.color = (Dot.config.color) ? null : '#AA0000'
        });

    }

}
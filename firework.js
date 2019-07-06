var context;
var Screen_particles = [];
var Screen_rockets = [];
window.onload = function () {
    console.log(this);
    var canvas = document.getElementById("myCanvas");
    canvas.style.top = 0 + "px";
    canvas.style.left = 0 + "px";
    canvas.style.position = "absolute";
    canvas.style.opacity = 0.9;
    context = canvas.getContext('2d');
    launch();


}
function Particle(pos) {
    this.pos = {
        x: pos ? pos.x : 0,
        y: pos ? pos.y : 0
    }
    this.add_x = 0;
    this.add_y = 0;
    this.shrink = 0.97;
    this.size = 2;
    this.resistance = 1;
    this.gravity = 0;

}
Particle.prototype.update = function () {
    this.add_x *= this.resistance;
    this.add_y *= this.resistance;
    this.add_y += this.gravity;
    this.pos.x += this.add_x;
    this.pos.y += this.add_y;
    this.size *= this.shrink;

}
Particle.prototype.render = function (c) {

    c.save();
    c.globalCompositeOperation = 'lighter';
    var gradient = c.createRadialGradient(this.pos.x, this.pos.y, 0.1, this.pos.x, this.pos.y, this.size / 2);
    gradient.addColorStop(0.1, "rgba(200,50,0,1");//万恶的IE下会报错，即使是IE11也会报错
    gradient.addColorStop(1, "rgba(0,0,0,0.5)");
    c.fillStyle = gradient;
    c.beginPath();
    c.arc(this.pos.x, this.pos.y, this.size / 2, 0, Math.PI * 2, true);
    c.closePath();
    c.fill();
    c.restore();
}
function Rocket() {
    Particle.apply(this, [{
        x: 600,
        y: 600
    }]);
}
Rocket.prototype = new Particle();
Rocket.prototype.constructor = Rocket;
Rocket.prototype.explode = function () {
    var count = Math.random() * 10 + 80;
    for (var i = 0; i < count; i++) {

        var particle = new Particle(this.pos);
        var angle = Math.random() * Math.PI * 2;
        var speed = Math.cos(Math.random() * Math.PI / 2) * 15;
        particle.add_x = Math.cos(angle) * speed;
        particle.add_y = -Math.sin(angle) * speed;
        particle.gravity = 0.1;
        particle.size = 10;
        particle.resistance = 0.92;
        particle.shrink = Math.random() * 0.05 + 0.93;
        Screen_particles.push(particle);

    }
}
Rocket.prototype.render = function (context) {
    context.save();
    context.globalCompositeOperation = 'lighter';
    var gradient = context.createRadialGradient(this.pos.x, this.pos.y, 0.1, this.pos.x, this.pos.y, this.size / 2);
    gradient.addColorStop(0.1, "rgba(255, 255, 255 ,1)");
    gradient.addColorStop(1, "rgba(0, 0, 0,0.5)");
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(this.pos.x, this.pos.y, this.size / 2, 0, Math.PI * 2, true);
    context.closePath();
    context.fill();
    context.restore();
}
function launch() {
    requestAnimationFrame(reload);
    //setInterval(reload,400);
    requestAnimationFrame(state);
    // setInterval(state,20);
}

function state() {
    requestAnimationFrame(state);
    context.fillStyle = "rgba(0, 0, 0, 0.05)";
    context.fillRect(0, 0, 1200, 600);
    for (var i = 0; i < Screen_rockets.length; i++) {
        if (Screen_rockets[i].distance < Screen_rockets[i].flyDistance) {
            Screen_rockets[i].distance = Math.sqrt(Math.pow((Screen_rockets[i].pos.x - 600), 2) + Math.pow((Screen_rockets[i].pos.y - 600), 2));
            Screen_rockets[i].update();
            Screen_rockets[i].render(context);
        } else {
            Screen_rockets[i].explode();
            Screen_rockets.splice(i, 1);
        }
    }

    for (var i = 0; i < Screen_particles.length; i++) {
        if (Screen_particles[i].size > 1) {
            Screen_particles[i].update();
            Screen_particles[i].render(context);
        } else {
            Screen_particles.splice(i, 1);
        }
    }
}

function reload() {
    requestAnimationFrame(reload);
    if (Screen_rockets.length < 10) {
        var rocket = new Rocket();
        rocket.flyDistance = (Math.random() * 0.7 + 0.3) * 600;
        rocket.explosionColor = Math.floor(Math.random() * 360 / 10) * 10;
        var angle = (Math.random() * 0.25 + 0.125) * Math.PI * 2;
        var speed = 6;
        rocket.add_x = Math.cos(angle) * speed;
        rocket.add_y = -Math.sin(angle) * speed;
        rocket.size = 8;
        rocket.shrink = 0.999;
        rocket.gravity = 0.01;
        rocket.distance = Math.sqrt(Math.pow((rocket.pos.x - 600), 2) + Math.pow((rocket.pos.y - 600), 2));
        Screen_rockets.push(rocket);
    } 
}
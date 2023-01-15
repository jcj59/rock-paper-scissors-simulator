class Game {
    constructor(n) {
        this.particles = [];
        this.game_over = false;
        for (let i = 0; i < n; i++) {
            this.particles.push(new Particle(Types.Rock, random(width), random(height)));
            this.particles.push(new Particle(Types.Paper, random(width), random(height)));
            this.particles.push(new Particle(Types.Scissors, random(width), random(height)));
        }
        this.qtree = new Quadtree(4, new Rectangle(0, 0, width, height));
        for (let p of this.particles) {
            this.qtree.insert(new Point(p.x, p.y, p));
        }
        this.rockAlive = true;
        this.paperAlive = true;
        this.scissorsAlive = true;
    }

    update() {
        this.qtree = new Quadtree(4, new Rectangle(0, 0, width, height));
        this.rockAlive = false;
        this.paperAlive = false;
        this.scissorsAlive = false;
        for (let p of this.particles) {
            this.qtree.insert(new Point(p.x, p.y, p));
            if (p.type == Types.Rock) {
                this.rockAlive = true;
            } else if (p.type == Types.Paper) {
                this.paperAlive = true;
            } else {
                this.scissorsAlive = true;
            }
        }

        for (let p of this.particles) {
            let test = [];
            let i = 1;
            var d;
            var min_d_flee = undefined;
            var min_d_attack = undefined;
            var closest_flee = undefined;
            var closest_attack = undefined;
            test = this.qtree.query(new Circle(p.x, p.y, i * NEIGHBOR_SEARCH_RADIUS, i * NEIGHBOR_SEARCH_RADIUS));
            for (let t of test) {
                if (p.type != t.data.type) {
                    d = Math.pow(p.x - t.x, 2) + Math.pow(p.y - t.y, 2);
                    if ((p.type == Types.Rock && t.data.type == Types.Scissors) ||
                        (p.type == Types.Paper && t.data.type == Types.Rock) ||
                        (p.type == Types.Scissors && t.data.type == Types.Paper)) {
                        if (min_d_attack) {
                            if (d < min_d_attack) {
                                min_d_attack = d;
                                closest_attack = t;
                            }
                        } else {
                            min_d_attack = d;
                            closest_attack = t;
                        }
                    } else if ((t.data.type == Types.Rock && p.type == Types.Scissors) ||
                        (t.data.type == Types.Paper && p.type == Types.Rock) ||
                        (t.data.type == Types.Scissors && p.type == Types.Paper)) {
                        if (min_d_flee) {
                            if (d < min_d_flee) {
                                min_d_flee = d;
                                closest_flee = t;
                            }
                        } else {
                            min_d_flee = d;
                            closest_flee = t;
                        }
                    }

                }
            }
            if ((p.type == Types.Rock && this.scissorsAlive == false) ||
                (p.type == Types.Paper && this.rockAlive == false) ||
                (p.type == Types.Scissors && this.paperAlive == false)) {
                p.move();
            } else {
                p.move(closest_attack, closest_flee);
            }
        }
        var collision;
        for (let q of this.particles) {
            collision = this.qtree.query(new Circle(q.x, q.y, 2 * q.r));
            if (collision.length > 0) {
                for (let r of collision) {
                    if (r.data.type == Types.Rock && q.type == Types.Paper) {
                        r.data.type = Types.Paper;
                    } else if (r.data.type == Types.Rock && q.type == Types.Scissors) {
                        q.type = Types.Rock;
                    } else if (r.data.type == Types.Paper && q.type == Types.Rock) {
                        q.type = Types.Paper
                    } else if (r.data.type == Types.Paper && q.type == Types.Scissors) {
                        r.data.type = Types.Scissors
                    } else if (r.data.type == Types.Scissors && q.type == Types.Paper) {
                        q.type = Types.Scissors
                    } else if (r.data.type == Types.Scissors && q.type == Types.Rock) {
                        r.data.type = Types.Rock
                    }
                }
            }
        }
    }

    show() {
        for (let p of this.particles) {
            p.show();
        }
    }
}

class Particle {
    constructor(t, x, y) {
        this.type = t;
        this.x = x;
        this.y = y;
        this.r = PARTICLE_RADIUS;
    }

    move(attack, flee) {
        if (attack) {
            let direction_x = attack.x - this.x;
            let direction_y = attack.y - this.y;
            let distance = Math.sqrt(Math.pow(direction_x, 2) + Math.pow(direction_y, 2));
            this.x += random(PARTICLE_SPEED) * direction_x / distance;
            this.y += random(PARTICLE_SPEED) * direction_y / distance;
        }
        if (flee) {
            let direction_x = flee.x - this.x;
            let direction_y = flee.y - this.y;
            let distance = Math.sqrt(Math.pow(direction_x, 2) + Math.pow(direction_y, 2));
            this.x -= FLEE_COEFF * random(PARTICLE_SPEED) * direction_x / distance;
            this.y -= FLEE_COEFF * random(PARTICLE_SPEED) * direction_y / distance;
        }
        this.x += random(-PARTICLE_SPEED, PARTICLE_SPEED);
        this.y += random(-PARTICLE_SPEED, PARTICLE_SPEED);
        if (this.x > width - PARTICLE_RADIUS) {
            this.x = width - PARTICLE_RADIUS;
        } else if (this.x < PARTICLE_RADIUS) {
            this.x = PARTICLE_RADIUS;
        }
        if (this.y > height - PARTICLE_RADIUS) {
            this.y = height - PARTICLE_RADIUS;
        } else if (this.y < PARTICLE_RADIUS) {
            this.y = PARTICLE_RADIUS;
        }
    }

    show() {
        if (this.type == Types.Rock) {
            image(rockSprite, this.x - this.r / 2, this.y - this.r / 2, this.r * 2, this.r * 2);
        } else if (this.type == Types.Paper) {
            image(paperSprite, this.x - this.r / 2, this.y - this.r / 2, this.r * 2, this.r * 2);
        } else {
            image(scissorSprite, this.x - this.r / 2, this.y - this.r / 2, this.r * 2, this.r * 2);
        }
    }
}

const Types = {
    Rock: "rock",
    Paper: "paper",
    Scissors: "scissors"
}


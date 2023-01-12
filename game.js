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
    }

    update() {
        this.qtree = new Quadtree(4, new Rectangle(0, 0, width, height));
        for (let p of this.particles) {
            this.qtree.insert(new Point(p.x, p.y, p));
        }
        var temp;
        for (let q of this.particles) {
            temp = this.qtree.query(new Circle(q.x, q.y, 2 * q.r));
            if (temp.length > 0) {
                for (let r of temp) {
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
            let found = false;
            var closest;
            var min_d;
            var d;
            let i = 1;
            while (!found && i * NEIGHBOR_SEARCH_RADIUS <= width) {
                temp = this.qtree.query(new Circle(q.x, q.y, i * NEIGHBOR_SEARCH_RADIUS));
                if (temp.length > 0) {
                    for (let s of temp) {
                        if ((q.type == Types.Paper && s.data.type == Types.Rock)
                            || (q.type == Types.Rock && s.data.type == Types.Scissors)
                            || (q.type == Types.Scissors && s.data.type == Types.Paper)) {
                            d = Math.pow(q.x - s.x, 2) + Math.pow(q.y - s.y, 2);
                            if (min_d == undefined) {
                                min_d = d;
                            } else if (d < min_d) {
                                min_d = d;
                                closest = s;
                            }
                        }

                    }
                }
                i++;
            }
            q.move(closest);
        }
    }

    show() {
        // console.log(this.particles);
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

    move(p) {
        if (p) {
            // console.log(p);
            let direction_x = p.x - this.x;
            let direction_y = p.y - this.y;
            let distance = Math.sqrt(Math.pow(direction_x, 2) + Math.pow(direction_y, 2));
            if (distance != 0) {
                this.x += direction_x / distance;
                this.y += direction_y / distance;
            }
            if (distance != 0) {
                //console.log(distance);
            }
        }
        this.x += random(-PARTICLE_SPEED, PARTICLE_SPEED);
        this.y += random(-PARTICLE_SPEED, PARTICLE_SPEED);
        if (this.x > width) {
            this.x = width;
        } else if (this.x < 0) {
            this.x = 0;
        }
        if (this.y > height) {
            this.y = height;
        } else if (this.y < 0) {
            this.y = 0;
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


class Point {
    /** Constructs a point at (x, y) with data. */
    constructor(x, y, data) {
        this.x = x;
        this.y = y;
        this.data = data;
    }

    show() {
        fill(0);
        ellipse(this.x, this.y, POINT_DIAMETER);
    }
}

class Rectangle {
    /** Constructs a Rectangle object where (x, y) is the top left coordinate 
     * of the rectangle, w is the width, and h is the height. */
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    /** Returns true if point p lies within or on the border of the rectangle. */
    contains(p) {
        return this.x <= p.x &&
            this.x + this.w >= p.x &&
            this.y <= p.y &&
            this.y + this.h >= p.y
    }

    /** Returns true if rectangle r intersects the rectangle. */
    intersects(r) {
        return this.x + this.w >= r.x &&
            this.x <= r.x + r.w &&
            this.y + this.h >= r.y &&
            this.y <= r.y + r.h
    }

    show() {
        noFill();
        rect(this.x, this.y, this.w, this.h);
    }
}

class Circle {
    /** Constructs a Circle object centered at (x, y) with radius r. */
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
    }

    /** Returns true if point p lies within or on the border of the circle. */
    contains(p) {
        let d = Math.sqrt(Math.pow(this.x - p.x, 2) + Math.pow(this.y - p.y, 2));
        return d <= this.r
    }

    /** Returns true if rectangle r intersects the circle. */
    intersects(r) {
        let x1 = r.x;
        let y1 = r.y;
        let x2 = r.x + r.w;
        let y2 = r.y + r.h;
        let xn = max(x1, min(this.x, x2));
        let yn = max(y1, min(this.y, y2));

        let dx = xn - this.x;
        let dy = yn - this.y;
        return (dx * dx + dy * dy) <= Math.pow(this.r, 2);
    }

    show() {
        noFill();
        ellipse(this.x, this.y, this.r * 2);
    }
}

class Quadtree {
    /** Constructs a quadtree object with boundary r and capacity n. */
    constructor(n, r) {
        this.boundary = r;
        this.capacity = n;
        this.points = [];
        this.divided = false;
    }

    /** Inserts point p into the quadtree. */
    insert(p) {
        if (this.boundary.contains(p)) {
            if (this.points.length < this.capacity) {
                this.points.push(p);
            } else {
                if (!this.divided) {
                    this.subdivide();
                }
                return this.nw.insert(p) ||
                    this.ne.insert(p) ||
                    this.sw.insert(p) ||
                    this.se.insert(p);
            }
        } else { return false }
    }

    /** Subdivides boundary into four separate quadtrees. */
    subdivide() {
        let x = this.boundary.x;
        let y = this.boundary.y;
        let w = this.boundary.w;
        let h = this.boundary.h;
        this.nw = new Quadtree(this.capacity, new Rectangle(x, y, w / 2, h / 2));
        this.ne = new Quadtree(this.capacity, new Rectangle(x + w / 2, y, w / 2, h / 2));
        this.sw = new Quadtree(this.capacity, new Rectangle(x, y + h / 2, w / 2, h / 2));
        this.se = new Quadtree(this.capacity, new Rectangle(x + w / 2, y + h / 2, w / 2, h / 2));
        this.divided = true;
    }

    /** Returns all points contained in region r. */
    query(r) {
        let result = [];
        if (r.intersects(this.boundary)) {
            for (let p of this.points) {
                if (r.contains(p)) {
                    result.push(p);
                }
            }
            if (this.divided) {
                result.push(...this.nw.query(r));
                result.push(...this.ne.query(r));
                result.push(...this.sw.query(r));
                result.push(...this.se.query(r));
            }
        }
        return result;
    }

    /** Draws QuadTree to screen */
    show() {
        this.boundary.show();
        for (let p of this.points) {
            p.show();
        }
        if (this.divided) {
            this.nw.show();
            this.ne.show();
            this.sw.show();
            this.se.show();
        }
    }

    /** Logs if head or any of its children contain more points than capacity. */
    pointsTest() {
        if (this.points.length > this.capacity) {
            console.log(this.points.length);
        }
        if (this.divided) {
            this.nw.pointsTest();
            this.ne.pointsTest();
            this.sw.pointsTest();
            this.se.pointsTest();
        }
    }
}
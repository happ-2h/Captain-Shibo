export default class Vec2D {
  #x;
  #y;

  constructor(x=0, y=0) {
    this.#x = x;
    this.#y = y;
  }

  // Directional vectors
  static zero()  { return new Vec2D(0, 0);  }
  static left()  { return new Vec2D(-1, 0); }
  static right() { return new Vec2D(1, 0);  }
  static up()    { return new Vec2D(0, -1); }
  static down()  { return new Vec2D(0, 1);  }

  // Mathematical functions
  static add(v1, v2) {
    return new Vec2D(v1.x + v2.x, v1.y + v2.y);
  }

  static sub(v1, v2) {
    return new Vec2D(v1.x - v2.x, v1.y - v2.y);
  }

  static mul(v1, v2) {
    return new Vec2D(v1.x * v2.x, v1.y * v2.y);
  }

  static scale(v1, n) {
    return new Vec2D(v1.x * n, v1.y * n);
  }

  static dot(v1, v2) {
    return v1.x * v2.x + v1.y * v2.y;
  }

  static cross(v1, v2) {
    return v1.x * v2.y - v1.y * v2.x;
  }

  static normalize(v1) {
    const len = v1.length;

    if (len === 0) return Vec2D.zero();

    return new Vec2D(v1.x/len, v2.y/len);
  }

  static rotate(v1, ang) {
    const cos = Math.cos(ang);
    const sin = Math.sin(ang);

    return new Vec2D(
      cos * v1.x - sin * v1.y,
      sin * v1.x + cos * v1.y
    );
  }

  // Utils
  static angToVec(ang) {
    return new Vec2D(Math.cos(ang), Math.sin(ang));
  }

  static vecToAng(vec) {
    if (vec.x === 0 && vec.y === 0) return Vec2D.zero();

    return Math.atan2(vec.y, vec.x);
  }

  static angBetween(v1, v2) {
    const l1 = v1.length;
    const l2 = v2.length;

    if (l1 === 0 || l2 === 0) return 0;

    return Math.acos(Vec2D.dot(v1, v2) / (l1 * l2));
  }

  // Mutable operations
  add(vec) {
    this.#x += vec.x;
    this.#y += vec.y;
  }

  sub(vec) {
    this.#x -= vec.x;
    this.#y -= vec.y;
  }

  mul(vec) {
    this.#x *= vec.x;
    this.#y *= vec.y;
  }

  scale(scalar) {
    this.#x *= scalar;
    this.#y *= scalar;
  }

  dot(vec) {
    const nrm = Vec2D.normalize(this);

    return nrm.x * vec.x + nrm.y * vec.y;
  }

  cross(vec) {
    return this.#x * vec.y - this.#y * vec.x;
  }

  normalize() {
    const len = this.length;

    if (len === 0) return;

    this.#x /= len;
    this.#y /= len;
  }

  rotate(ang) {
    const cos = Math.cos(ang);
    const sin = Math.sin(ang);

    const tmpx = this.#x;
    const tmpy = this.#y;

    this.#x = cos * tmpx - sin * tmpy;
    this.#y = sin * tmpx + cos * tmpy;
  }

  dist(vec) {
    const sub = Vec2D.sub(this, vec);

    return sub.length;
  }

  magnitude() {
    return this.length;
  }

  unit() {
    return Vec2D.normalize(this);
  }

  // Utils
  print() {
    console.log(`(${this.#x}, ${this.#y})`);
  }

  equals(vec) {
    return (this.#x === vec.x && this.#y === vec.y);
  }

  copy(vec) {
    this.#x = vec.x;
    this.#y = vec.y;
  }

  set(x, y) {
    this.#x = x;
    this.#y = y;
  }

  clone() {
    return new Vec2D(this.#x, this.#y);
  }

  get length() {
    return Math.sqrt(this.#x * this.#x + this.#y * this.#y);
  }

  // Mutators
  set x(x) { this.#x = x; }
  set y(y) { this.#y = y; }

  // Accessors
  get x() { return this.#x; }
  get y() { return this.#y; }

};

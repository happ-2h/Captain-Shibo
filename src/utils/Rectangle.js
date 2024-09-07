import Vec2D from "../math/Vec2D.js";

export default class Rectangle {
  #pos; // Position (x, y)
  #dim; // Dimension (width, height)

  /**
   * @param {Number} x      - x-position of the rectangle
   * @param {Number} y      - y-position of the rectangle
   * @param {Number} width  - Width of the rectangle
   * @param {Number} height - Height of the rectangle
   */
  constructor(x, y, width, height) {
    this.#pos = new Vec2D(x, y);
    this.#dim = new Vec2D(width, height);
  }

  /**
   * @returns Top of the rectangle (y-position)
   */
  top() {
    return this.#pos.y;
  }

  /**
   * @returns Bottom of the rectangle (y-position + height)
   */
  bottom() {
    return this.#pos.y + this.#dim.y;
  }

  /**
   * @returns Left of the rectangle (x-position)
   */
  left() {
    return this.#pos.x;
  }

  /**
   * @returns Right of the rectangle (x-position + width)
   */
  right() {
    return this.#pos.x + this.#dim.x;
  }

  /**
   *
   * @returns {Object} x: Horizontal center of the rectangle\
   *                   y: Vertical center of the rectangle
   */
  center() {
    return {
      x: this.#pos.x + (this.#dim.x>>1),
      y: this.#pos.y + (this.#dim.y>>1)
    };
  }

  // Accessors
  get pos() { return this.#pos; }
  get x() { return this.#pos.x; }
  get y() { return this.#pos.y; }

  get dim() { return this.#dim; }
  get w() { return this.#dim.x; }
  get h() { return this.#dim.y; }

  // Mutators
  set pos(pos)  {
    this.#pos = null;
    this.#pos = pos;
  }
  set x(x) { this.#pos.x = x; }
  set y(y) { this.#pos.y = y; }

  set dim(dim) {
    this.#dim = null;
    this.#dim = dim;
  }
  set w(w) { this.#dim.x = w; }
  set h(h) { this.#dim.y = h; }
};
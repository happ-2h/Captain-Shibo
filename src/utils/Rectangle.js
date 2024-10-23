import Vec2D         from "../math/Vec2D.js";
import { TILE_SIZE } from "../game/constants.js";

export default class Rectangle {
  #pos; // Position (x, y)
  #dim; // Dimension (width, height)

  /**
   * @param {Number} x      - x-position of the rectangle
   * @param {Number} y      - y-position of the rectangle
   * @param {Number} width  - Width of the rectangle
   * @param {Number} height - Height of the rectangle
   */
  constructor(x=0, y=0, width=TILE_SIZE, height=TILE_SIZE) {
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

  // Utils
  /**
   * @brief Get current world coordinates as grid coordinates
   *
   * @returns An object {x, y} as grid coordinates
   */
  toGrid() {
    return {
      x: Math.floor(this.#pos.x / TILE_SIZE),
      y: Math.floor(this.#pos.y / TILE_SIZE)
    };
  }

  // Accessors
  get pos() { return this.#pos; }
  get x()   { return this.#pos.x; }
  get y()   { return this.#pos.y; }

  get dim() { return this.#dim; }
  get w()   { return this.#dim.x; }
  get h()   { return this.#dim.y; }

  // Mutators
  set x(x) { this.#pos.x = x; }
  set y(y) { this.#pos.y = y; }
  set w(w) { this.#dim.x = w; }
  set h(h) { this.#dim.y = h; }

  set pos(pos)  {
    this.#pos = null;
    this.#pos = pos;
  }

  set dim(dim) {
    this.#dim = null;
    this.#dim = dim;
  }
};
import Vec2D         from "../math/Vec2D";
import { TILE_SIZE } from "../game/constants";

export default class Circle {
  #pos; // Position (x, y)
  #radius;

  /**
   * @param {Number} x      - x-position of the circle
   * @param {Number} y      - y-position of the circle
   * @param {Number} radius - Radius of the circle
   */
  constructor(x=0, y=0, radius=TILE_SIZE) {
    this.#pos = new Vec2D(x, y);
    this.#radius = radius;
  }

  // Accessors
  get pos() { return this.#pos; }
  get x()   { return this.#pos.x; }
  get y()   { return this.#pos.y; }

  get radius()        { return this.#radius; }
  get diameter()      { return this.#radius * 2; }
  get circumference() { return Math.PI * 2 * this.#radius; }

  // Mutators
  set x(x) { this.#pos.x = x; }
  set y(y) { this.#pos.y = y; }
  set radius(rad) { this.#radius = rad; }

  set pos(pos) {
    this.#pos = null;
    this.#pos = pos;
  }
};
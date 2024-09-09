import Rectangle from "../utils/Rectangle";
import { RES_HEIGHT, RES_SCALE, RES_WIDTH } from "../game/constants"
import { lerp } from "../math/utils";
import Vec2D from "../math/Vec2D";

export default class Camera {
  #rect;    // Holds x, y, width, and height of the camera
  #focalPt; // Holds (x, y) of the next focal point

  #lerpSpeed;
  #lookahead; // Lookahead distance

  /**
   * @param {Number} x      - x-position focus point
   * @param {Number} y      - y-position focus point
   * @param {Number} width  - Width  in number of cells
   * @param {Number} height - Height in number of cells
   */
  constructor(x=0, y=0, width=RES_WIDTH, height=RES_HEIGHT) {
    this.#rect = new Rectangle(x, y, width, height);
    this.#focalPt = new Vec2D(x, y);

    this.#lerpSpeed = 0.1;
    this.#lookahead = 6;
  }

  /**
   * @brief Set focus to (x, y)
   *
   * @param {Number} x - x-position to focus on
   * @param {Number} y - y-position to focus on
   */
  focus(x, y) {
    this.#focalPt.set(x, y);
  }

  /**
   * @brief Set focus to vector
   *
   * @param {Vec2D} vec - Vector to focus on
   */
  vfocus(vec) {
    this.focus(vec.x, vec.y);
  }

  update(dt) {
    let dx = (this.#focalPt.x - this.#rect.w*(RES_SCALE>>1));
    let dy = (this.#focalPt.y - this.#rect.h*(RES_SCALE>>1));

    if (dx < 0) dx = 0;
    if (dy < 0) dy = 0;

    this.#rect.x = lerp(this.#rect.x, dx, this.#lerpSpeed);
    this.#rect.y = lerp(this.#rect.y, dy, this.#lerpSpeed);
  }

  // Accessors
  get rect()   { return this.#rect; }
  get x()      { return this.rect.pos.x; }
  get y()      { return this.rect.pos.y; }
  get width()  { return this.rect.dim.x; }
  get height() { return this.rect.dim.y; }

  get lerpSpeed() { return this.#lerpSpeed; }
  get lookahead() { return this.#lookahead; }

  // Mutators
  set lerpSpeed(ls) { this.#lerpSpeed = ls; }
  set lookahead(la) { this.#lookahead = la; }
};
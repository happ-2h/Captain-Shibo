import Rectangle from "../utils/Rectangle";
import { TILE_SIZE } from "../game/constants";
import Vec2D from "../math/Vec2D";

export default class Entity {
  #dst; // Destination rectangle
  #src; // Blit image source rectangle

  // Physics
  #dir;      // Directional vector
  #accel;    // Acceleration vector
  #vel;      // Velocity vector
  #friction; // Friction vector

  constructor(x=0, y=0) {
    if (this.constructor === Entity)
      throw new Error("Can't instantiate abstract class Entity");

    // Required abstract method
    if (this.init === undefined)
      throw new Error("init() must be implemented");
    if (this.update === undefined)
      throw new Error("update(dt) must be implemented");
    if (this.draw === undefined)
      throw new Error("draw() must be implemented");

    this.#dst = new Rectangle(x, y, TILE_SIZE, TILE_SIZE);
    this.#src = new Rectangle(0, 0, TILE_SIZE, TILE_SIZE);

    this.#dir      = Vec2D.zero();
    this.#accel    = Vec2D.zero();
    this.#vel      = Vec2D.zero();
    this.#friction = Vec2D.zero();
  }

  // Accessors
  get dst()      { return this.#dst; }
  get src()      { return this.#src; }

  get dir()      { return this.#dir; }
  get accel()    { return this.#accel; }
  get vel()      { return this.#vel; }
  get friction() { return this.#friction; }

  // Mutators
  set dst(dst) { this.#dst = dst; }
  set src(src) { this.#src = src; }
};
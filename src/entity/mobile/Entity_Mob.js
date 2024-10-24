import Entity     from "../Entity";
import Controller from "../../Controller/Controller";
import Renderer   from "../../gfx/Renderer";
import Vec2D      from "../../math/Vec2D";

import { DEBUG } from "../../game/constants";

export default class Entity_Mob extends Entity {
  #controller; // Movement handler

  #targetTile; // Target tile to move to
  #isMoving;

  /**
   * @brief Mobile entity
   *
   * @param {Number} x - x-position
   * @param {Number} y - y-position
   * @param {Controller} controller - Movement handler
   */
  constructor(x=0, y=0, controller=null, map=null) {
    super(x, y, map);

    this.#controller = controller;

    this.#targetTile = new Vec2D(x, y);
    this.#isMoving = false;
  }

  init() {}

  update(dt) {}

  draw() {
    Renderer.vimage("spritesheet", this.src, this.dst);

    if (DEBUG) Renderer.vrect(this.dst.pos, this.dst.dim);
  }

  // Accessors
  get controller() { return this.#controller; }
  get targetTile() { return this.#targetTile; }
  get isMoving()   { return this.#isMoving; }

  // Mutators
  set controller(controller) {
    this.#controller = controller;
  }

  set isMoving(moving) { this.#isMoving = moving; }
};
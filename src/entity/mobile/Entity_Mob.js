import Entity from "../Entity";
import Controller from "../../Controller/Controller";
import Renderer from "../../gfx/Renderer";
import { DEBUG } from "../../game/constants";

export default class Entity_Mob extends Entity {
  #controller; // Movement handler

  /**
   * @brief Mobile entity
   *
   * @param {Number} x - x-position
   * @param {Number} y - y-position
   * @param {Controller} controller - Movement handler
   */
  constructor(x=0, y=0, controller=null) {
    super(x, y);

    this.#controller = controller;
  }

  init() {}

  update(dt) {}

  draw() {
    if (DEBUG) Renderer.vrect(this.dst.pos, this.dst.dim);
  }

  get controller() { return this.#controller; }
  set controller(controller) {
    this.#controller = controller;
  }
};
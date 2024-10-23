import Entity   from "../Entity";
import Renderer from "../../gfx/Renderer";

import { DEBUG } from "../../game/constants";

export default class OBJ_Sign extends Entity {
  #description;
  #done;

  constructor(x=0, y=0, sx=0, sy=0, map=null, description="") {
    super(x, y, map);

    this.src.x = sx;
    this.src.y = sy;

    this.#description = description.toString();
    this.#done = false;
  }

  init() {}

  update(dt) {}

  draw() {
    Renderer.vimage("spritesheet", this.src, this.dst);

    if (DEBUG) Renderer.vrect(this.dst.pos, this.dst.dim);
  }

  nextDialogue() { this.#done = true; }

  currentLine() { return this.#description; }

  // Accessors
  get colDone() { return this.#done; }
};
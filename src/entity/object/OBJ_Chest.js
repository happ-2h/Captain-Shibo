import Entity       from "../Entity";
import Renderer     from "../../gfx/Renderer";
import AudioHandler from "../../audio/AudioHandler";

import { DEBUG } from "../../game/constants";

export default class OBJ_Chest extends Entity {
  #loot;
  #isClosed;

  constructor(x=0, y=0, map=null, loot=null) {
    super(x, y, map);

    this.#loot = loot;
    this.#isClosed = true;

    this.src.x = 32;
    this.src.y = 320;
  }

  init() {}

  update(dt) {}

  draw() {
    Renderer.vimage("spritesheet", this.src, this.dst);

    if (DEBUG) Renderer.vrect(this.dst.pos, this.dst.dim);
  }

  open() {
    AudioHandler.play("open_chest");
    this.#isClosed = false;
    this.src.x = 48;
  }

  nextDialogue() {}

  get loot()     { return this.#loot; }
  get isClosed() { return this.#isClosed; }

  set isClosed(isClosed) { this.#isClosed = isClosed; }
};
import Entity from "../Entity";
import Renderer from "../../gfx/Renderer";
import { DEBUG } from "../../game/constants";

export default class OBJ_Coins extends Entity {
  #name;
  #description;
  #amount;

  constructor(x=0, y=0, map=null, amount=1) {
    super(x, y, map);

    this.#amount = amount;

    this.#name = `${amount} coins`;
    this.#description = `Currency`;

    this.src.x = 80;
    this.src.y = 32;
  }

  init() {}

  update(dt) {}

  draw() {
    Renderer.vimage("spritesheet", this.src, this.dst);

    if (DEBUG) Renderer.vrect(this.dst.pos, this.dst.dim);
  }

  get name()        { return this.#name; }
  get description() { return this.#description; }
  get amount()      { return this.#amount; }
};
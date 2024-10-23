import Entity   from "../Entity";
import Renderer from "../../gfx/Renderer";

import { DEBUG } from "../../game/constants";

export default class NPC extends Entity {
  #dialogueRowi; // Current row index of dialogue
  #dialogueColi; // Current column index of dialogue

  #rowDone; // Finished all rows?
  #colDone; // Finished all columns?

  constructor(x, y, map) {
    super(x, y, map);

    this.src.pos.y = 48;

    this.#dialogueRowi = 0;
    this.#dialogueColi = 0;

    this.#rowDone = false;
    this.#colDone = false;

    // Speech
    this.dialogues = null;
  }

  init() {}

  update(dt) {}

  draw() {
    Renderer.vimage("spritesheet", this.src, this.dst);

    if (DEBUG) Renderer.vrect(this.dst.pos, this.dst.dim);
  }

  nextDialogue() {
    if (!this.dialogues) return;

    ++this.#dialogueColi;

    this.#colDone = false;
    this.#rowDone = false;

    if (this.#dialogueColi >= this.dialogues[this.#dialogueRowi].length) {
      this.#dialogueColi = 0;
      this.#colDone = true;

      ++this.#dialogueRowi;

      if (this.#dialogueRowi >= this.dialogues.length) {
        this.#dialogueRowi = 0;
        this.#rowDone = true;
      }
    }
  }

  currentLine() {
    return this.dialogues[this.#dialogueRowi][this.#dialogueColi];
  }

  // Accessors
  get colDone() { return this.#colDone; }
  get rowDone() { return this.#rowDone; }
};
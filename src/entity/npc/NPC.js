import Entity from "../Entity";
import Renderer from "../../gfx/Renderer";
import { DEBUG } from "../../game/constants";

export default class NPC extends Entity {
  #dialogues;    // Array of speech
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

    // TEMP
    this.#dialogues    = new Array(2);
    this.#dialogues[0] = new Array(3);
    this.#dialogues[1] = new Array(3);

    this.#dialogues[0][0] = "TEST 0 0";
    this.#dialogues[0][1] = "TEST 0 1";
    this.#dialogues[0][2] = "TEST 0 2";

    this.#dialogues[1][0] = "TEST 1 0";
    this.#dialogues[1][1] = "TEST 1 1";
    this.#dialogues[1][2] = "TEST 1 2";
  }

  init() {}

  update(dt) {}

  draw() {
    Renderer.vimage("spritesheet", this.src, this.dst);

    if (DEBUG) Renderer.vrect(this.dst.pos, this.dst.dim);
  }

  nextDialogue() {
    ++this.#dialogueColi;

    this.#colDone = false;
    this.#rowDone = false;

    if (this.#dialogueColi >= this.#dialogues[this.#dialogueRowi].length) {
      this.#dialogueColi = 0;
      this.#colDone = true;

      ++this.#dialogueRowi;

      if (this.#dialogueRowi >= this.#dialogues.length) {
        this.#dialogueRowi = 0;
        this.#rowDone = true;
      }
    }
  }

  currentLine() {
    return this.#dialogues[this.#dialogueRowi][this.#dialogueColi];
  }

  // Accessors
  get colDone() { return this.#colDone; }
  get rowDone() { return this.#rowDone; }
};
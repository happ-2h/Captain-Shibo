import Renderer from "../gfx/Renderer";
import { WINDOW_HEIGHT, WINDOW_WIDTH } from "./constants";

export default class Game {
  #cnv;  // HTML canvas reference
  #last; // Holds the previous RAF timestamp

  constructor() {
    // Init canvas properties
    this.#cnv = document.querySelector("canvas");
    this.#cnv.width  = WINDOW_WIDTH;
    this.#cnv.height = WINDOW_HEIGHT;
    this.#cnv.autofocus = true;

    this.#last = 0;

    this.init();
  }

  init() {
    Renderer.init(this.#cnv.getContext("2d"));

    this.#last = performance.now();
    this.update(this.#last);
  }

  update(ts) {
    const dt = (ts - this.#last) / 1000;
    this.#last = ts;

    requestAnimationFrame(this.update.bind(this));

    this.render(dt);
  }

  render(dt) {
    Renderer.clear(this.#cnv.width, this.#cnv.height);

    Renderer.text(1/dt, 32, 32);
  }
};
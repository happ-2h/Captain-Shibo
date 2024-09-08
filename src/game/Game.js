import Player from "../entity/mobile/player/Player";
import Renderer from "../gfx/Renderer";
import AssetHandler from "../utils/AssetHandler";
import { DEBUG, WINDOW_HEIGHT, WINDOW_WIDTH } from "./constants";

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

    // TEMP
    this.player = new Player;

    // Poll assets
    AssetHandler.poll("spritesheet", "spritesheet.png");

    // If assets successfully loaded, start game loop
    AssetHandler.load()
      .then(val => this.init())
      .catch(err => console.error(err));
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

    // TEMP
    this.player.update(dt);

    this.render(dt);
  }

  render(dt) {
    Renderer.clear(this.#cnv.width, this.#cnv.height);

    this.player.draw();

    if (DEBUG) Renderer.text(1/dt, 32, 32);
  }
};
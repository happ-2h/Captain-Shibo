import Renderer from "../gfx/Renderer";
import GamepadHandler from "../input/GamepadHandler";
import AssetHandler from "../utils/AssetHandler";
import { DEBUG, WINDOW_HEIGHT, WINDOW_WIDTH } from "./constants";
import Settings from "../utils/Settings";
import StateHandler from "./state/StateHandler";
import TitleScreenState from "./state/TitleScreenState";
import GameState from "./state/GameState";

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

    // Poll assets
    // - Images
    AssetHandler.poll("spritesheet", "spritesheet.png");
    AssetHandler.poll("enemyship01", "enemyship_01.png");
    AssetHandler.poll("logo", "logo.png");
    // - Maps
    /*AssetHandler.poll("test_map", "test_map.json");
    AssetHandler.poll("test_forest", "test_forest.json");
    AssetHandler.poll("test_battleBKGD", "test_battleBKGD.json");
    AssetHandler.poll("building_test", "building_test.json");
    AssetHandler.poll("space_bkgd", "space_bkgd.json");*/
    AssetHandler.poll("town_map", "town_map.json");
    // - Sounds
    AssetHandler.poll("notif", "notif.wav");
    AssetHandler.poll("open_chest", "open_chest.wav");
    AssetHandler.poll("bkgd_test", "bkgd_test.ogg");
    AssetHandler.poll("bkgd_forest_test", "bkgd_forest_test.ogg");
    AssetHandler.poll("battlemusic", "battlemusic.ogg");
    AssetHandler.poll("bkgd_building_test", "bkgd_building_test.ogg");

    // If assets successfully loaded, start game loop
    AssetHandler.load()
      .then(val  => this.init())
      .catch(err => console.error(err));
  }

  init() {
    Settings.load();
    // StateHandler.push(new TitleScreenState);
    StateHandler.push(new GameState);

    Renderer.init(this.#cnv.getContext("2d", {alpha: false}));

    this.#last = performance.now();
    this.update(this.#last);
  }

  update(ts) {
    const dt = (ts - this.#last) / 1000;
    this.#last = ts;

    requestAnimationFrame(this.update.bind(this));

    if (GamepadHandler.index !== null) GamepadHandler.update();

    StateHandler.update(dt);

    this.render(dt);
  }

  render(dt) {
    // NOTE: May not be needed
    // Renderer.clear(this.#cnv.width, this.#cnv.height);

    StateHandler.render();

    if (DEBUG) Renderer.text(1/dt, 32, 32, "red");
  }
};
import Renderer         from "../gfx/Renderer";
import GamepadHandler   from "../input/GamepadHandler";
import AssetHandler     from "../utils/AssetHandler";
import Settings         from "../utils/Settings";
import StateHandler     from "./state/StateHandler";
import TitleScreenState from "./state/TitleScreenState";
import GameState        from "./state/GameState";

import {
  DEBUG,
  WINDOW_HEIGHT,
  WINDOW_WIDTH
} from "./constants";

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
    AssetHandler.poll("town_map", "town_map.json");
    AssetHandler.poll("forest_felis", "forest_felis.json");
    AssetHandler.poll("battle_forest_bkgd", "battle_forest_bkgd.json");
    AssetHandler.poll("shipshop", "building_town_shipshop.json");
    AssetHandler.poll("huskyhome", "building_town_home_husky.json");
    AssetHandler.poll("space_bkgd", "space_bkgd.json");
    // - Sounds
    AssetHandler.poll("notif", "notif.wav");
    AssetHandler.poll("open_chest", "open_chest.wav");
    AssetHandler.poll("bkgd_test", "bkgd_test.ogg");
    AssetHandler.poll("bkgd_forest_test", "bkgd_forest_test.ogg");
    AssetHandler.poll("battlemusic", "battlemusic.ogg");
    AssetHandler.poll("bkgd_building_test", "bkgd_building_test.ogg");
    AssetHandler.poll("bkgd_shop", "bkgd_shop.ogg");

    // If assets successfully loaded, start game loop
    AssetHandler.load()
      .then(val  => this.init())
      .catch(err => console.error(err));
  }

  init() {
    Settings.load();
    StateHandler.push(new TitleScreenState);

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
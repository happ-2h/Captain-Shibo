import Renderer     from "../../gfx/Renderer";
import KeyHandler   from "../../input/KeyHandler";
import Settings     from "../../utils/Settings";
import StateHandler from "./StateHandler";
import State        from "./State";
import AudioHandler from "../../audio/AudioHandler";
import Vec2D        from "../../math/Vec2D";
import RemapState   from "./RemapState";

import { WINDOW_HEIGHT, WINDOW_WIDTH } from "../constants";

export default class SettingsState extends State {
  #cursor;

  constructor() { super(); }

  onEnter() { this.init(); }
  onExit() { AudioHandler.playMusic(AudioHandler.nowPlaying); }

  init() {
    this.#cursor = {
      pos: new Vec2D(7, 1),
      src: new Vec2D(208, 496),
      limit: 3,
      timer: 0,
      delay: 0.3
    };

    Renderer.setOffset(0, 0);
    AudioHandler.stopAll();
  }

  update(dt) {
    this.#cursor.timer += dt;

    if (this.#cursor.timer >= this.#cursor.delay) {
      // Navigation
      if (KeyHandler.isDown(Settings.keyDown)) {
        this.#cursor.timer = 0;
        this.#cursor.pos.y =
          this.#cursor.pos.y + 1 > this.#cursor.limit
            ? 1
            : this.#cursor.pos.y + 1;
      }
      else if (KeyHandler.isDown(Settings.keyUp)) {
        this.#cursor.timer = 0;
        this.#cursor.pos.y =
          this.#cursor.pos.y - 1 < 1
            ? this.#cursor.limit
            : this.#cursor.pos.y - 1;
      }

      // Volume adjustment
      if (KeyHandler.isDown(Settings.keyLeft)) {
        this.#cursor.timer = 0;
        if (this.#cursor.pos.y === 1) Settings.decMusicVol();
      }
      else if (KeyHandler.isDown(Settings.keyRight)) {
        this.#cursor.timer = 0;
        if (this.#cursor.pos.y === 1) Settings.incMusicVol();
      }

      // Action
      if (KeyHandler.isDown(Settings.keyAction)) {
        this.#cursor.timer = 0;

        if (this.#cursor.pos.y === 2) StateHandler.push(new RemapState);
        else if (this.#cursor.pos.y === 3) StateHandler.pop();
      }
    }
  }

  render() {
    Renderer.rect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT, "#A593A5", true);

    this.#drawText(8, 1);

    // Cursor
    Renderer.image(
      "spritesheet",
      this.#cursor.src.x, this.#cursor.src.y, 8, 8,
      this.#cursor.pos.x * 16 + 4,
      this.#cursor.pos.y * 16 + 4,
      8, 8
    );
  }

  /**
   * @brief Renders menu text
   *
   * @param {Number} startX - x-position of the menu
   * @param {Number} startY - y-position of the menu
   */
  #drawText(startX=0, startY=0) {
    const sx = startX;

    // Volume
    [ ..."vol" ].forEach(c => {
      Renderer.image(
        "spritesheet",
        (c.charCodeAt(0) - 'a'.charCodeAt(0))<<3,
        496, 8, 8,
        ((startX++)<<4) + 4,
        (startY<<4) + 4,
        8, 8
      );
    });

    // Volume value
    ++startX;

    let vol =
      Settings.volMusic     === 0 ? "0.0"
        : Settings.volMusic === 1 ? "1.0"
        : Settings.volMusic.toString();

    Renderer.image(
      "spritesheet",
      (vol[0].charCodeAt(0) - '0'.charCodeAt(0))<<3,
      504, 8, 8,
      ((startX++)<<4) + 4,
      (startY<<4) + 4,
      8, 8
    );
    Renderer.image(
      "spritesheet",
      80,
      504, 8, 8,
      (startX++)*16 + 4,
      startY * 16 + 4,
      8, 8
    );
    Renderer.image(
      "spritesheet",
      (vol[2].charCodeAt(0) - '0'.charCodeAt(0))<<3,
      504, 8, 8,
      ((startX++)<<4) + 4,
      (startY<<4) + 4,
      8, 8
    );

    startX = sx;
    ++startY;

    // Remap
    [..."remap"].forEach(c => {
      Renderer.image(
        "spritesheet",
        (c.charCodeAt(0) - 'a'.charCodeAt(0))<<3,
        496, 8, 8,
        ((startX++)<<4) + 4,
        (startY<<4) + 4,
        8, 8
      );
    });

    startX = sx;
    ++startY;

    // Exit
    [..."exit"].forEach(c => {
      Renderer.image(
        "spritesheet",
        (c.charCodeAt(0) - 'a'.charCodeAt(0))<<3,
        496, 8, 8,
        ((startX++)<<4) + 4,
        (startY<<4) + 4,
        8, 8
      );
    });
  }
};
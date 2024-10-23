import Renderer      from "../../gfx/Renderer";
import KeyHandler    from "../../input/KeyHandler";
import Vec2D         from "../../math/Vec2D";
import State         from "./State";
import Settings      from "../../utils/Settings";
import StateHandler  from "./StateHandler";
import SettingsState from "./SettingsState";
import GameState     from "./GameState";

import { lerp } from "../../math/utils";
import {
  DEBUG,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  WINDOW_HEIGHT,
  WINDOW_WIDTH
} from "../constants";

export default class TitleScreenState extends State {
  #logo;
  #cursor;
  #destination;
  #phase;

  constructor() { super(); }

  onEnter() { this.init(); }
  onExit()  { StateHandler.push(new GameState); }

  init() {
    this.#logo = {
      pos: new Vec2D(0, -32),
      dim: new Vec2D(320, 180)
    };
    this.#cursor = {
      pos: new Vec2D(7, 8),
      src: new Vec2D(208, 496),
      timer: 0,
      delay: 0.3
    };

    this.#destination = new Vec2D(0, 0);

    this.#phase = "logo";
  }

  update(dt) {
    if (this.#phase === "logo") {
      this.#logo.pos.x = lerp(
        this.#logo.pos.x,
        this.#destination.x,
        0.03
      );
      this.#logo.pos.y = lerp(
        this.#logo.pos.y,
        this.#destination.y,
        0.06
      );

      // Skip logo animation
      if (KeyHandler.isDown(Settings.keyAction)) {
        this.#logo.pos.x = this.#destination.x;
        this.#logo.pos.y = this.#destination.y;
      }

      if (
        this.#logo.pos.x + 0.1 >= this.#destination.x &&
        this.#logo.pos.y + 0.1 >= this.#destination.y
      ) {
        this.#logo.pos.x = this.#destination.x;
        this.#logo.pos.y = this.#destination.y;
        this.#phase = "selection";
      }
    }
    else if (this.#phase === "selection") {
      this.#cursor.timer += dt;

      if (this.#cursor.timer >= this.#cursor.delay) {
        if (KeyHandler.isDown(Settings.keyDown)) {
          this.#cursor.timer = 0;
          this.#cursor.pos.y =
          this.#cursor.pos.y + 1 > 9
            ? 8
            : this.#cursor.pos.y + 1;
        }
        else if (KeyHandler.isDown(Settings.keyUp)) {
          this.#cursor.timer = 0;
          this.#cursor.pos.y =
            this.#cursor.pos.y - 1 < 8
              ? 9
              : this.#cursor.pos.y - 1;
        }
        // Action
        else if (KeyHandler.isDown(Settings.keyAction)) {
          this.#cursor.timer = 0;

          // Start
          if (this.#cursor.pos.y === 8) StateHandler.pop();
          // Settings
          else if (this.#cursor.pos.y === 9) StateHandler.push(new SettingsState);
        }
      }
    }

  }

  render() {
    Renderer.clear(WINDOW_WIDTH, WINDOW_HEIGHT);

    Renderer.rect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT, "#433455", true);

    Renderer.image(
      "logo", 0, 0, this.#logo.dim.x, this.#logo.dim.y,
      this.#logo.pos.x,
      this.#logo.pos.y,
      this.#logo.dim.x,
      this.#logo.dim.y
    );

    if (this.#phase === "selection") {
      // Cursor
      Renderer.image(
        "spritesheet",
        this.#cursor.src.x, this.#cursor.src.y, 8, 8,
        this.#cursor.pos.x * 16 + 4,
        this.#cursor.pos.y * 16 + 4,
        8, 8
      );

      this.#drawText(17, 8);
    }

    if (DEBUG)
      Renderer.drawGrid(20, 12, "rgba(255,255,255,0.3");
  }

  #drawText(startX=0, startY=0) {
    let sx = startX;

    [..."start"].forEach(c => {
      Renderer.image(
        "spritesheet",
        (c.charCodeAt(0) - 'a'.charCodeAt(0))<<3,
        496, 8, 8,
        (startX++)<<3,
        (startY<<4) + 4,
        8, 8
      );
    });

    startX = sx;
    ++startY;

    [..."settings"].forEach(c => {
      Renderer.image(
        "spritesheet",
        (c.charCodeAt(0) - 'a'.charCodeAt(0))<<3,
        496, 8, 8,
        (startX++)<<3,
        (startY<<4) + 4,
        8, 8
      );
    });
  }
};
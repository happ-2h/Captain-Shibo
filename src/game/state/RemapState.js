import Renderer     from "../../gfx/Renderer";
import State        from "./State";
import Settings     from "../../utils/Settings";
import Vec2D        from "../../math/Vec2D";
import KeyHandler   from "../../input/KeyHandler";
import StateHandler from "./StateHandler";

import { WINDOW_WIDTH, WINDOW_HEIGHT } from "../constants";
import GamepadHandler from "../../input/GamepadHandler";

export default class RemapState extends State {
  #cursor;
  #remapping;
  #remapTimer;
  #remapDelay;

  constructor() { super(); }

  onEnter() { this.init(); }
  onExit() {}

  init() {
    this.#cursor = {
      pos: new Vec2D(7, 1),
      src: new Vec2D(208, 496),
      limit: 6,
      timer: 0,
      delay: 0.3
    };

    this.#remapping = false;
    this.#remapTimer = 0;
    this.#remapDelay = 2;

    Renderer.setOffset(0, 0);
  }

  update(dt) {
    this.#cursor.timer += dt;

    if (!this.#remapping && this.#cursor.timer >= this.#cursor.delay) {
      // Navigation
      if (KeyHandler.isDown(Settings.keyDown) || GamepadHandler.isDpadDown()) {
        this.#cursor.timer = 0;
        this.#cursor.pos.y =
          this.#cursor.pos.y + 1 > this.#cursor.limit
            ? 1
            : this.#cursor.pos.y + 1;
      }
      else if (KeyHandler.isDown(Settings.keyUp) || GamepadHandler.isDpadUp()) {
        this.#cursor.timer = 0;
        this.#cursor.pos.y =
          this.#cursor.pos.y - 1 < 1
            ? this.#cursor.limit
            : this.#cursor.pos.y - 1;
      }

      // Action
      if (KeyHandler.isDown(Settings.keyAction) || GamepadHandler.action0) {
        this.#cursor.timer = 0;

        // Exit
        if (this.#cursor.pos.y === 6) StateHandler.pop();
        // Remap
        else {
          this.#remapping = true;
          this.#remapTimer = 0;
          KeyHandler.clearLast();
        }
      }
    }
    else if (this.#remapping) {
      this.#remapTimer += dt;

      if (KeyHandler.lastPressed !== -1) {
        switch(this.#cursor.pos.y) {
          case 1: Settings.keyUp     = KeyHandler.lastPressed; break;
          case 2: Settings.keyDown   = KeyHandler.lastPressed; break;
          case 3: Settings.keyLeft   = KeyHandler.lastPressed; break;
          case 4: Settings.keyRight  = KeyHandler.lastPressed; break;
          case 5: Settings.keyAction = KeyHandler.lastPressed; break;
        }
      }

      if (this.#remapTimer >= this.#remapDelay) {
        this.#remapTimer = 0;
        this.#remapping = false;
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

  #drawText(startX=0, startY=0) {
    const sx = startX;
    let imgx = 0;
    let imgy = 0;

    // Directional
    [ ..."up" ].forEach(c => {
      Renderer.image(
        "spritesheet",
        (c.charCodeAt(0) - 'a'.charCodeAt(0))<<3,
        496, 8, 8,
        ((startX++)<<4) + 4,
        (startY<<4) + 4,
        8, 8
      );
    });

    ++startX;
    ++startX;
    ++startX;
    ++startX;
    ++startX;

    switch(Settings.keyUp) {
      // Arrow keys
      case 37:
        imgx = 192;
        imgy = 504;
        break;
      case 38:
        imgx = 200;
        imgy = 504;
        break;
      case 39:
        imgx = 208;
        imgy = 504;
        break;
      case 40:
        imgx = 216;
        imgy = 504;
        break;
      // Other
      default:
        imgy = 496;
        imgx = (
          String.fromCharCode(Settings.keyUp)
            .toLocaleLowerCase()
            .charCodeAt(0) - 'a'.charCodeAt(0))<<3;
        break;
    }

    Renderer.image(
      "spritesheet",
      imgx, imgy, 8, 8,
      (startX<<4) + 4,
      (startY<<4) + 4,
      8, 8
    );

    startX = sx;
    ++startY;

    [ ..."down" ].forEach(c => {
      Renderer.image(
        "spritesheet",
        (c.charCodeAt(0) - 'a'.charCodeAt(0))<<3,
        496, 8, 8,
        ((startX++)<<4) + 4,
        (startY<<4) + 4,
        8, 8
      );
    });

    ++startX;
    ++startX;
    ++startX;

    switch(Settings.keyDown) {
      // Arrow keys
      case 37:
        imgx = 192;
        imgy = 504;
        break;
      case 38:
        imgx = 200;
        imgy = 504;
        break;
      case 39:
        imgx = 208;
        imgy = 504;
        break;
      case 40:
        imgx = 216;
        imgy = 504;
        break;
      // Other
      default:
        imgy = 496;
        imgx = (
          String.fromCharCode(Settings.keyDown)
            .toLocaleLowerCase()
            .charCodeAt(0) - 'a'.charCodeAt(0))<<3;
        break;
    }

    Renderer.image(
      "spritesheet",
      imgx, imgy, 8, 8,
      (startX<<4) + 4,
      (startY<<4) + 4,
      8, 8
    );

    startX = sx;
    ++startY;

    [ ..."left" ].forEach(c => {
      Renderer.image(
        "spritesheet",
        (c.charCodeAt(0) - 'a'.charCodeAt(0))<<3,
        496, 8, 8,
        ((startX++)<<4) + 4,
        (startY<<4) + 4,
        8, 8
      );
    });

    ++startX;
    ++startX;
    ++startX;

    switch(Settings.keyLeft) {
      // Arrow keys
      case 37:
        imgx = 192;
        imgy = 504;
        break;
      case 38:
        imgx = 200;
        imgy = 504;
        break;
      case 39:
        imgx = 208;
        imgy = 504;
        break;
      case 40:
        imgx = 216;
        imgy = 504;
        break;
      // Other
      default:
        imgy = 496;
        imgx = (
          String.fromCharCode(Settings.keyLeft)
            .toLocaleLowerCase()
            .charCodeAt(0) - 'a'.charCodeAt(0))<<3;
        break;
    }

    Renderer.image(
      "spritesheet",
      imgx, imgy, 8, 8,
      (startX<<4) + 4,
      (startY<<4) + 4,
      8, 8
    );

    startX = sx;
    ++startY;

    [ ..."right" ].forEach(c => {
      Renderer.image(
        "spritesheet",
        (c.charCodeAt(0) - 'a'.charCodeAt(0))<<3,
        496, 8, 8,
        ((startX++)<<4) + 4,
        (startY<<4) + 4,
        8, 8
      );
    });

    ++startX;
    ++startX;

    switch(Settings.keyRight) {
      // Arrow keys
      case 37:
        imgx = 192;
        imgy = 504;
        break;
      case 38:
        imgx = 200;
        imgy = 504;
        break;
      case 39:
        imgx = 208;
        imgy = 504;
        break;
      case 40:
        imgx = 216;
        imgy = 504;
        break;
      // Other
      default:
        imgy = 496;
        imgx = (
          String.fromCharCode(Settings.keyRight)
            .toLocaleLowerCase()
            .charCodeAt(0) - 'a'.charCodeAt(0))<<3;
        break;
    }

    Renderer.image(
      "spritesheet",
      imgx, imgy, 8, 8,
      (startX<<4) + 4,
      (startY<<4) + 4,
      8, 8
    );

    startX = sx;
    ++startY;

    [ ..."action" ].forEach(c => {
      Renderer.image(
        "spritesheet",
        (c.charCodeAt(0) - 'a'.charCodeAt(0))<<3,
        496, 8, 8,
        ((startX++)<<4) + 4,
        (startY<<4) + 4,
        8, 8
      );
    });

    ++startX;

    switch(Settings.keyAction) {
      // Arrow keys
      case 37:
        imgx = 192;
        imgy = 504;
        break;
      case 38:
        imgx = 200;
        imgy = 504;
        break;
      case 39:
        imgx = 208;
        imgy = 504;
        break;
      case 40:
        imgx = 216;
        imgy = 504;
        break;
      // Other
      default:
        imgy = 496;
        imgx = (
          String.fromCharCode(Settings.keyAction)
            .toLocaleLowerCase()
            .charCodeAt(0) - 'a'.charCodeAt(0))<<3;
        break;
    }

    Renderer.image(
      "spritesheet",
      imgx, imgy, 8, 8,
      (startX<<4) + 4,
      (startY<<4) + 4,
      8, 8
    );

    startX = sx;
    ++startY;

    [ ..."back" ].forEach(c => {
      Renderer.image(
        "spritesheet",
        (c.charCodeAt(0) - 'a'.charCodeAt(0))<<3,
        496, 8, 8,
        ((startX++)<<4) + 4,
        (startY<<4) + 4,
        8, 8
      );
    });

    startX = 5;
    startY = 9;

    if (this.#remapping) {
      [ ..."press a key" ].forEach(c => {
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
  }
};
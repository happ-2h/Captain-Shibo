import AudioHandler   from "../../audio/AudioHandler";
import Entity         from "../../entity/Entity";
import Tile_Char      from "../../entity/tile/Tile_Char";
import Renderer       from "../../gfx/Renderer";
import GamepadHandler from "../../input/GamepadHandler";
import KeyHandler     from "../../input/KeyHandler";
import Vec2D          from "../../math/Vec2D";
import Rectangle      from "../../utils/Rectangle";
import Settings       from "../../utils/Settings";
import State          from "./State";
import StateHandler   from "./StateHandler";

import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../constants";

export default class DialogueState extends State {
  #background;  // Background image
  #objSpeaker;  // Object speaking
  #objListener; // Object listening
  #text;        // Raw text instead of a speaker

  #inputTimer;  // Timer for pressing action button
  #inputDelay;  // Delay in milliseconds

  #rect; // Frame placement and size

  #characters;     // Holds characters
  #letterSpeed;    // Speed to display a letter
  #letterTimer;
  #currentLetterIndex;
  #letterLocation; // Where to place a letter on the canvas

  #frame;

  /**
   * @param {String} background  - Image (png) source
   * @param {Entity} objSpeaker  - Speaker object reference
   * @param {Entity} objListener - Listener object reference
   * @param {String} text        - Raw text instead of a speaker
   */
  constructor(background=null, objSpeaker=null, objListener=null, frame=0, text=null) {
    super();

    if (background) {
      this.#background = new Image();
      this.#background.onerror = () => {this.#background = null};
      this.#background.src = background;
    }

    this.#objSpeaker  = objSpeaker;
    this.#objListener = objListener;
    this.#text = text;

    this.#inputTimer = 0;
    this.#inputDelay = 0.4;

    this.#rect = new Rectangle(0, SCREEN_HEIGHT - 40, SCREEN_WIDTH - 8, 32);

    this.#characters = [];
    this.#letterSpeed = 0.05;
    this.#letterTimer = 0;
    this.#currentLetterIndex = 0;
    this.#letterLocation = Vec2D.zero();

    this.#frame = frame;
  }

  onEnter() { AudioHandler.play("notif"); }
  onExit()  {}

  init() {}

  update(dt) {
    this.#parseChars(dt);
    this.#handleInput(dt);
  }

  render() {
    Renderer.imageRaw(this.#background, 0, 0);

    this.#drawFrame();
    this.#characters.forEach(char => char?.draw());
  }

  #handleInput(dt) {
    this.#inputTimer += dt;

    if (this.#inputTimer >= this.#inputDelay) {
      if (KeyHandler.isDown(Settings.keyAction) || GamepadHandler.action0) {
        this.#inputTimer = 0;

        this.#characters = [];
        this.#letterTimer = 0;
        this.#currentLetterIndex = 0;
        this.#letterLocation.reset();

        if (!this.#text) {
          this.#objSpeaker.nextDialogue();

          if (this.#objSpeaker.colDone) StateHandler.pop();
        }
        else StateHandler.pop();
      }
    }
  }

  #parseChars(dt) {
    this.#letterTimer += dt;

    if (this.#letterTimer >= this.#letterSpeed) {
      this.#letterTimer = 0;

      if (
        !(this.#currentLetterIndex >= this.#objSpeaker?.currentLine()?.length) ||
        !(this.#currentLetterIndex >= this.#text?.length)
      ) {
        let char = !this.#text
          ? this.#objSpeaker?.currentLine()[this.#currentLetterIndex]
          : this.#text[this.#currentLetterIndex];

        if (char === ' ') ++this.#letterLocation.x;
        else if (char === '>') {
          this.#letterLocation.x = 0;
          ++this.#letterLocation.y;
        }
        else {
          this.#characters.push(new Tile_Char(
            (this.#rect.x + 8) + (this.#letterLocation.x * 8),
            (this.#rect.y + 8) + (this.#letterLocation.y * 8),
            char
          ));

          ++this.#letterLocation.x;
        }

        ++this.#currentLetterIndex;
      }
    }
  }

  #drawFrame() {
    Renderer.setOffset(0, 0);
    // Frame
    // - Top left
    Renderer.image(
      "spritesheet",
      0 + (this.#frame * 24), 472, 8, 8,
      this.#rect.x,
      this.#rect.y,
      8, 8
    );
    // - Top right
    Renderer.image(
      "spritesheet",
      16 + (this.#frame * 24), 472, 8, 8,
      this.#rect.x + this.#rect.w,
      this.#rect.y,
      8, 8
    );
    // - Bottom left
    Renderer.image(
      "spritesheet",
      0 + (this.#frame * 24), 488, 8, 8,
      this.#rect.x,
      this.#rect.y + this.#rect.h,
      8, 8
    );
    // - Bottom right
    Renderer.image(
      "spritesheet",
      16 + (this.#frame * 24), 488, 8, 8,
      this.#rect.x + this.#rect.w,
      this.#rect.y + this.#rect.h,
      8, 8
    );
    // - Top center
    Renderer.image(
      "spritesheet",
      8 + (this.#frame * 24), 472, 8, 8,
      this.#rect.x + 8,
      this.#rect.y,
      this.#rect.w - 8,
      8
    );
    // - Bottom center
    Renderer.image(
      "spritesheet",
      8 + (this.#frame * 24), 488, 8, 8,
      this.#rect.x + 8,
      this.#rect.y + this.#rect.h,
      this.#rect.w - 8,
      8
    );
    // - Left center
    Renderer.image(
      "spritesheet",
      0 + (this.#frame * 24), 480, 8, 8,
      this.#rect.x,
      this.#rect.y + 8,
      8,
      this.#rect.h - 8
    );
    // - Right center
    Renderer.image(
      "spritesheet",
      16 + (this.#frame * 24), 480, 8, 8,
      this.#rect.x + this.#rect.w,
      this.#rect.y + 8,
      8,
      this.#rect.h - 8
    );
    // - Background
    Renderer.image(
      "spritesheet",
      8 + (this.#frame * 24), 480, 8, 8,
      this.#rect.x + 8,
      this.#rect.y + 8,
      this.#rect.w - 8,
      this.#rect.h - 8
    );
  }
};
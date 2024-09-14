import AudioHandler from "../../audio/AudioHandler";
import Entity from "../../entity/Entity";
import Renderer from "../../gfx/Renderer";
import GamepadHandler from "../../input/GamepadHandler";
import KeyHandler from "../../input/KeyHandler";
import State from "./State";
import StateHandler from "./StateHandler";

export default class DialogueState extends State {
  #background;  // Background image
  #objSpeaker;  // Object speaking
  #objListener; // Object listening
  #text;        // Raw text instead of a speaker

  #inputTimer;  // Timer for pressing action button
  #inputDelay;  // Delay in milliseconds

  /**
   * @param {String} background  - Image (png) source
   * @param {Entity} objSpeaker  - Speaker object reference
   * @param {Entity} objListener - Listener object reference
   * @param {String} text        - Raw text instead of a speaker
   */
  constructor(background=null, objSpeaker=null, objListener=null, text=null) {
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
  }

  onEnter() { AudioHandler.play("notif"); }
  onExit()  {}

  init() {}

  update(dt) {
    this.#inputTimer += dt;

    if (this.#inputTimer >= this.#inputDelay) {
      if (KeyHandler.isDown(90) || GamepadHandler.action0) {
        this.#inputTimer = 0;

        if (!this.#text) {
          this.#objSpeaker.nextDialogue();

          if (this.#objSpeaker.colDone) StateHandler.pop();
        }
        else StateHandler.pop();
      }
    }
  }

  render() {
    Renderer.imageRaw(this.#background, 0, 0);

    if (!this.#text)
      Renderer.text(this.#objSpeaker.currentLine(), 160, 160);
    else
      Renderer.text(this.#text, 160, 160);
  }
};
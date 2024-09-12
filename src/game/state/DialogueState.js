import Entity from "../../entity/Entity";
import Renderer from "../../gfx/Renderer";
import KeyHandler from "../../input/KeyHandler";
import State from "./State";
import StateHandler from "./StateHandler";

export default class DialogueState extends State {
  #background;  // Background image
  #objSpeaker;  // Object speaking
  #objListener; // Object listening

  #inputTimer;  // Timer for pressing action button
  #inputDelay;  // Delay in milliseconds

  /**
   * @param {String} background  - Image (png) source
   * @param {Entity} objSpeaker  - Speaker object reference
   * @param {Entity} objListener - Listener object reference
   */
  constructor(background=null, objSpeaker=null, objListener=null) {
    super();

    if (background) {
      this.#background = new Image();
      this.#background.onerror = () => {this.#background = null};
      this.#background.src = background;
    }

    this.#objSpeaker  = objSpeaker;
    this.#objListener = objListener;

    this.#inputTimer = 0;
    this.#inputDelay = 0.4;
  }

  onEnter() {}
  onExit()  {}

  init() {}

  update(dt) {
    this.#inputTimer += dt;

    if (this.#inputTimer >= this.#inputDelay) {
      if (KeyHandler.isDown(90)) {
        this.#inputTimer = 0;
        this.#objSpeaker.nextDialogue();

        if (this.#objSpeaker.colDone) {
          StateHandler.pop();
        }
      }
    }
  }

  render() {
    Renderer.imageRaw(this.#background, 0, 0);

    Renderer.text(this.#objSpeaker.currentLine(), 160, 160);
  }
};
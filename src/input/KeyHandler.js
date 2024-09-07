let instance = null;

class _KeyHandler {
  #keys;

  constructor() {
    if (instance) throw new Error("KeyHandler singleton reconstructed");

    this.#keys = [];

    onkeydown = this.#keyDown.bind(this);
    onkeyup   = this.#keyDown.bind(this);

    instance = this;
  }

  #keyDown(e) {
    e.preventDefault();

    /*
     * true:  key is down
     * false: key is up
     */
    this.#keys[e.keyCode] = e.type === "keydown";
  }

  /**
   * @brief Check if a key is down based on its key code
   *
   * @param {Number} keycode - Keycode value
   *
   * @returns true if key is down; false otherwise
   */
  isDown(keycode) {
    return this.#keys[keycode];
  }
};

const KeyHandler = new _KeyHandler;
export default KeyHandler;
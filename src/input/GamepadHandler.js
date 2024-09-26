import Vec2D from "../math/Vec2D";
import Settings from "../utils/Settings";

let instance = null;

// TODO Single gamepad objects
class _GamepadHandler {
  #index;

  #vendorID;
  #productID;

  /**
   * TODO
   * Change to objects for remap
   */

  // D-Pad
  #up;
  #down;
  #left;
  #right;

  // Action buttons
  #action0; // PS (X) Xbox (A) Switch (B)
  #action1; // PS (○) Xbox (B) Switch (A)
  #action2; // PS (□) Xbox (X) Switch (Y)
  #action3; // PS (△) Xbox (Y) Switch (X)

  // Analog sticks
  #deadzone;
  #leftstick;
  #rightstick;

  constructor() {
    if (instance) throw new Error("GamepadHandler singleton reconstructed");

    this.#index = null;

    // D-Pad
    this.#up    = false;
    this.#down  = false;
    this.#left  = false;
    this.#right = false;

    // Action buttons
    this.#action0 = false;
    this.#action1 = false;
    this.#action2 = false;
    this.#action3 = false;

    // Analog sticks
    this.#deadzone = 0.5;
    this.#leftstick  = Vec2D.zero();
    this.#rightstick = Vec2D.zero();

    addEventListener("gamepadconnected", e => {
      this.#index = e.gamepad.index;

      const reg = e.gamepad.id.match(/Vendor: (\w+) Product: (\w+)/);
      this.#vendorID  = reg[1];
      this.#productID = reg[2];
    });

    addEventListener("gamepaddisconnected", e => {
      this.#index = null;
    });

    instance = this;
  }

  init() {}

  update() {
    const gamepad = navigator.getGamepads()[this.#index];

    // D-Pad
    this.#up    = gamepad.buttons[12].pressed;
    this.#down  = gamepad.buttons[13].pressed;
    this.#left  = gamepad.buttons[14].pressed;
    this.#right = gamepad.buttons[15].pressed;

    // Action buttons
    this.#action0 = gamepad.buttons[Settings.gamepadAction].pressed; // TEMP
    this.#action1 = gamepad.buttons[1].pressed;
    this.#action2 = gamepad.buttons[2].pressed;
    this.#action3 = gamepad.buttons[3].pressed;

    // Analog sticks
    this.#leftstick.x  = gamepad.axes[0];
    this.#leftstick.y  = gamepad.axes[1];
    this.#rightstick.x = gamepad.axes[2];
    this.#rightstick.y = gamepad.axes[3];
  }

  // Utils
  /**
   * @brief Apply dual-rumble haptic feedback to the hardware
   *
   * @param {Number} intensity - Rumble intensity
   * @param {Number} time      - Duration in milliseconds
   */
  vibrate(intensity, time=0) {
    const gamepad = navigator.getGamepads()[this.#index];

    // gamepad.hapticActuators[0].pulse(intensity, time);

    gamepad.vibrationActuator.playEffect("dual-rumble", {
      startDelay: 0,
      duration: time,
      weakMagnitude:   intensity,
      strongMagnitude: intensity
    });
  }

  // Accessors
  isDpadUp()    { return this.#up; }
  isDpadDown()  { return this.#down; }
  isDpadLeft()  { return this.#left; }
  isDpadRight() { return this.#right; }

  get index()     { return this.#index; }
  get productID() { return this.#productID; }
  get vendorID()  { return this.#vendorID; }

  get deadzone()     { return this.#deadzone; }
  get leftStick_x()  { return this.#leftstick.x; }
  get leftStick_y()  { return this.#leftstick.y; }
  get rightStick_x() { return this.#rightstick.x; }
  get rightStick_y() { return this.#rightstick.y; }

  get action0() { return this.#action0; }
  get action1() { return this.#action1; }
  get action2() { return this.#action2; }
  get action3() { return this.#action3; }

  // Mutators
  set deadzone(deadzone) { this.#deadzone = deadzone; }
};

const GamepadHandler = new _GamepadHandler;
export default GamepadHandler;
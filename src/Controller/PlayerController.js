import GamepadHandler from "../input/GamepadHandler";
import KeyHandler from "../input/KeyHandler";
import Controller from "./Controller";

export default class PlayerController extends Controller {
  constructor() { super(); }

  isRequestingUp() {
    return KeyHandler.isDown(38) ||
           GamepadHandler.isDpadUp() ||
           GamepadHandler.leftStick_y < -GamepadHandler.deadzone;
  }

  isRequestingDown() {
    return KeyHandler.isDown(40) ||
           GamepadHandler.isDpadDown() ||
           GamepadHandler.leftStick_y > GamepadHandler.deadzone;
  }

  isRequestingLeft() {
    return KeyHandler.isDown(37) ||
           GamepadHandler.isDpadLeft() ||
           GamepadHandler.leftStick_x < -GamepadHandler.deadzone;
  }

  isRequestingRight() {
    return KeyHandler.isDown(39) ||
           GamepadHandler.isDpadRight() ||
           GamepadHandler.leftStick_x > GamepadHandler.deadzone;
  }

  isRequestingA() {
    return KeyHandler.isDown(90) ||
           GamepadHandler.action0;
  }
};
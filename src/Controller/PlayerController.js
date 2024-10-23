import GamepadHandler from "../input/GamepadHandler";
import KeyHandler     from "../input/KeyHandler";
import Settings       from "../utils/Settings";
import Controller     from "./Controller";

export default class PlayerController extends Controller {
  constructor() { super(); }

  isRequestingUp() {
    return KeyHandler.isDown(Settings.keyUp) ||
           GamepadHandler.isDpadUp() ||
           GamepadHandler.leftStick_y < -GamepadHandler.deadzone;
  }

  isRequestingDown() {
    return KeyHandler.isDown(Settings.keyDown) ||
           GamepadHandler.isDpadDown() ||
           GamepadHandler.leftStick_y > GamepadHandler.deadzone;
  }

  isRequestingLeft() {
    return KeyHandler.isDown(Settings.keyLeft) ||
           GamepadHandler.isDpadLeft() ||
           GamepadHandler.leftStick_x < -GamepadHandler.deadzone;
  }

  isRequestingRight() {
    return KeyHandler.isDown(Settings.keyRight) ||
           GamepadHandler.isDpadRight() ||
           GamepadHandler.leftStick_x > GamepadHandler.deadzone;
  }

  isRequestingA() {
    return KeyHandler.isDown(Settings.keyAction) ||
           GamepadHandler.action0;
  }

  isRequestingPause() {
    return KeyHandler.isDown(Settings.keyPause);
  }
};
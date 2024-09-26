import GamepadHandler from "../../input/GamepadHandler";
import KeyHandler from "../../input/KeyHandler";
import Settings from "../../utils/Settings";
import Controller from "../Controller";

export default class ShipController extends Controller {
  constructor() { super(); }

  isRequestingUp() {
    return KeyHandler.isDown(Settings.keyUp) ||
           GamepadHandler.isDpadUp();
  }

  isRequestingDown() {
    return KeyHandler.isDown(Settings.keyDown) ||
           GamepadHandler.isDpadDown();
  }

  isRequestingLeft() {
    return KeyHandler.isDown(Settings.keyLeft) ||
           GamepadHandler.isDpadLeft();
  }

  isRequestingRight() {
    return KeyHandler.isDown(Settings.keyRight) ||
           GamepadHandler.isDpadRight();
  }

  isRequestingA() {
    return KeyHandler.isDown(Settings.keyAction) ||
           GamepadHandler.action0;
  }


  isUsingJoystick() {
    return GamepadHandler.leftStick_x > GamepadHandler.deadzone  ||
           GamepadHandler.leftStick_x < -GamepadHandler.deadzone ||
           GamepadHandler.leftStick_y > GamepadHandler.deadzone  ||
           GamepadHandler.leftStick_y < -GamepadHandler.deadzone;
  }


};
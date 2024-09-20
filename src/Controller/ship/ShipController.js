import GamepadHandler from "../../input/GamepadHandler";
import KeyHandler from "../../input/KeyHandler";
import Controller from "../Controller";

export default class ShipController extends Controller {
  constructor() { super(); }

  isRequestingUp() {
    return KeyHandler.isDown(38) ||
           GamepadHandler.isDpadUp();
  }

  isRequestingDown() {
    return KeyHandler.isDown(40) ||
           GamepadHandler.isDpadDown();
  }

  isRequestingLeft() {
    return KeyHandler.isDown(37) ||
           GamepadHandler.isDpadLeft();
  }

  isRequestingRight() {
    return KeyHandler.isDown(39) ||
           GamepadHandler.isDpadRight();
  }

  isRequestingA() {
    return KeyHandler.isDown(90) ||
           GamepadHandler.action0;
  }


  isUsingJoystick() {
    return GamepadHandler.leftStick_x > GamepadHandler.deadzone  ||
           GamepadHandler.leftStick_x < -GamepadHandler.deadzone ||
           GamepadHandler.leftStick_y > GamepadHandler.deadzone  ||
           GamepadHandler.leftStick_y < -GamepadHandler.deadzone;
  }


};
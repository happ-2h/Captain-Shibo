export default class State {
  #gameobjects;

  constructor() {
    if (this.constructor === State)
      throw new Error("Can't instantiate abstract class State");

    if (this.onEnter === undefined)
      throw new Error("onEnter() must be implemented");
    if (this.onExit === undefined)
      throw new Error("onExit() must be implemented");

    if (this.init === undefined)
      throw new Error("init() must be implemented");
    if (this.update === undefined)
      throw new Error("update(dt) must be implemented");
    if (this.render === undefined)
      throw new Error("render() must be implemented");

    this.#gameobjects = [];
  }

  get gameObjects() { return this.#gameobjects; }
};
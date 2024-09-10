import State from "./State";

let instance = null;

class _StateHandler {
  #states; // Holds all states

  constructor() {
    if (instance) throw new Error("StateHandler singleton reconstructed");

    this.#states = [];

    instance = this;
  }

  /**
   * @brief Pushes a new state to process
   *
   * @param {State} state - State to currently process
   */
  push(state) {
    if (state instanceof State) {
      state.onEnter();
      this.#states.push(state);
    }
  }

  /**
   * @brief Removes the current state
   */
  pop() {
    this.#states.pop()?.onExit();
  }

  /**
   * @brief Calls the init method of the current state
   */
  init() {
    this.#states[this.#states.length - 1]?.init();
  }

  /**
   * @brief Calls the update method of the current state
   *
   * @param {Number} dt - Delta time
   */
  update(dt) {
    this.#states[this.#states.length - 1]?.update(dt);
  }

  /**
   * @brief Calls the render method of the current state
   */
  render() {
    this.#states[this.#states.length - 1]?.render();
  }

  // Utils
  /**
   * @brief Clears the state stack
   */
  clear() {
    this.#states = [];
  }

  /**
   * @returns Number of states in the stack
   */
  length() {
    return this.#states.length;
  }
};

const StateHandler = new _StateHandler;
export default StateHandler;
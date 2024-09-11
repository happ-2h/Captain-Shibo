export default class Animation {
  #currentSequence;
  #currentFrame;
  #speed;
  #speedTimer;

  /**
   *
   * @param {Array} sequence - Sequence of images used for animation
   * @param {Number} speed   - Speed, in frames, to display one image
   */
  constructor(sequence, speed) {
    this.#currentSequence = [ ...sequence ];
    this.#currentFrame = 0;
    this.#speed = speed;
    this.#speedTimer = 0;
  }

  init() {
    this.#currentSequence = [];
    this.#currentFrame = 0;
    this.#speed = 0;
    this.#speedTimer = 0;
  }

  update(dt) {
    ++this.#speedTimer;

    if (this.#speedTimer >= this.#speed) {
      this.#speedTimer = 0;
      this.#currentFrame =
        this.#currentFrame + 1 >= this.#currentSequence.length
          ? 0
          : this.#currentFrame + 1;
    }
  }

  /**
   * @brief Sets a new animaion
   *
   * @param {Array} sequence -  Sequence of images used for animation
   * @param {Number} speed   - Speed, in frames, to display one image
   */
  setAnimation(sequence, speed) {
    this.init();
    this.#currentSequence = [ ...sequence ];
    this.#speed = speed;
  }

  // Accessors
  get currentFrame() { return this.#currentSequence[this.#currentFrame]; }

  // Mutators
  set currentFrame(cf) { this.#currentFrame = cf; }
};
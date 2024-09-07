let instance = null;

class _Renderer {
  /**@type {CanvasRenderingContext2D} */
  #ctx; // Drawing context reference

  constructor() {
    this.#ctx = null;
  }

  init(context2d) {
    if (context2d) {
      this.#ctx = context2d;

      this.#ctx.font = "24px Arial";
      this.#ctx.imageSmoothingEnabled = false;
    }
  }

  clear(width=1, height=1) {
    this.#ctx.clearRect(0, 0, width, height);
  }

  text(text="SAMPLE", x=0, y=0, color="black") {
    this.#ctx.fillStyle = color;
    this.#ctx.fillText(text, x, y);
  }
};

const Renderer = new _Renderer;
export default Renderer;
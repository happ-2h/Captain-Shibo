import { GAME_SCALE } from "../game/constants";

let instance = null;

class _Renderer {
  /**@type {CanvasRenderingContext2D} */
  #ctx; // Drawing context reference

  constructor() {
    if (instance) throw new Error("Renderer singleton reconstructed");

    this.#ctx = null;

    instance = this;
  }

  /**
   * @brief Initializes the drawing context
   *
   * @param {CanvasRenderingContext2D} context2d - Drawing context
   */
  init(context2d) {
    if (context2d) {
      this.#ctx = context2d;

      // Init context properties
      this.#ctx.font = "24px Arial";
      this.#ctx.imageSmoothingEnabled = false;
    }
  }

  /**
   * @brief Clears a rectangular section of the canvas from (0, 0) to (width, height)
   *
   * @param {Number} width  - Width of the area to clear
   * @param {Number} height - Height of the area to clear
   */
  clear(width=1, height=1) {
    this.#ctx.clearRect(0, 0, width, height);
  }

  /**
   * @brief Displays ASCII text on the canvas
   *
   * @param {String} text  - Text to display
   * @param {Number} x     - Abscissa to place the text
   * @param {Number} y     - Ordinate to place the text
   * @param {String} color - Color of the text
   */
  text(text="SAMPLE", x=0, y=0, color="black") {
    this.#ctx.fillStyle = color;
    this.#ctx.fillText(text, x, y);
  }

  // Vector functions
  /**
   * @brief Draws a rectangle\
   *        Uses Vec2D for positioning and dimension
   *
   * @param {Vec2D} pos      - Vector to use for the position
   * @param {Vec2D} dim      - Vector to use as dimension (width, height)
   * @param {String} color   - Color of the rectangle
   * @param {Boolean} filled - True fills rectange; stroked (default) otherwise
   */
  vrect(pos=null, dim=null, color="red", filled=false) {
    if (filled) {
      this.#ctx.fillStyle = color;
      this.#ctx.fillRect(
        Math.floor(pos.x * GAME_SCALE),
        Math.floor(pos.y * GAME_SCALE),
        dim.x * GAME_SCALE,
        dim.y * GAME_SCALE
      );
    }
    else {
      this.#ctx.strokeStyle = color;
      this.#ctx.strokeRect(
        Math.floor(pos.x * GAME_SCALE),
        Math.floor(pos.y * GAME_SCALE),
        dim.x * GAME_SCALE,
        dim.y * GAME_SCALE
      );
    }
  }
};

const Renderer = new _Renderer;
export default Renderer;
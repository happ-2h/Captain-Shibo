import { GAME_SCALE, TILE_SIZE } from "../game/constants";
import Vec2D from "../math/Vec2D";
import Rectangle from "../utils/Rectangle";
import TextureHandler from "./TextureHandler";

let instance = null;

class _Renderer {
  /**@type {CanvasRenderingContext2D} */
  #ctx;     // Drawing context reference

  #offset;  // Drawing offset
  #epsilon; // Fixes float positioning glitches

  constructor() {
    if (instance) throw new Error("Renderer singleton reconstructed");

    this.#ctx = null;

    this.#offset  = Vec2D.zero();
    this.#epsilon = 0.01;

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

  /**
   * @brief Draws a rectangle
   *
   * @param {Number} x       - x-position
   * @param {Number} y       - y-position
   * @param {Number} width   - Width  of the rectangle
   * @param {Number} height  - Height of the rectangle
   * @param {String} color   - Color  of the rectangle
   * @param {Boolean} filled - True: filled rectangle; stroked (default) otherwise
   */
  rect(x=0, y=0, width=TILE_SIZE, height=TILE_SIZE, color="red", filled=false) {
    if (filled) {
      this.#ctx.fillStyle = color;
      this.#ctx.fillRect(
        Math.floor((x - this.#offset.x + this.#epsilon) * GAME_SCALE),
        Math.floor((y - this.#offset.y + this.#epsilon) * GAME_SCALE),
        width  * GAME_SCALE,
        height * GAME_SCALE
      );
    }
    else {
      this.#ctx.strokeStyle = color;
      this.#ctx.strokeRect(
        Math.floor((x - this.#offset.x + this.#epsilon) * GAME_SCALE),
        Math.floor((y - this.#offset.y + this.#epsilon) * GAME_SCALE),
        width  * GAME_SCALE,
        height * GAME_SCALE
      );
    }
  }

  /**
   * @brief Draws a blit image
   *
   * @param {String} textureID - ID of the texture to blit
   * @param {Number} sx - x-position of the image  (png file)
   * @param {Number} sy - y-position of the image  (png file)
   * @param {Number} sw - Width of the blit image  (png file)
   * @param {Number} sh - Height of the blit image (png file)
   * @param {Number} dx - x-position to draw at (canvas)
   * @param {Number} dy - y-position to draw at (canvas)
   * @param {Number} dw - Width  of the image   (canvas)
   * @param {Number} dh - Height of the image   (canvas)
   */
  image(textureID, sx=0, sy=0, sw=TILE_SIZE, sh=TILE_SIZE, dx=0, dy=0, dw=TILE_SIZE, dh=TILE_SIZE) {
    this.#ctx.drawImage(
      TextureHandler.getTexture(textureID),
      sx, sy, sw, sh,
      Math.floor((dx - this.#offset.x + this.#epsilon) * GAME_SCALE),
      Math.floor((dy - this.#offset.y + this.#epsilon) * GAME_SCALE),
      dw * GAME_SCALE,
      dh * GAME_SCALE
    );
  }

  /**
   * @brief Draw an image to the canvas. Not related to the game coordinates
   *
   * @param {CanvasImageSource} img - Image to draw
   * @param {Number} x - x-position to draw the image
   * @param {Number} y - y-position to draw the image
   */
  imageRaw(img, x, y) {
    this.#ctx.drawImage(img, x, y);
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
        Math.floor((pos.x - this.#offset.x + this.#epsilon) * GAME_SCALE),
        Math.floor((pos.y - this.#offset.y + this.#epsilon) * GAME_SCALE),
        dim.x * GAME_SCALE,
        dim.y * GAME_SCALE
      );
    }
    else {
      this.#ctx.strokeStyle = color;
      this.#ctx.strokeRect(
        Math.floor((pos.x - this.#offset.x + this.#epsilon) * GAME_SCALE),
        Math.floor((pos.y - this.#offset.y + this.#epsilon) * GAME_SCALE),
        dim.x * GAME_SCALE,
        dim.y * GAME_SCALE
      );
    }
  }

  /**
   * @brief Draws an image to the canvas
   *
   * @param {String} textureID - ID of texture
   * @param {Rectangle} src    - Source rectangle (blit of image file)
   * @param {Rectangle} dst    - Destination rectangle (HTML5 canvas)
   */
  vimage(textureID, src, dst) {
    this.#ctx.drawImage(
      TextureHandler.getTexture(textureID),
      src.pos.x, src.pos.y, src.dim.x, src.dim.y,
      Math.floor((dst.pos.x - this.#offset.x + this.#epsilon) * GAME_SCALE),
      Math.floor((dst.pos.y - this.#offset.y + this.#epsilon) * GAME_SCALE),
      dst.dim.x * GAME_SCALE,
      dst.dim.y * GAME_SCALE
    );
  }

  // Utils
  /**
   * @brief Draws a grid on the canvas\
   *        Useful for tile placement
   *
   * @param {Number} width  - Number of cells to draw horizontally
   * @param {Number} height - Number of cells to draw vertically
   * @param {String} color  - Color of the cells
   */
  drawGrid(width, height, color="black") {
    this.#ctx.strokeStyle = color;

    for (let i = 0; i < width; ++i) {
      for (let j = 0; j < height; ++j) {
        this.rect(
          i * TILE_SIZE,
          j * TILE_SIZE,
          TILE_SIZE, TILE_SIZE,
          color
        );
      }
    }
  }

  /**
   * @brief Offsets all drawings. Commonly used with a camera
   *
   * @param {Number} x - Horizontal offset
   * @param {Number} y - Vertical offset
   */
  setOffset(x, y) { this.#offset.set(x, y); }

  /**
   * @brief Sets the offsets to zero
   */
  resetOffset() { this.#offset.reset(); }

  // Accessors
  get offx() { return this.#offset.x; }
  get offy() { return this.#offset.y; }
};

const Renderer = new _Renderer;
export default Renderer;
import { TILE_SIZE } from "../game/constants";
import Renderer from "../gfx/Renderer";
import Vec2D from "../math/Vec2D";
import Rectangle from "../utils/Rectangle";

export default class Map {
  #dim;    // Dimensions (width, height)
  #layers; // Layers of map arrays

  /**
   * @param {JSON} data - JSON object
   */
  constructor(data) {
    this.#dim = new Vec2D(
      data.width,
      data.height
    );
    this.#layers = [ ...data.layers ];
  }

  /**
   * @brief Draws every layer of the map
   *
   * @param {Rectangle} crop - Rectangle for cropping
   */
  draw(crop) {
    if (!crop) crop = new Rectangle(0, 0, 21, 13);

    // Crop calculations
    let cx = (crop.x>>4);
    let cy = (crop.y>>4);
    let cw = cx + crop.w;
    let ch = cy + crop.h;

    for (let l = 0; l < this.#layers.length; ++l) {
      for (let x = cx; x < cw; ++x) {
        for (let y = cy; y < ch; ++y) {
          let tileID = this.getTile(x, y, l);

          if (tileID > 0) {
            Renderer.image(
              "spritesheet",
              (tileID&0xF)<<4,
              (tileID>>4)<<4,
              TILE_SIZE, TILE_SIZE,
              x*TILE_SIZE,
              y*TILE_SIZE,
              TILE_SIZE,
              TILE_SIZE
            );
          }
        }
      }
    }
  }

  // Utilities
  /**
   * @brief Get the tile number at (x, y)
   *
   * @param {Number} x     - Tile's x-position
   * @param {Number} y     - Tile's y-position
   * @param {Number} layer - Map layer
   *
   * @returns Tile number at (x, y) or -1 on failure
   */
  getTile(x=0, y=0, layer=0) {
    // Floor the input
    x |= 0;
    y |= 0;

    if (x >= 0 && x < this.#dim.x && y >= 0 && y < this.#dim.y)
      return this.#layers[layer].data[x+y*this.#dim.x] - 1;

    return -1;
  }

  /**
   * @brief Set the tile number at (x, y)
   *
   * @param {Number} x      - Tile's x-position
   * @param {Number} y      - Tile's y-position
   * @param {Number} tileID - Tile's number
   * @param {Number} layer  - Map layer
   */
  setTile(x=0, y=0, tileID, layer=0) {
    x |= 0;
    y |= 0;

    if (x >= 0 && x < this.#dim.x && y >= 0 && y < this.#dim.y)
      this.#layers[layer].data[x+y*this.#dim.x] = tileID + 1;

    return -1;
  }
};
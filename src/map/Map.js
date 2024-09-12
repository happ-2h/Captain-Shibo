import Tile from "../entity/tile/Tile";
import Tile_Door from "../entity/tile/Tile_Door";
import { TILE_SIZE } from "../game/constants";
import Renderer from "../gfx/Renderer";
import Vec2D from "../math/Vec2D";
import Rectangle from "../utils/Rectangle";

export default class Map {
  #id;     // Given mapID
  #dim;    // Dimensions (width, height)
  #layers; // Layers of map arrays
  #tiles;  // Container of tile objects

  /**
   * @param {JSON} data    - JSON object
   * @param {String} mapID - UID for this map
   */
  constructor(data, mapID) {
    this.#id = mapID;

    this.#dim = new Vec2D(
      data.width,
      data.height
    );
    this.#layers = [ ...data.layers ];
    this.#tiles = new Array(data.height)
      .fill(null)
      .map(() => new Array(data.width).fill(null));

    this.#initTiles();
  }

  /**
   * @brief Initializes tile objects on layer 1
   */
  #initTiles() {
    if (this.#layers[1]) {
      for (let x = 0; x < this.#dim.x; ++x) {
        for (let y = 0; y < this.#dim.y; ++y) {
          const tileID = this.#layers[1].data[x+y*this.#dim.x] - 1;

          if (tileID > 0) {
            // TEMP format
            switch(tileID) {
              case 1: // Player
                this.#tiles[y][x] = new Tile(x, y, tileID, false, this.#id);
                break;
              case 32: // TEMP solid
                this.#tiles[y][x] = new Tile(x, y, tileID, true, this.#id);
                break;
              case 48: // TEMP NPC
                this.#tiles[y][x] = new Tile(x, y, tileID, true, this.#id);
                break;
              case 33: // TEMP sign
                this.#tiles[y][x] = new Tile(x, y, tileID, true, this.#id);
                break;
              case 100: // TEMP exit
                this.#tiles[y][x] = new Tile(x, y, tileID, false, this.#id);
                break;
              case 103: // TEMP door
                this.#tiles[y][x] = new Tile_Door(x, y, tileID, true, this.#id, ["building_test"], false);
                break;
              default: this.#tiles[y][x] = new Tile(x, y, tileID, true, this.#id); break;
            }
          }
        }
      }
    }
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
          let tileID = this.getTileNum(x, y, l);

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

  /**
   * @brief Draws a single layer of the map
   *
   * @param {Rectangle} crop - Rectangle used for cropping
   * @param {Number} layer   - Map layer to draw
   */
  drawLayer(crop, layer=0) {
    if (!crop) crop = new Rectangle(0, 0, 21, 13);

    // Crop calculations
    let cx = (crop.x>>4);
    let cy = (crop.y>>4);
    let cw = cx + crop.w;
    let ch = cy + crop.h;

    for (let x = cx; x < cw; ++x) {
      for (let y = cy; y < ch; ++y) {
        let tileID = this.getTileNum(x, y, layer);

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
  getTileNum(x=0, y=0, layer=0) {
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
  setTileNum(x=0, y=0, tileID, layer=0) {
    x |= 0;
    y |= 0;

    if (x >= 0 && x < this.#dim.x && y >= 0 && y < this.#dim.y)
      this.#layers[layer].data[x+y*this.#dim.x] = tileID + 1;

    return -1;
  }

  /**
   * @brief Get the Tile object at (x, y) placed on layer 1
   *
   * @param {Number} x - Tile's x-position
   * @param {Number} y - TIle's y-position
   */
  getTileObject(x=0, y=0) {
    x |= 0;
    y |= 0;

    if (x >= 0 && x < this.#dim.x && y >= 0 && y < this.#dim.y)
      return this.#tiles[y][x];

    return null;
  }

  /**
   * @brief Get a layer's data
   *
   * @param {Number} layer - Layer to get
   *
   * @returns Tilemap layer
   */
  getLayer(layer) {
    return this.#layers[layer];
  }

  // Accessors
  get id()     { return this.#id; }
  get width()  { return this.#dim.x; }
  get height() { return this.#dim.y; }
  get tiles()  { return this.#tiles; }
};
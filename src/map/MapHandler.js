import Rectangle from "../utils/Rectangle";
import Map from "./Map";

let instance = null;

class _MapHandler {
  #maps; // Holds all maps

  constructor() {
    if (instance) throw new Error("MapHandler singleton reconstructed");

    this.#maps = [];

    instance = this;
  }

  /**
   * @brief Load a json map
   *
   * @param {String} mapID    - ID to assign to the map
   * @param {String} filename - Name of the map file
   */
  load(mapID, filename) {
    return new Promise((res, rej) => {
      fetch(`res/map/${filename}`)
        .then(val => val.json())
        .then(data => {
          this.#maps[mapID] = new Map(data, mapID);
          res(`${filename} loaded`);
        })
        .catch(err => rej(`Failed to load ${filename}`));
    });
  }

  /**
   * @brief Get a map referenced by the assigned ID
   *
   * @param {String} mapID - ID of the map to get
   *
   * @returns The map object assigned to the mapID
   */
  getMap(mapID) {
    return this.#maps[mapID];
  }

  /**
   * @brief Draws a tile map
   *
   * @param {String} mapID   - ID of the map to draw
   * @param {Rectangle} crop - Rectangle for cropping
   */
  drawMap(mapID, crop) {
    this.#maps[mapID].draw(crop);
  }

  /**
   * @brief Draws a layer of the tilemap
   *
   * @param {String} mapID   - ID of the map to draw
   * @param {Rectangle} crop - Rectangle for cropping
   * @param {Number} layer   - Layer of the map to draw
   */
  drawMapLayer(mapID, crop, layer) {
    this.#maps[mapID].drawLayer(crop, layer);
  }
};

const MapHandler = new _MapHandler;
export default MapHandler;
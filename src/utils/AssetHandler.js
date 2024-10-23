import AudioHandler   from "../audio/AudioHandler";
import TextureHandler from "../gfx/TextureHandler";
import MapHandler     from "../map/MapHandler";

let instance = null;

class _AssetHandler {
  #imgs;   // Image pool
  #maps;   // Map pool
  #snds;   // Sound pool

  #loaded; // Number of assets to load
  #toLoad; // Number of assets loaded

  constructor() {
    if (instance) throw new Error("AssetHandler singleton reconstructed");

    this.#imgs = new Map();
    this.#maps = new Map();
    this.#snds = new Map();

    this.#loaded = 0;
    this.#toLoad = 0;

    instance = this;
  }

  /**
   * @brief Polls an asset for loading
   *
   * @param {String} assetID  - Name of the asset to refer to
   * @param {String} filename - File name of the asset\
   *                            Images: png\
   *                            Maps: json\
   *                            Audio: wav, ogg
   */
  poll(assetID, filename) {
    ++this.#toLoad;

    const ext = filename.split(".").pop();

    if (ext === "png")
      this.#imgs.set(assetID, filename);
    else if (ext === "json")
      this.#maps.set(assetID, filename);
    else if (ext === "wav" || ext === "ogg")
      this.#snds.set(assetID, filename);
    else --this.#toLoad;
  }

  load() {
    return new Promise((res, rej) => {
      this.#imgs.forEach((val, key) => {
        TextureHandler.load(key, val)
          .then(val  => this.#loadHandler(res))
          .catch(err => rej(err));
      });

      this.#maps.forEach((val, key) => {
        MapHandler.load(key, val)
          .then(val  => this.#loadHandler(res))
          .catch(err => rej(err));
      });

      this.#snds.forEach((val, key) => {
        AudioHandler.load(key, val)
          .then(val  => this.#loadHandler(res))
          .catch(err => rej(err));
      });
    });
  }

  #loadHandler(res) {
    ++this.#loaded >= this.#toLoad && res("Assets successfully loaded");
  }
};

const AssetHandler = new _AssetHandler;
export default AssetHandler;
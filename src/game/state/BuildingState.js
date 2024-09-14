import Camera from "../../camera/Camera";
import Player from "../../entity/mobile/player/Player";
import MapHandler from "../../map/MapHandler";
import { TILE_SIZE, WINDOW_HEIGHT, WINDOW_WIDTH } from "../constants";
import State from "./State";
import Renderer from "../../gfx/Renderer";
import Rectangle from "../../utils/Rectangle";
import Tile from "../../entity/tile/Tile";
import StateHandler from "./StateHandler";
import AudioHandler from "../../audio/AudioHandler";

export default class BuildingState extends State {
  #player;
  #prevPos; // Preserve previous state location
  #prevMap; // Preserve the previous map
  #maps;    // Floors
  #currentFloor;

  #bkgdMusic; // Music for this state
  #prevMusic; // Music to replay after leaving

  /**
   *
   * @param {Player} player - Reference to the player
   * @param {String} maps   - Strings of maps representing floors
   */
  constructor(player=null, maps=null, bkgdmusic=null, prevmusic=null) {
    super();
    this.#player = player;
    this.#prevPos = player.dst.pos.clone();
    this.#prevMap = this.#player.map;

    this.#bkgdMusic = bkgdmusic;
    this.#prevMusic = prevmusic;

    this.#maps = [ ...maps ];
    this.#currentFloor = 0;
  }

  onEnter() { this.init(); }
  onExit() {
    AudioHandler.stop(this.#bkgdMusic);
    AudioHandler.playMusic(this.#prevMusic);
  }

  init() {
    this.map = this.#maps[0];

    // Setup world objects
    MapHandler.getMap(this.map).tiles.forEach(row => {
      row.forEach(tile => {
        if (tile) {
          if (tile.type === 1) {
            this.#player.dst.pos.set(
              tile.dst.pos.x * TILE_SIZE,
              tile.dst.pos.y * TILE_SIZE
            );
            this.#player.targetTile.x = this.#player.dst.pos.x;
            this.#player.targetTile.y = this.#player.dst.pos.y;

            this.#player.map = this.map;
            this.gameObjects.push(this.#player);

            this.camera = new Camera(
              tile.dst.pos.x * TILE_SIZE,
              tile.dst.pos.y * TILE_SIZE
            );
          }
          else {
            this.gameObjects.push(new Tile(
              tile.dst.pos.x * TILE_SIZE,
              tile.dst.pos.y * TILE_SIZE,
              tile.type,
              tile.isSolid,
              this.map
            ));
          }
        }
      })
    });

    AudioHandler.stop(this.#prevMusic);
    AudioHandler.setVolume(this.#bkgdMusic, 0.8);
    AudioHandler.setPlaybackRate(this.#bkgdMusic, 1.4);
    AudioHandler.playMusic(this.#bkgdMusic);
  }

  update(dt) {
    this.gameObjects.forEach(go => {
      if (go instanceof Player) {
        go.update(go, dt);

        this.camera.vfocus(go.dst.pos);
        this.camera.update(dt);
      }
      else go.update(dt);
    });

    // Handle building specific tiles
    // - Exit
    if (this.#player.steppingOn(0) === 100 || this.#player.steppingOn(1) === 100) {
      this.#player.dst.pos.copy(this.#prevPos);
      this.#player.targetTile.copy(this.#prevPos);
      this.#player.map = this.#prevMap;
      this.#player.facing = "down";
      StateHandler.pop();
    }
  }

  render() {
    Renderer.clear(WINDOW_WIDTH, WINDOW_HEIGHT);
    Renderer.setOffset(this.camera.x, this.camera.y);
    MapHandler.drawMapLayer(this.map, new Rectangle(this.camera.x, this.camera.y, 21, 13), 0);

    this.gameObjects
      .sort((a, b) => a.dst.pos.y - b.dst.pos.y)
      .forEach(go => go.draw());
  }
};
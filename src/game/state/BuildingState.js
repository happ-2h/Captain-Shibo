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
import NPC_Boy_ShopOwner from "../../entity/npc/NPC_Boy_ShopOwner";
import NPC_Dog_Husky from "../../entity/npc/NPC_Dog_Husky";

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
          if (tile.type === 29) {
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
              tile.dst.pos.y * TILE_SIZE,
              15, 10,
              this.map
            );
          }
          // NPCs
          // - Shop owner
          else if (tile.type === 60) {
            this.gameObjects.push(new NPC_Boy_ShopOwner(
              tile.dst.pos.x * TILE_SIZE,
              tile.dst.pos.y * TILE_SIZE,
              this.map
            ));
          }
          // - Husky
          else if (tile.type === 124) {
            this.gameObjects.push(new NPC_Dog_Husky(
              tile.dst.pos.x * TILE_SIZE,
              tile.dst.pos.y * TILE_SIZE,
              this.map
            ));
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
    AudioHandler.setPlaybackRate(this.#bkgdMusic, 0.9);
    AudioHandler.playMusic(this.#bkgdMusic);
  }

  update(dt) {
    this.gameObjects.forEach(go => {
      if (go instanceof Player) {
        go.update(this.gameObjects, dt);

        this.camera.vfocus(go.dst.pos);
        this.camera.update(dt);
      }
      else go.update(dt);
    });

    // Handle building specific tiles
    // - Exit
    if (this.#player.steppingOn(0) === 674 || this.#player.steppingOn(1) === 674) {
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
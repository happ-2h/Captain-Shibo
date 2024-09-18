import AudioHandler from "../../audio/AudioHandler";
import Camera from "../../camera/Camera";
import Player from "../../entity/mobile/player/Player";
import Tile from "../../entity/tile/Tile";
import Renderer from "../../gfx/Renderer";
import MapHandler from "../../map/MapHandler";
import Rectangle from "../../utils/Rectangle";
import State from "./State";
import { rand, randInt } from "../../math/utils";
import OBJ_Chest from "../../entity/object/OBJ_Chest";
import OBJ_Coins from "../../entity/object/OBJ_Coins";
import StateHandler from "./StateHandler";
import BattleState from "./BattleState";
import Cat from "../../entity/enemy/Cat";
import {
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  TILE_SIZE,
  WINDOW_HEIGHT,
  WINDOW_WIDTH
} from "../constants";

export default class ForestState extends State {
  // Player values
  #player;
  #prevPos;
  #prevMap;

  // Enemy encounter
  #encounterRate;
  #encounterPercentage;
  #encounterTimer;

  #bkgdMusic;
  #prevMusic;

  /**
   * @param {Player} player    - Reference to the player
   * @param {String} bkgdmusic - Background music ID
   * @param {String} prevmusic - Music ID of previous state
   */
  constructor(player=null, bkgdmusic=null, prevmusic=null) {
    super();

    // Enemy encounter
    this.#encounterRate = 3;
    this.#encounterPercentage = 0.5;
    this.#encounterTimer = 0;

    this.#player  = player;
    this.#prevPos = player.dst.pos.clone();
    this.#prevPos.y = 32;
    this.#prevMap = player.map;

    this.#bkgdMusic = bkgdmusic;
    this.#prevMusic = prevmusic;
  }

  onEnter() { this.init(); }
  onExit() {
    // Restore the player's previous values
    this.#player.dst.pos.copy(this.#prevPos);
    this.#player.targetTile.copy(this.#prevPos);
    this.#player.map = this.#prevMap;
    this.#player.facing = "down";
    this.#player.recover();

    AudioHandler.stop(this.#bkgdMusic);
    AudioHandler.playMusic(this.#prevMusic);
  }

  init() {
    this.map = "test_forest";

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
      });
    });

    // Chest location
    const loc = [
      {x: 2, y: 1},
      {x: 22, y: 3},
      {x: 29, y: 3},
      {x: 14, y: 11},
      {x: 2, y: 16},
    ][randInt(0, 4)];

    this.gameObjects.push(new OBJ_Chest(
      loc.x * TILE_SIZE,
      loc.y * TILE_SIZE,
      this.map,
      new OBJ_Coins(0, 0, this.map, randInt(1, 50))
    ));

    MapHandler.getMap(this.map).setTileObj(
      loc.x,
      loc.y,
      35
    );

    AudioHandler.stop(this.#prevMusic);
    AudioHandler.setVolume(this.#bkgdMusic, 0.6);
    AudioHandler.setPlaybackRate(this.#bkgdMusic, 0.8);
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

    this.#encounterTimer += dt;

    if (this.#encounterTimer >= this.#encounterRate) {
      this.#encounterTimer = 0;

      if (rand(0, 1) >= this.#encounterPercentage) {
        StateHandler.push(
          new BattleState(
            this.#player,
            new Cat(
              (SCREEN_WIDTH>>1)  - (TILE_SIZE>>1),
              (SCREEN_HEIGHT>>1) - (TILE_SIZE>>1),
              5, 1, 5
            ),
            "battlemusic",
            this.#bkgdMusic
          )
        );
      }
    }

    // Exit
    if (this.#player.steppingOn(0) === 100 || this.#player.steppingOn(1) === 100)
      StateHandler.pop();
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
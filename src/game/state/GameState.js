import AudioHandler from "../../audio/AudioHandler";
import Camera from "../../camera/Camera";
import Player from "../../entity/mobile/player/Player";
import NPC_Basic from "../../entity/npc/NPC_basic";
import OBJ_Sign from "../../entity/object/OBJ_Sign";
import Tile from "../../entity/tile/Tile";
import Renderer from "../../gfx/Renderer";
import MapHandler from "../../map/MapHandler";
import Rectangle from "../../utils/Rectangle";
import { TILE_SIZE } from "../constants";
import ForestState from "./ForestState";
import State from "./State";
import StateHandler from "./StateHandler";

export default class GameState extends State {
  constructor() {
    super();
  }

  onEnter() { this.init(); }
  onExit()  {}

  init() {
    this.map = "test_map";

    // Setup world objects
    MapHandler.getMap(this.map).tiles.forEach(row => {
      row.forEach(tile => {
        if (tile) {
          if (tile.type === 1) {
            this.gameObjects.push(new Player(
              tile.dst.pos.x * TILE_SIZE,
              tile.dst.pos.y * TILE_SIZE,
              this.map
            ));
            this.camera = new Camera(
              tile.dst.pos.x * TILE_SIZE,
              tile.dst.pos.y * TILE_SIZE,
              20, 11,
              this.map
            );
          }
          else if (tile.type === 48) {
            this.gameObjects.push(new NPC_Basic(
              tile.dst.pos.x * TILE_SIZE,
              tile.dst.pos.y * TILE_SIZE,
              this.map
            ));
          }
          else if (tile.type === 33) {
            this.gameObjects.push(new OBJ_Sign(
              tile.dst.pos.x * TILE_SIZE,
              tile.dst.pos.y * TILE_SIZE,
              this.map,
              "Sign Test"
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
      });
    });

    AudioHandler.playMusic("bkgd_test");
  }

  update(dt) {
    let playerRef = null;

    this.gameObjects.forEach(go => {

      if (go instanceof Player) {
        go.update(this.gameObjects, dt);
        playerRef = go;

        this.camera.vfocus(go.dst.pos);
        this.camera.update(dt);
      }
      else go.update(dt);
    });

    // Go into forest
    if (playerRef.steppingOn(0) === 99 || playerRef.steppingOn(1) === 99) {
      StateHandler.push(new ForestState(playerRef, "bkgd_forest_test", "bkgd_test"));
    }
  }

  render() {
    Renderer.setOffset(this.camera.x, this.camera.y);
    MapHandler.drawMapLayer(this.map, new Rectangle(this.camera.x, this.camera.y, 21, 13), 0);

    this.gameObjects
      .sort((a, b) => a.dst.pos.y - b.dst.pos.y)
      .forEach(go => go.draw());
  }
};
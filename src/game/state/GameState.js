import Camera from "../../camera/Camera";
import Player from "../../entity/mobile/player/Player";
import Tile from "../../entity/tile/Tile";
import Renderer from "../../gfx/Renderer";
import MapHandler from "../../map/MapHandler";
import Rectangle from "../../utils/Rectangle";
import { TILE_SIZE } from "../constants";
import State from "./State";

export default class GameState extends State {
  constructor() {
    super();
  }

  onEnter() { this.init(); }
  onExit()  {}

  init() {
    this.map = "test_map";

    this.gameObjects.push(new Player(0, 0, this.map));
    this.camera = new Camera(
      this.gameObjects[0].dst.x,
      this.gameObjects[0].dst.y
    );

    // Setup world objects
    MapHandler.getMap(this.map).tiles.forEach(row => {
      row.forEach(tile => {
        if (tile) {
          this.gameObjects.push(new Tile(
            tile.dst.pos.x * TILE_SIZE,
            tile.dst.pos.y * TILE_SIZE,
            tile.type,
            tile.isSolid,
            this.map
          ));
        }
      });
    });
  }

  update(dt) {
    this.gameObjects.forEach(go => {
      go.update(dt);

      if (go instanceof Player) {
        this.camera.vfocus(go.dst.pos);
        this.camera.update(dt);
      }
    });
  }

  render() {
    Renderer.setOffset(this.camera.x, this.camera.y);
    // MapHandler.drawMap(this.map, new Rectangle(this.camera.x, this.camera.y, 21, 13));
    MapHandler.drawMapLayer(this.map, new Rectangle(this.camera.x, this.camera.y, 21, 13), 0);
    this.gameObjects.forEach(go => {
      go.draw();
    });
  }
};
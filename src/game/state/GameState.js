import Camera from "../../camera/Camera";
import Player from "../../entity/mobile/player/Player";
import Renderer from "../../gfx/Renderer";
import MapHandler from "../../map/MapHandler";
import Rectangle from "../../utils/Rectangle";
import State from "./State";

export default class GameState extends State {
  constructor() {
    super();
  }

  onEnter() { this.init(); }
  onExit()  {}

  init() {
    this.map = "test_map";

    this.gameObjects.push(new Player);
    this.camera = new Camera(
      this.gameObjects[0].dst.x,
      this.gameObjects[0].dst.y
    );
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
    MapHandler.drawMap(this.map, new Rectangle(this.camera.x, this.camera.y, 21, 13));
    this.gameObjects.forEach(go => {
      go.draw();
    });
  }
};
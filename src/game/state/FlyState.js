import Camera from "../../camera/Camera";
import Ship_Enemy01 from "../../entity/mobile/ship/enemy/Ship_Enemy01";
import Ship_Basic from "../../entity/mobile/ship/player/Ship_Basic";
import Renderer from "../../gfx/Renderer";
import MapHandler from "../../map/MapHandler";
import Rectangle from "../../utils/Rectangle";
import { TILE_SIZE, WINDOW_HEIGHT, WINDOW_WIDTH } from "../constants";
import State from "./State";
import StateHandler from "./StateHandler";

export default class FlyState extends State {
  #player;
  #enemy;

  constructor() { super(); }

  onEnter() { this.init(); }
  onExit()  {}

  init() {
    this.map = "space_bkgd";

    this.#player = new Ship_Basic(
      ((MapHandler.getMap(this.map).width * TILE_SIZE)>>1) - (TILE_SIZE>>1),
      (MapHandler.getMap(this.map).height - 2) * TILE_SIZE,
      this.map
    );

    this.#enemy = new Ship_Enemy01(0, 0, "enemyship01", this.map);

    this.camera = new Camera(this.#player.dst.pos.x, this.#player.dst.pos.y, 20, 12, this.map);
  }

  update(dt) {
    this.#player.update(this.#enemy, dt);
    this.camera.vfocus(this.#player.dst.pos);
    this.camera.update(dt);

    this.#enemy.update(this.#player, dt);

    if (this.#enemy.ranAway) StateHandler.pop();
  }

  render() {
    Renderer.clear(WINDOW_WIDTH, WINDOW_HEIGHT);
    Renderer.setOffset(this.camera.x, this.camera.y);

    MapHandler.drawMapLayer(this.map, new Rectangle(this.camera.x, this.camera.y, 21, 13), 0);

    this.#player.draw();
    this.#enemy.draw();
  }
};
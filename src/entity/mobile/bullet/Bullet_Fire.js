import Renderer from "../../../gfx/Renderer";
import Bullet   from "./Bullet";

import { DEBUG } from "../../../game/constants";

export default class Bullet_Fire extends Bullet {
  constructor(x, y, map) {
    super(x, y, 0, -1, map);

    this.src.pos.x = 24;
    this.src.pos.y = 64;
    this.src.dim.x =  8;
    this.src.dim.y =  8;

    this.colBox.x = this.dst.pos.x + (this.dst.dim.x>>1);
    this.colBox.y = this.dst.pos.y;
    this.colBox.radius = 2;

    this.vel.y = 100;
  }

  update(dt) {
    let nexty = this.dst.pos.y + this.vel.y * this.dir.y * dt;

    if (nexty <= 0) this.kill = true;

    this.dst.pos.y = nexty;

    this.colBox.x = this.dst.pos.x + (this.dst.dim.x>>1);
    this.colBox.y = this.dst.pos.y+2;
  }

  draw() {
    super.draw();

    if (DEBUG)
      Renderer.vcircle(this.colBox.pos, this.colBox.radius);
  }
};
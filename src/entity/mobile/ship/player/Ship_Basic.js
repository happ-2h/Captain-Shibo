import ShipController from "../../../../Controller/ship/ShipController";
import Ship from "../Ship";
import { clamp } from "../../../../math/utils";
import { SCREEN_WIDTH, SCREEN_HEIGHT } from "../../../../game/constants";
import Renderer from "../../../../gfx/Renderer";
import Bullet_Fire from "../../bullet/Bullet_Fire";
import CollisionChecker from "../../../../math/CollisionChecker";

export default class Ship_Basic extends Ship {
  #thrustAnimDelay;
  #thrustAnimTimer;
  #thrustFrame;

  constructor(x=0, y=0, map=null) {
    super(x, y, new ShipController, map);

    this.dst.dim.x = 16;
    this.dst.dim.y = 16;
    this.src.pos.x = 160;
    this.src.pos.y = 48;
    this.src.dim.x = 32;
    this.src.dim.y = 32;

    this.accel.x = 200;
    this.accel.y = 200;
    this.friction.x = 3;
    this.friction.y = 3;

    this.#thrustAnimDelay = 0.05;
    this.#thrustAnimTimer = 0;
    this.#thrustFrame = 0;

    this.colBox.x = this.dst.pos.x + (this.dst.dim.x>>1);
    this.colBox.y = this.dst.pos.y + (this.dst.dim.y - 4);
    this.colBox.radius = 2;

    this.fireRate = 0.1;
  }

  update(enemy, dt) {
    this.dir.reset();

    this.fireTimer += dt;

    if (this.controller.isUsingJoystick()) { /* TODO */}
    else {
      if (this.controller.isRequestingUp())         this.dir.y = -1;
      else if (this.controller.isRequestingDown())  this.dir.y = 1;

      if (this.controller.isRequestingLeft())       this.dir.x = -1;
      else if (this.controller.isRequestingRight()) this.dir.x = 1;
    }

    if (this.controller.isRequestingA()) {
      if (this.fireTimer >= this.fireRate) {
        this.fireTimer = 0;

        this.bullets.push(new Bullet_Fire(
          this.dst.pos.x + 6,
          this.dst.pos.y,
          this.map
        ));
      }
    }

    this.dir.normalize();

    this.vel.x += this.accel.x * this.dir.x * dt;
    this.vel.x += this.vel.x * -this.friction.x * dt;

    this.vel.y += this.accel.y * this.dir.y * dt;
    this.vel.y += this.vel.y * -this.friction.y * dt;

    let nextx = this.dst.pos.x + this.vel.x * dt;
    let nexty = this.dst.pos.y + this.vel.y * dt;

    nextx = clamp(0, SCREEN_WIDTH  - this.dst.dim.x, nextx);
    nexty = clamp(0, SCREEN_HEIGHT - this.dst.dim.y, nexty);

    this.dst.pos.x = nextx;
    this.dst.pos.y = nexty;
    this.colBox.x = this.dst.pos.x + (this.dst.dim.x>>1);
    this.colBox.y = this.dst.pos.y + (this.dst.dim.y - 4);

    for (let i = 0; i < this.bullets.length; ++i) {
      this.bullets[i].update(dt);

      if (CollisionChecker.circle_circle(this.bullets[i].colBox, enemy.colBox)) {
        this.bullets[i].kill = true;
        enemy.hurt(this.bullets[i].dmg);

        if (enemy.isDead) enemy.phase = 99;
      }

      if (this.bullets[i].kill) this.bullets.splice(i, 1);
    }

    // Animation
    this.#thrustAnimTimer += dt;
    if (this.#thrustAnimTimer >= this.#thrustAnimDelay) {
      this.#thrustAnimTimer = 0;
      this.#thrustFrame = this.#thrustFrame + 1 >= 4 ? 0 : this.#thrustFrame + 1;
    }
  }

  draw() {
    super.draw();

    Renderer.image(
      "spritesheet",
      192, 48 + (this.#thrustFrame * 8), 8, 8,
      this.dst.pos.x + 4,
      this.dst.pos.y + 15,
      8, 8
    );

    // TODO make sprite
    Renderer.vcircle(
      this.colBox.pos,
      this.colBox.radius
    );

    this.bullets.forEach(b => b.draw());

    Renderer.text(this.bullets.length, 32, 200, "red");
  }
};
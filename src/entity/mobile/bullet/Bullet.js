import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../../../game/constants";
import Renderer from "../../../gfx/Renderer";
import Circle from "../../../utils/Circle";
import Entity_Mob from "../Entity_Mob";

export default class Bullet extends Entity_Mob {
  #frameTimer;
  #frameDelay;
  #currentFrame;
  #maxFrames;

  #colBox;
  #kill;
  #dmg; // Damage

  constructor(x, y, dx, dy, map) {
    super(x, y, null, map);

    this.#frameTimer = 0;
    this.#frameDelay = 0.05;
    this.#currentFrame = 0;
    this.#maxFrames = 2;
    this.#kill = false;

    this.src.pos.x = 0;
    this.src.pos.y = 72;
    this.src.dim.x = 4;
    this.src.dim.y = 4;
    this.dst.dim.x = 4;
    this.dst.dim.y = 4;

    this.dir.x = dx;
    this.dir.y = dy;

    this.dir.normalize();

    this.vel.x = 50;
    this.vel.y = 50;

    this.#colBox = new Circle;
    this.#colBox.radius = 2;
    this.#dmg = 1;
  }

  update(dt) {
    let nextx = this.dst.pos.x + this.vel.x * this.dir.x * dt;
    let nexty = this.dst.pos.y + this.vel.y * this.dir.y * dt;

    if (nextx <= -this.dst.dim.x) this.#kill = true;
    if (nexty <= -this.dst.dim.y) this.#kill = true;
    if (nextx >= SCREEN_WIDTH) this.#kill = true;
    if (nexty >= SCREEN_HEIGHT) this.#kill = true;

    this.dst.pos.x = nextx;
    this.dst.pos.y = nexty;
    this.#colBox.x = this.dst.pos.x + 2;
    this.#colBox.y = this.dst.pos.y + 2;

    this.#frameTimer += dt;

    if (this.#frameTimer >= this.#frameDelay) {
      this.#frameTimer = 0;

      this.#currentFrame = this.#currentFrame + 1 >= this.#maxFrames ? 0 : this.#currentFrame + 1;
    }
  }


  draw() {
    Renderer.image(
      "spritesheet",
      this.src.pos.x + (this.#currentFrame * this.src.dim.x),
      this.src.pos.y,
      this.src.dim.x, this.src.dim.y,
      this.dst.pos.x, this.dst.pos.y,
      this.dst.dim.x, this.dst.dim.y
    );

    Renderer.vcircle(this.colBox.pos, this.colBox.radius);
  }
  // Accessors
  get colBox() { return this.#colBox; }
  get kill()   { return this.#kill; }
  get dmg()    { return this.#dmg; }

  // Mutators
  set kill(kill) { this.#kill = kill; }
};
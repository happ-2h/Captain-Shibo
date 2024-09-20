import { DEBUG, SCREEN_HEIGHT, SCREEN_WIDTH } from "../../../../game/constants";
import Renderer from "../../../../gfx/Renderer";
import CollisionChecker from "../../../../math/CollisionChecker";
import { lerp, rand, TAU } from "../../../../math/utils";
import Vec2D from "../../../../math/Vec2D";
import Bullet from "../../bullet/Bullet";
import Ship from "../Ship";

export default class Ship_Enemy01 extends Ship {
  #img;
  #phase;

  #bulletSpawner1;
  #bulletSpawner2;
  #laserSpawner1; // TODO laser objects

  #rotation;
  #rotationRate;

  #laserAnimTimer;
  #laserAnimDelay;
  #laserCurrentFrame;

  #shootingLaser;
  #shootingLaserDelay;
  #shootingLaserTimer;

  #ranAway;

  constructor(x=0, y=0, img=null, map=null) {
    super(x, y, null, map);

    this.#img = img;
    this.#phase = 1;

    this.fireRate = 0.5;
    this.#rotation = 0;
    this.#rotationRate = 5;

    this.src.dim.x = 80;
    this.src.dim.y = 64;
    this.dst.dim.x = 80;
    this.dst.dim.y = 64;
    this.dst.pos.x = (SCREEN_WIDTH>>1) - (this.dst.dim.x>>1);

    this.#bulletSpawner1 = new Vec2D(20, 59);
    this.#bulletSpawner2 = new Vec2D(59, 59);

    this.colBox.x = this.dst.pos.x + (this.dst.dim.x>>1);
    this.colBox.y = this.dst.pos.y + 30;
    this.colBox.radius = 24;

    this.hp = 100;
    this.hpTtl = this.hp;

    this.#laserAnimDelay = 0.05;
    this.#laserAnimTimer = 0;
    this.#laserCurrentFrame = 0;

    this.#shootingLaser = false;
    this.#shootingLaserDelay = 0.5;
    this.#shootingLaserTimer = 0;

    this.#ranAway = false;

    this.vel.y = 100;
  }

  update(player, dt) {
    this.fireTimer += dt;

    // Dead
    if (this.#phase == 99) {
      this.dst.pos.y += this.vel.y * dt;

      if (this.dst.pos.y >= SCREEN_HEIGHT) {
        this.#ranAway = true;
      }
    }
    else if (this.#phase === 1) {
      this.#fireBullets(5);

      if (this.hp / this.hpTtl <= 0.9) this.#phase = 2;
    }
    else if (this.#phase === 2) {
      this.#rotationRate = 12;
      this.fireRate = 0.3;
      this.dst.pos.x = lerp(this.dst.pos.x, 0, 0.02);
      this.#fireBullets(3);

      if (this.hp / this.hpTtl <= 0.8) this.#phase = 3;
    }
    else if (this.#phase === 3) {
      this.#rotationRate = 6;
      this.fireRate = 0.3;
      this.dst.pos.x = lerp(this.dst.pos.x, SCREEN_WIDTH - this.dst.dim.x, 0.02);
      this.#fireBullets(8);

      if (this.hp / this.hpTtl <= 0.5) this.#phase = 4;
    }
    else if (this.#phase === 4) {
      this.#rotationRate = 100;
      this.fireRate = 0.5;
      this.dst.pos.x = lerp(this.dst.pos.x, (player.dst.pos.x + (player.dst.dim.x>>1)) - (this.dst.dim.x>>1), 0.02);
      this.#fireBullets(4);

      this.#shootingLaserTimer += dt;
      if (!this.#shootingLaser && this.#shootingLaserTimer >= this.#shootingLaserDelay) {
        this.#shootingLaserTimer = 0;

        if (rand(1, 10) >= 6) this.#shootingLaser = true;
      }
      else if (this.#shootingLaser && this.#shootingLaserTimer >= this.#shootingLaserDelay) {
        this.#shootingLaserTimer = 0;
        this.#shootingLaser = false;
      }

      this.#laserAnimTimer += dt;

      if (this.#laserAnimTimer >= this.#laserAnimDelay) {
        this.#laserAnimTimer = 0;

        this.#laserCurrentFrame =
          this.#laserCurrentFrame + 1 >= 2
            ? 0
            : this.#laserCurrentFrame + 1;
      }
    }


    for (let i = 0; i < this.bullets.length; ++i) {
      this.bullets[i].update(dt);

      if (CollisionChecker.circle_circle(this.bullets[i].colBox, player.colBox))
        this.bullets[i].kill = true;

      if (this.bullets[i].kill) this.bullets.splice(i, 1);
    }

    this.colBox.x = this.dst.pos.x + (this.dst.dim.x>>1);
    this.colBox.y = this.dst.pos.y + 30;
  }

  draw() {
    Renderer.vimage(this.#img, this.src, this.dst);

    if(this.#phase === 4) {
      if (!this.#shootingLaser) {
        Renderer.image(
          "spritesheet",
          208, 48 + (this.#laserCurrentFrame * 8), 8, 8,
          this.dst.pos.x + (this.dst.dim.x>>1) - 4,
          this.dst.pos.y + 42,
          8,8
        );
      }
      else {
        Renderer.image(
          "spritesheet",
          208, 64, 8, 8,
          this.dst.pos.x + (this.dst.dim.x>>1) - 4,
          this.dst.pos.y + 43,
          8,
          SCREEN_HEIGHT
        )
      }
    }

    this.bullets.forEach(b => b.draw());

    // TEMP HP
    Renderer.rect(0, 0, SCREEN_WIDTH * (this.hp / this.hpTtl), 4, "rgba(255,0,0,0.5)", true);

    if (DEBUG)
      Renderer.vcircle(this.colBox.pos, this.colBox.radius);
  }

  #fireBullets(n) {
    if (this.fireTimer >= this.fireRate) {
      this.fireTimer = 0;
      this.#rotation += this.#rotationRate;

      for (let i = 0; i < n; ++i) {
        let t = i / n;

        let ang = t * TAU + this.#rotation;

        let _x = Math.cos(ang);
        let _y = Math.sin(ang);

        this.bullets.push(new Bullet(
          this.#bulletSpawner1.x + this.dst.pos.x,
          this.#bulletSpawner1.y + this.dst.pos.y,
          _x, _y,
          this.map
        ));
        this.bullets.push(new Bullet(
          this.#bulletSpawner2.x + this.dst.pos.x,
          this.#bulletSpawner2.y + this.dst.pos.y,
          _x, _y,
          this.map
        ));
      }
    }
  }

  get phase()   { return this.#phase; }
  get ranAway() { return this.#ranAway; }

  set phase(phase) { this.#phase = phase; }
};
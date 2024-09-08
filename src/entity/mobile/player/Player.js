import PlayerController from "../../../Controller/PlayerController";
import { TILE_SIZE } from "../../../game/constants";
import Entity_Mob from "../Entity_Mob";

export default class Player extends Entity_Mob {
  constructor(x=0, y=0) {
    super(x, y, new PlayerController);

    this.vel.set(50, 50);
  }

  init() {}

  update(dt) {
    this.#handleInput();
    this.#handleMovement(dt);
  }

  #handleInput() {
    if (!this.isMoving && this.controller.isRequestingLeft()) {
      this.targetTile.x -= TILE_SIZE;
      this.dir.x = -1;
      this.isMoving = true;
    }
    else if (!this.isMoving && this.controller.isRequestingRight()) {
      this.targetTile.x += TILE_SIZE;
      this.dir.x = 1;
      this.isMoving = true;
    }
    else if (!this.isMoving && this.controller.isRequestingUp()) {
      this.targetTile.y -= TILE_SIZE;
      this.dir.y = -1;
      this.isMoving = true;
    }
    else if (!this.isMoving && this.controller.isRequestingDown()) {
      this.targetTile.y += TILE_SIZE;
      this.dir.y = 1;
      this.isMoving = true;
    }
  }

  #handleMovement(dt) {
    // Finalize movement
    if (this.dir.x ===  1 && this.targetTile.x > this.dst.x) this.dst.x += this.vel.x * dt;
    if (this.dir.x === -1 && this.targetTile.x < this.dst.x) this.dst.x -= this.vel.x * dt;
    if (this.dir.y ===  1 && this.targetTile.y > this.dst.y) this.dst.y += this.vel.y * dt;
    if (this.dir.y === -1 && this.targetTile.y < this.dst.y) this.dst.y -= this.vel.y * dt;

    if (
      Math.floor(this.dst.x) === this.targetTile.x &&
      Math.floor(this.dst.y) === this.targetTile.y
    ) {
      this.isMoving = false;
      this.dir.x = 0;
      this.dir.y = 0;
    }
  }
};
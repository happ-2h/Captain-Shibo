import PlayerController from "../../../Controller/PlayerController";
import { TILE_SIZE } from "../../../game/constants";
import Entity_Mob from "../Entity_Mob";

export default class Player extends Entity_Mob {
  constructor(x=0, y=0) {
    super(x, y, new PlayerController);

    this.vel.set(1, 1);
  }

  init() {}

  update(dt) {
    this.#handleInput();
    this.#handleMovement(dt);
  }

  #handleInput() {
    if (!this.isMoving && this.controller.isRequestingLeft()) {
      this.targetTile.x -= TILE_SIZE;
      this.isMoving = true;
    }
    else if (!this.isMoving && this.controller.isRequestingRight()) {
      this.targetTile.x += TILE_SIZE;
      this.isMoving = true;
    }
    else if (!this.isMoving && this.controller.isRequestingUp()) {
      this.targetTile.y -= TILE_SIZE;
      this.isMoving = true;
    }
    else if (!this.isMoving && this.controller.isRequestingDown()) {
      this.targetTile.y += TILE_SIZE;
      this.isMoving = true;
    }
  }

  #handleMovement(dt) {
    // Finalize movement
    if (this.targetTile.x > this.dst.x) this.dst.x += this.vel.x;
    if (this.targetTile.x < this.dst.x) this.dst.x -= this.vel.x;
    if (this.targetTile.y > this.dst.y) this.dst.y += this.vel.y;
    if (this.targetTile.y < this.dst.y) this.dst.y -= this.vel.y;

    if (this.dst.pos.equals(this.targetTile)) this.isMoving = false;
  }
};
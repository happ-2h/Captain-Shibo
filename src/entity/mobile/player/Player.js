import PlayerController from "../../../Controller/PlayerController";
import { TILE_SIZE } from "../../../game/constants";
import MapHandler from "../../../map/MapHandler";
import Entity_Mob from "../Entity_Mob";

export default class Player extends Entity_Mob {
  constructor(x=0, y=0, map=null) {
    super(x, y, new PlayerController, map);

    // Image
    this.src.x = 16;

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
    // Handle collision
    const nextx = this.targetTile.x / TILE_SIZE;
    const nexty = this.targetTile.y / TILE_SIZE;
    if (MapHandler.getMap(this.map).getTileObject(nextx, nexty)?.isSolid) {
      this.targetTile.x = this.dst.x;
      this.targetTile.y = this.dst.y;
    }

    // Finalize movement
    if (this.targetTile.x > this.dst.x) this.dst.x += this.vel.x;
    if (this.targetTile.x < this.dst.x) this.dst.x -= this.vel.x;
    if (this.targetTile.y > this.dst.y) this.dst.y += this.vel.y;
    if (this.targetTile.y < this.dst.y) this.dst.y -= this.vel.y;

    /*
     * [ISSUE #001]
     * FIXME: time-based movement
     *   Problems:
     *     - Miniscule offsets (doesn't snap to grid)
     *   Unsuccessful attempts:
     *     - Forced snap has obvious jitter
     * /
    /*
    if (
      Math.floor(this.dst.x) === this.targetTile.x &&
      Math.floor(this.dst.y) === this.targetTile.y
    ) {
      this.isMoving = false;

      this.dst.x = this.targetTile.x;
      this.dst.y = this.targetTile.y;

      this.dir.x = 0;
      this.dir.y = 0;
    }
    */

    // TEMP Frame-based movement
    if (this.dst.pos.equals(this.targetTile)) {
      this.isMoving = false;
      this.dir.reset();
    }
  }
};
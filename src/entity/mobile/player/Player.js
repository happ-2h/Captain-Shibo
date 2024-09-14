import PlayerController from "../../../Controller/PlayerController";
import { TILE_SIZE } from "../../../game/constants";
import MapHandler from "../../../map/MapHandler";
import Entity_Mob from "../Entity_Mob";
import Animation from "../../../gfx/Animation";
import StateHandler from "../../../game/state/StateHandler";
import DialogueState from "../../../game/state/DialogueState";
import { canvasSnapshot } from "../../../gfx/utils";
import BuildingState from "../../../game/state/BuildingState";

export default class Player extends Entity_Mob {
  #actionTimer;
  #actionDelay; // Prevents infinite action requests

  constructor(x=0, y=0, map=null) {
    super(x, y, new PlayerController, map);

    // Image
    this.src.x = 16;

    // Animations
    this.animation = new Animation([1,2,1,3], 10); // TEMP
    this.shouldAnimate = true;
    this.facing = "down";

    this.status = "roaming";

    this.#actionTimer = 0;
    this.#actionDelay = 0.4;

    this.vel.set(1, 1);
  }

  init() {}

  update(go, dt) {
    this.#handleInput(go, dt);
    this.#handleMovement(dt);
    this.#handleAnimation(dt);
  }

  #handleInput(go, dt) {
    this.#actionTimer += dt;

    if (this.status === "roaming") {
      if (!this.isMoving && this.controller.isRequestingLeft()) {
        this.targetTile.x -= TILE_SIZE;
        this.dir.x = -1;
        this.facing = "left";
        this.isMoving = true;
      }
      else if (!this.isMoving && this.controller.isRequestingRight()) {
        this.targetTile.x += TILE_SIZE;
        this.dir.x = 1;
        this.facing = "right";
        this.isMoving = true;
      }
      else if (!this.isMoving && this.controller.isRequestingUp()) {
        this.targetTile.y -= TILE_SIZE;
        this.dir.y = -1;
        this.facing = "up";
        this.isMoving = true;
      }
      else if (!this.isMoving && this.controller.isRequestingDown()) {
        this.targetTile.y += TILE_SIZE;
        this.dir.y = 1;
        this.facing = "down";
        this.isMoving = true;
      }

      // Actions
      if (!this.isMoving && this.controller.isRequestingA()) {
        let requestedTile = -1;
        let _x = Math.floor(this.dst.pos.x / TILE_SIZE);
        let _y = Math.floor(this.dst.pos.y / TILE_SIZE);

        switch(this.facing) {
          case "up":    --_y; break;
          case "down":  ++_y; break;
          case "left":  --_x; break;
          case "right": ++_x; break;
        }

        requestedTile = MapHandler.getMap(this.map).getTileObject(_x, _y)?.type;

        if (this.#actionTimer >= this.#actionDelay) {
          // NPC_Basic or OBJ_Sign
          if (requestedTile === 48 || requestedTile === 33) {
            this.#actionTimer = 0;
            StateHandler.push(new DialogueState(
              canvasSnapshot(),
              go.find(g => g.dst.pos.x/TILE_SIZE === _x && g.dst.pos.y/TILE_SIZE === _y),
              this
            ));
          }

          // Door
          else if (requestedTile === 103) {
            this.#actionTimer = 0;

            const doorObj = MapHandler.getMap(this.map).getTileObject(_x, _y);

            if (doorObj.locked)
              StateHandler.push(new DialogueState(
                canvasSnapshot(),
                null, this,
                "Door is locked"
              ));
            else
              StateHandler.push(new BuildingState(this, doorObj.to, "bkgd_building_test", "bkgd_test"));
          }
        }
      }
    }
  }

  #handleMovement(dt) {
    // Handle collision
    const nextx = this.targetTile.x / TILE_SIZE;
    const nexty = this.targetTile.y / TILE_SIZE;

    // - Map bounds
    if (nextx < 0) this.targetTile.x = 0;
    if (nexty < 0) this.targetTile.y = 0;
    if (nextx >= MapHandler.getMap(this.map).width) this.targetTile.x = this.dst.x;
    if (nexty >= MapHandler.getMap(this.map).height) this.targetTile.y = this.dst.y;

    // - Map objects
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

  #handleAnimation(dt) {
    if (
      this.status === "roaming" &&
      (this.controller.isRequestingUp()   ||
      this.controller.isRequestingDown()  ||
      this.controller.isRequestingLeft()  ||
      this.controller.isRequestingRight() ||
      !this.targetTile.equals(this.dst.pos))
    )
      this.animation.update(dt);
    else this.animation.currentFrame = 0;

    this.src.pos.x = (this.animation.currentFrame&0xF)<<4;
    this.src.pos.y = (this.animation.currentFrame>>4)<<4;
  }

  steppingOn(layer=0) {
    return MapHandler.getMap(this.map).getTileNum(
      this.dst.pos.x / TILE_SIZE,
      this.dst.pos.y / TILE_SIZE,
      layer
    );
  }
};
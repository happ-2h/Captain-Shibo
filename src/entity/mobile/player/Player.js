import PlayerController from "../../../Controller/PlayerController";
import MapHandler       from "../../../map/MapHandler";
import Entity_Mob       from "../Entity_Mob";
import Animation        from "../../../gfx/Animation";
import StateHandler     from "../../../game/state/StateHandler";
import DialogueState    from "../../../game/state/DialogueState";
import BuildingState    from "../../../game/state/BuildingState";
import FlyState         from "../../../game/state/FlyState";
import SettingsState    from "../../../game/state/SettingsState";

import { canvasSnapshot } from "../../../gfx/utils";
import { TILE_SIZE }      from "../../../game/constants";

export default class Player extends Entity_Mob {
  #actionTimer;
  #actionDelay; // Prevents infinite action requests

  #hp;
  #maxHp;
  #def;
  #defending;

  #attackPts;

  constructor(x=0, y=0, map=null) {
    super(x, y, new PlayerController, map);

    // Image
    this.src.x = 16;

    // Animations
    this.animation = new Animation([29,30,29,31], 10); // TEMP
    this.shouldAnimate = true;
    this.facing = "down";
    this.prevFacing = this.facing;

    // Battle
    this.status = "roaming";
    this.#hp    = 25;
    this.#maxHp = 25;
    this.#def   =  3;
    this.#defending = false;
    this.#attackPts = 5;

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
          // NPCs or OBJ_Sign
          if (
            requestedTile === 48  ||
            // NPCs
            requestedTile === 28  ||
            requestedTile === 92  ||
            requestedTile === 156 ||
            requestedTile === 60  ||
            requestedTile === 124 ||
            // Signs
            requestedTile === 640 ||
            requestedTile === 641 ||
            requestedTile === 33
          ) {
            this.#actionTimer = 0;
            const frameNumber = (
              requestedTile === 28  ||
              requestedTile === 92  ||
              requestedTile === 124 ||
              requestedTile === 156
            ) ? 0 : 1;

            StateHandler.push(new DialogueState(
              canvasSnapshot(),
              go.find(g => g.dst.pos.x/TILE_SIZE === _x && g.dst.pos.y/TILE_SIZE === _y),
              this,
              frameNumber
            ));
          }

          // Doors
          else if (
            requestedTile === 897 || // Ship shop
            requestedTile === 914 || // Husky Home
            requestedTile === 902    // Shed
          ) this.#checkDoor(requestedTile, _x, _y);

          // Chest
          else if (requestedTile === 642) {
            this.#actionTimer = 0;

            const chestObj = go.find(g => g.dst.pos.x/TILE_SIZE === _x && g.dst.pos.y/TILE_SIZE === _y);

            if (chestObj.isClosed) {
              chestObj.open();
              StateHandler.push(new DialogueState(
                canvasSnapshot(),
                null, this, 1,
                `Got ${chestObj.loot.name}`
              ));
            }
          }

          // Fly
          else if (this.steppingOn(0) === 672) {
            this.#actionTimer = 0;
            StateHandler.push(new FlyState);
          }
        }
      }

      if (this.controller.isRequestingPause()) {
        this.#actionTimer = 0;
        StateHandler.push(new SettingsState);
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
    if (this.facing !== this.prevFacing) {
      switch(this.facing) {
        case "left":
          this.animation.setAnimation([93,94,93,95], 10);
          break;
        case "right":
          this.animation.setAnimation([125,126,125,127], 10);
          break;
        case "up":
          this.animation.setAnimation([61,62,61,63], 10);
          break;
        case "down":
          this.animation.setAnimation([29,30,29,31], 10);
          break;
      }

      this.prevFacing = this.facing;
    }

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

    this.src.pos.x = (this.animation.currentFrame&0x1F)<<4;
    this.src.pos.y = (this.animation.currentFrame>>5)<<4;
  }

  #checkDoor(tileID, _x, _y) {
    this.#actionTimer = 0;

    const doorObj = MapHandler.getMap(this.map).getTileObject(_x, _y);

    if (doorObj.locked)
      StateHandler.push(new DialogueState(
        canvasSnapshot(),
        null, this, 1,
        "Door is locked"
      ));
    else
      StateHandler.push(new BuildingState(
        this,
        doorObj.to,
        tileID === 897 ? "bkgd_shop" : "bkgd_building_test",
        "bkgd_test"
      ));
  }

  steppingOn(layer=0) {
    return MapHandler.getMap(this.map).getTileNum(
      this.dst.pos.x / TILE_SIZE,
      this.dst.pos.y / TILE_SIZE,
      layer
    );
  }

  recover() {
    this.#hp = this.#maxHp;
  }

  // Mutators
  set hp(hp)    { this.#hp  = hp; }
  set maxHp(hp) { this.#maxHp = hp; }
  set def(def)  { this.#def = def; }
  set defending(def) { this.#defending = def; }

  // Accessors
  get hp()    { return this.#hp; }
  get maxHp() { return this.#maxHp; }
  get def()   { return this.#def; }
  get atk()   { return this.#attackPts; }
};
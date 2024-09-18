import Entity from "../Entity";
import Renderer from "../../gfx/Renderer";
import { DEBUG, SCREEN_HEIGHT } from "../../game/constants";
import Vec2D from "../../math/Vec2D";
import { max } from "../../math/utils";

export default class Cat extends Entity {
  // Battle
  // - Stats
  #hp;
  #maxHp;
  #attack;
  #defense;

  // - Actions
  #action;
  #decisionTimer;
  #decisionDelay;
  #moving;
  #hitPlayer;

  // Animation
  #frameTimer;
  #frameDelay;
  #lookup;
  #currentLookup;
  #originalPos;

  constructor(x=0, y=0, hp=0, atk=0, def=0) {
    super(x, y, "test_forest");

    // Stats
    this.#hp      = hp;
    this.#maxHp   = hp;
    this.#attack  = atk;
    this.#defense = def;

    // Battle actions
    this.#action = "waiting";
    this.#decisionTimer = 0;
    this.#decisionDelay = 0.4;
    this.#hitPlayer = false;

    // Animation
    // - Idle sprite
    this.#frameTimer = 0;
    this.#frameDelay = 0.6;
    // - Attack movement
    this.#originalPos = new Vec2D(x, y);
    this.#moving      = new Vec2D(4, 4);
    // - Hurt movement
    this.#currentLookup = 0;
    this.#lookup = [-10, 10, -6, 6, -3, 3, -2, 2, -1, 1]; // Shake effect

    this.src.pos.x = 0;
    this.src.pos.y = 64;
  }

  init() {
    this.dst.pos.y = this.#originalPos.y;
    this.#currentLookup = 0;
    this.#decisionTimer = 0;
    this.#moving.y = 4;
    this.#action = "waiting";
    this.#hitPlayer = false;
  }

  update(dt) {
    if (this.#action === "hurt") {
      this.dst.pos.x = this.#originalPos.x + this.#lookup[this.#currentLookup];

      this.#currentLookup =
        this.#currentLookup + 1 >= this.#lookup.length
          ? 0
          : this.#currentLookup + 1;

      if (this.#currentLookup === 0) {
        this.#action = "choosing";
        this.dst.pos.x = this.#originalPos.x;
      }
    }
    else if (this.#action === "choosing") {
      this.#decisionTimer += dt;

      if (this.#decisionTimer >= this.#decisionDelay) {
        this.#decisionTimer = 0;
        this.decide();
      }
    }
    else if (this.#action === "attacking") {
      this.dst.pos.y += this.#moving.y;

      if (this.dst.pos.y >= SCREEN_HEIGHT) {
        this.#moving.y = -4;
        this.#hitPlayer = true;
      }

      if (this.#moving.y === -4) {
        if (this.dst.pos.y <= this.#originalPos.y) {
          this.init();
        }
      }
    }

    this.#frameTimer += dt;
    if (this.status !== "dead" && this.#frameTimer >= this.#frameDelay) {
      this.#frameTimer = 0;
      this.src.pos.x = this.src.pos.x === 0 ? 16 : 0;
    }
  }

  draw() {
    Renderer.vimage("spritesheet", this.src, this.dst);

    if (DEBUG) Renderer.vrect(this.dst.pos, this.dst.dim);
  }

  hurt(hitpts) {
    console.log(hitpts);

    this.#action = "hurt";
    let dmg = max(1, hitpts - this.#defense);
    this.#hp -= dmg;
  }

  kill() {
    this.status = "dead";
    this.src.pos.x = 32;
  }

  decide() {
    if (this.#hp >= this.#maxHp * 0.5) {
      this.#action = "attacking";
    }
    else {
      this.#action = "defending";
    }
  }

  get hp()        { return this.#hp; }
  get maxHp()     { return this.#maxHp; }
  get attack()    { return this.#attack; }
  get defense()   { return this.#defense; }
  get action()    { return this.#action; }
  get hitPlayer() { return this.#hitPlayer; }

  set hitPlayer(hit) { this.#hitPlayer = hit; }
};
import Circle     from "../../../utils/Circle";
import Entity_Mob from "../Entity_Mob";

export default class Ship extends Entity_Mob {
  #bullets;
  #fireRate;
  #fireTimer;

  #colBox; // Collision box

  // Stats
  #hp;
  #hpTtl;
  #isDead;

  constructor(x=0, y=0, controller=null, map=null) {
    super(x, y, controller, map);

    this.#bullets = [];
    this.#fireRate = 0;
    this.#fireTimer = 0;
    this.#colBox = new Circle;

    this.#hp = 0;
    this.#hpTtl = this.#hp;
    this.#isDead = false;
  }

  /**
   * @brief Deal damage
   *
   * @param {Number} damage - Damage dealt
   */
  hurt(damage) {
    this.#hp -= damage;

    if (this.#hp <= 0) this.#isDead = true;
  }

  // Accessors
  get bullets()   { return this.#bullets;}
  get fireRate()  { return this.#fireRate; }
  get fireTimer() { return this.#fireTimer; }
  get colBox()    { return this.#colBox; }
  get hp()        { return this.#hp; }
  get hpTtl()     { return this.#hpTtl; }
  get isDead()    { return this.#isDead; }

  // Mutators
  set fireTimer(t) { this.#fireTimer = t; }
  set fireRate(r)  { this.#fireRate = r; }
  set hp(hp)       { this.#hp = hp; }
  set hpTtl(hp)    { this.#hpTtl = hp; }
};
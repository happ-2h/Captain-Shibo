import AudioHandler from "../../audio/AudioHandler";
import State from "./State";
import Renderer from "../../gfx/Renderer";
import { WINDOW_WIDTH, WINDOW_HEIGHT, DEBUG } from "../constants";
import Camera from "../../camera/Camera";
import MapHandler from "../../map/MapHandler";
import Rectangle from "../../utils/Rectangle";
import KeyHandler from "../../input/KeyHandler";
import { max } from "../../math/utils";
import StateHandler from "./StateHandler";
import Settings from "../../utils/Settings";

export default class BattleState extends State {
  #playerRef;
  #monsterRef;

  #phase; // Current battle phase

  // Camera shake
  // TODO move to Camera class
  #shakeLookup;
  #shakeIndex;

  #bkgdMusic;
  #prevMusic;

  constructor(player=null, monster=null, bkgdMusic=null, prevMusic=null) {
    super();

    this.map = "battle_forest_bkgd";

    this.#playerRef  = player;
    this.#monsterRef = monster;

    this.camera = new Camera(0, 0);
    Renderer.resetOffset();

    this.#bkgdMusic = bkgdMusic;
    this.#prevMusic = prevMusic;
    this.#phase = "choice";

    this.#shakeLookup = [-10, 10, -6, 6, -3, 3, -2, 2, -1, 1];
    this.#shakeIndex = 0;
  }

  onEnter() { this.init(); }
  onExit()  {
    AudioHandler.stop(this.#bkgdMusic);
    AudioHandler.play(this.#prevMusic);
  }

  init() {
    AudioHandler.stop(this.#prevMusic);
    AudioHandler.setPlaybackRate(this.#bkgdMusic, 1.1);
    AudioHandler.playMusic(this.#bkgdMusic);
  }

  update(dt) {
    this.#monsterRef.update(dt);
    // Follow monster
    /*this.camera.vfocus(this.#monsterRef.dst.pos);
    this.camera.update(dt);*/

    // Attack (z)
    // URGENT clean up
    if (this.#phase === "choice") {
      this.#playerRef.defending = false;

      if (this.#playerRef.hp <= 0) {
        this.#phase = "dead";
      }
      if (this.#monsterRef.hp <= 0) {
        this.#monsterRef.kill();
        this.#phase = "victory";
      }

      if (KeyHandler.isDown(Settings.keyAction))  {
        this.#phase = "attacking";
        this.#monsterRef.hurt(this.#playerRef.atk);
      }
      // Defense (x)
      else if (KeyHandler.isDown(88))  {
        this.#playerRef.defending = true;
      }
    }
    else if (this.#phase === "attacking") {
      if (this.#monsterRef.action === "choosing") {
        this.#phase = "waiting";
      }
    }
    else if (this.#phase === "waiting") {
      if (this.#monsterRef.action === "waiting") {
        this.#phase = "choice";
      }
      else if (this.#monsterRef.action === "defending") {
        this.#phase = "choice";
      }

      if (this.#monsterRef.hitPlayer) {
        this.#phase = "shake";
        let dmg = this.#playerRef.defending ? 1 : max(1, this.#monsterRef.attack - this.#playerRef.def);

        this.#playerRef.hp -= dmg;

        if (this.#playerRef.hp <= 0) {
          this.#playerRef.hp = 0;
        }
      }
    }
    else if (this.#phase === "shake") {
      this.camera.x += this.#shakeLookup[this.#shakeIndex];

      this.#shakeIndex = this.#shakeIndex + 1 >= this.#shakeLookup.length ? 0 : this.#shakeIndex + 1;

      if (this.#shakeIndex === 0) {
        this.#phase = "waiting";
        this.#monsterRef.hitPlayer = false;
      }
    }
    else if (this.#phase === "dead") {
      if (KeyHandler.isDown(90)) {
        // Send back to village
        StateHandler.pop();
        StateHandler.pop();
      }
    }
    else if (this.#phase === "victory") {
      if (this.#monsterRef.hp < 0) {
        // Easter egg if player hits monster while monster is down
        // console.log("CRUEL");
      }
      if (KeyHandler.isDown(Settings.keyAction)) {
        StateHandler.pop();
      }
    }
  }

  render() {
    Renderer.clear(WINDOW_WIDTH, WINDOW_HEIGHT);
    Renderer.setOffset(this.camera.x, this.camera.y);
    MapHandler.drawMapLayer(this.map , new Rectangle(this.camera.x, this.camera.y, 21, 13), 0);
    MapHandler.drawMapLayer(this.map , new Rectangle(this.camera.x, this.camera.y, 21, 13), 1);

    this.#monsterRef.draw();

    // TEMP requires UI
    if (/*DEBUG*/true) { // Always true for beta testers
      Renderer.text(this.#playerRef.hp, 232, 132);
      Renderer.text(this.#monsterRef.hp, 532, 132);
      Renderer.text(`Monster ${this.#monsterRef.action}`, 532, 182);
      Renderer.text(this.#phase, 32, 182)

      if (this.#phase === "choice") {
        if (this.#monsterRef.turn) {
          Renderer.text("Cat turn", 32, 132);
        }
        else {
          Renderer.text("Your turn", 32, 132);
        }
      }
      else if (this.#phase === "attacking") {
        Renderer.text("You attack", 32, 132);
      }
      else if (this.#phase === "waiting") {
        Renderer.text("Waiting", 32, 132);
      }
      else if (this.#phase === "dead") {
        Renderer.text("You died", 100, 100);
      }
    }
  }
};
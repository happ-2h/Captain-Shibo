import AudioHandler from "../audio/AudioHandler";

let instance = null;

class _Settings {
  #keymap;     // For: remapping keys
  #volume;     // For: adjusting music and sound effect volumes
  #resolution; // For: changing resolution

  constructor() {
    if (instance) throw new Error("Settings singleton reconstructed");

    this.#keymap = {
      keyboard: {
        up:     38,
        down:   40,
        left:   37,
        right:  39,
        action: 90,
        pause:  49
      },
      gamepad: {
        action: 0
      }
    };

    this.#volume = {
      music: 0.6,
      sfx:   1
    };

    this.#resolution = { /* TODO */ };

    instance = this;
  }

  // TEMP Dummy load
  load() {
    // Volume
    AudioHandler.setAllVolume(this.#volume.music);
  }

  reset() {
    this.#keymap = {
      keyboard: {
        up:     38,
        down:   40,
        left:   37,
        right:  39,
        action: 90,
        pause:  49
      },
      gamepad: {
        action: 0
      }
    };

    this.#volume = {
      music: 0.6,
      sfx:   1
    };
  }

  incMusicVol() {
    this.#volume.music =
      Number(this.#volume.music) + Number(0.1) >= 1
        ? 1
        : (Number(this.#volume.music) + Number(0.1)).toFixed(1);

    AudioHandler.setAllVolume(this.#volume.music);
  }
  decMusicVol() {
    this.#volume.music =
      Number(this.#volume.music) - Number(0.1) <= 0
        ? 0
        : (Number(this.#volume.music) - Number(0.1)).toFixed(1);

    AudioHandler.setAllVolume(this.#volume.music);
  }

  incSFXVol() {
    this.#volume.sfx =
      Number(this.#volume.sfx) + Number(0.1) >= 1
        ? 1
        : (Number(this.#volume.sfx) + Number(0.1)).toFixed(1);
  }
  decSFXVol() {
    this.#volume.sfx =
      Number(this.#volume.sfx) - Number(0.1) <= 0
        ? 0
        : (Number(this.#volume.sfx) - Number(0.1)).toFixed(1);
  }

  // Accessors
  get keyUp()     { return this.#keymap.keyboard.up; }
  get keyDown()   { return this.#keymap.keyboard.down; }
  get keyLeft()   { return this.#keymap.keyboard.left; }
  get keyRight()  { return this.#keymap.keyboard.right; }
  get keyAction() { return this.#keymap.keyboard.action; }
  get keyPause()  { return this.#keymap.keyboard.pause; }

  get gamepadAction() { return this.#keymap.gamepad.action; }

  get volMusic() { return this.#volume.music; }
  get volSFX()   { return this.#volume.sfx; }

  // Mutators
  set keyUp(keycode) {
    this.#keymap.keyboard.up = keycode;
  }
  set keyDown(keycode) {
    this.#keymap.keyboard.down = keycode;
  }
  set keyLeft(keycode) {
    this.#keymap.keyboard.left = keycode;
  }
  set keyRight(keycode) {
    this.#keymap.keyboard.right = keycode;
  }
  set keyAction(keycode) {
    this.#keymap.keyboard.action = keycode;
  }

  set gamepadAction(button) {
    this.#keymap.gamepad.action = button;
  }
};

const Settings = new _Settings;
export default Settings;
import Sound from "./Sound.js";

let instance = null;

class _AudioHandler {
  #ctx;

  #sounds;
  #trackSources; // Used for stopping audio

  #nowPlaying; // Holds currently playing song ID

  constructor() {
    if (instance) throw new Error("AudioHandler singleton reconstructed");

    this.#ctx = new AudioContext();

    this.#sounds = new Map;
    this.#trackSources = new Map;

    this.#nowPlaying = "";

    instance = this;
  }

  /**
   * @brief Loads a sound
   *
   * @param {String} audioID  - ID to assign to the sound
   * @param {String} filename - Name of the sound file
   */
  load(audioID, filename) {
    return new Promise((res, rej) => {
      this.#loadFile(filename).then(track => {
        // this.#sounds[audioID] = new Sound(track);
        this.#sounds.set(audioID, new Sound(track));
        res(`${filename} loaded`);
      }).catch(err => rej(err));
    });
  }

  /**
   * @brief Converts a sound file to a buffer usable by the AudioContext API
   *
   * @param {String} filename - Name of the sound file
   *
   * @returns Converted audio buffer
   */
  async #getBuffer(filename) {
    const res         = await fetch(`res/snd/${filename}`);
    const arrayBuffer = await res.arrayBuffer();
    const audioBuffer = await this.#ctx.decodeAudioData(arrayBuffer);

    return audioBuffer;
  }

  /**
   * @brief Returns the decoded sound file
   *
   * @param {String} filename - Name of the sound file
   *
   * @returns Decoded buffered sound
   */
  async #loadFile(filename) {
    const track = await this.#getBuffer(filename);
    return track;
  }

  /**
   * @brief Plays a sound
   *
   * @param {String} audioID - ID of the audio file to play
   * @param {Boolean} loop   - true: loop audio\
   *                           false: don't loop audio
   */
  play(audioID, loop=false) {
    if (!this.#sounds.get(audioID)) return;

    if (this.#ctx.state === "suspended") this.#ctx.resume();

    // Set up volume
    const gainNode = this.#ctx.createGain();
    gainNode.gain.value = this.#sounds.get(audioID).volume;
    gainNode.connect(this.#ctx.destination);

    // Set up the buffer source
    const trackSource = this.#ctx.createBufferSource();
    trackSource.buffer = this.#sounds.get(audioID).buffer;
    trackSource.loop = loop;
    trackSource.playbackRate.value = this.#sounds.get(audioID).playbackRate;
    trackSource.connect(gainNode);

    // Save the reference for stopping the sound
    this.#trackSources.set(audioID, trackSource);

    trackSource.start();
  }

  /**
   * @brief Plays a looped sound
   *
   * @param {String} audioID - ID of the audio file to play
   */
  playMusic(audioID) {
    if (!this.#sounds.get(audioID)) return;

    if (this.#ctx.state === "suspended") this.#ctx.resume();
    this.play(audioID, true);
    this.#nowPlaying = audioID;
  }

  /**
   * @brief Stops a currently running sound
   *
   * @param {String} audioID - ID of the audio file to stop
   */
  stop(audioID) {
    this.#trackSources.get(audioID)?.stop();
  }

  /**
   * @brief Stops all playing sounds
   */
  stopAll() {
    this.#trackSources.forEach(track => track?.stop());
  }

  /**
   * @brief Sets the volume of the given sound
   *
   * @param {String} audioID - ID of the audio file to set the volume
   * @param {Number} value   - Positive value to set as the volume
   *
   * @returns null if the audioID is invalid
   */
  setVolume(audioID, value) {
    if (!this.#sounds.get(audioID)) return null;
    this.#sounds.get(audioID).volume = value;
  }

  /**
   * @brief Sets the volume of all sounds in the pool
   *
   * @param {Number} value - Positive value to set as the volume
   */
  setAllVolume(value) {
    this.#sounds.forEach((sound) => sound.volume = value);
  }

  /**
   * @brief Gets the volume of the given sound
   *
   * @param {String} audioID - ID of the audio file to get the volume from
   *
   * @returns null if the audioID is invalid
   */
  getVolume(audioID) {
    if (!this.#sounds.get(audioID)) return null;
    return this.#sounds.get(audioID).volume;
  }

  /**
   * @brief Sets the playback rate of the given sound
   *
   * @param {String} audioID - ID of the audio file to set the playback rate
   * @param {Number} rate    - Positive value to set as the playback rate
   *
   * @returns null if the audioID is invalid
   */
  setPlaybackRate(audioID, rate) {
    if (!this.#sounds.get(audioID)) return null;
    this.#sounds.get(audioID).playbackRate = rate;
  }

  /**
   * @brief Gets the playback rate of the given sound
   *
   * @param {String} audioID - ID of the audio file to get the
   *                           playback rate from
   *
   * @returns null if the audioID is invalid
   */
  getPlaybackRate(audioID) {
    if (!this.#sounds.get(audioID)) return null;
    return this.#sounds.get(audioID).playbackRate;
  }

  // Accessors
  get nowPlaying() { return this.#nowPlaying; }
};

const AudioHandler = new _AudioHandler;
export default AudioHandler;
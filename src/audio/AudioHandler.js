import Sound from "./Sound.js";

let instance = null;

class _AudioHandler {
  #ctx;

  #sounds;
  #trackSources; // Used for stopping audio

  constructor() {
    if (instance) throw new Error("AudioHandler singleton reconstructed");

    this.#ctx = new AudioContext();

    this.#sounds = [];
    this.#trackSources = [];

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
        this.#sounds[audioID] = new Sound(track);
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
    if (!this.#sounds[audioID]) return;

    if (this.#ctx.state === "suspended") this.#ctx.resume();

    // Set up volume
    const gainNode = this.#ctx.createGain();
    gainNode.gain.value = this.#sounds[audioID].volume;
    gainNode.connect(this.#ctx.destination);

    // Set up the buffer source
    const trackSource = this.#ctx.createBufferSource();
    trackSource.buffer = this.#sounds[audioID].buffer;
    trackSource.loop = loop;
    trackSource.playbackRate.value = this.#sounds[audioID].playbackRate;
    trackSource.connect(gainNode);

    // Save the reference for stopping the sound
    this.#trackSources[audioID] = trackSource;

    trackSource.start();
  }

  /**
   * @brief Plays a looped sound
   *
   * @param {String} audioID - ID of the audio file to play
   */
  playMusic(audioID) {
    if (!this.#sounds[audioID]) return;

    if (this.#ctx.state === "suspended") this.#ctx.resume();
    this.play(audioID, true);
  }

  /**
   * @brief Stops a currently running sound
   *
   * @param {String} audioID - ID of the audio file to stop
   */
  stop(audioID) {
    this.#trackSources[audioID]?.stop();
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
    if (!this.#sounds[audioID]) return null;
    this.#sounds[audioID].volume = value;
  }

  /**
   * @brief Gets the volume of the given sound
   *
   * @param {String} audioID - ID of the audio file to get the volume from
   *
   * @returns null if the audioID is invalid
   */
  getVolume(audioID) {
    if (!this.#sounds[audioID]) return null;
    return this.#sounds[audioID].volume;
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
    if (!this.#sounds[audioID]) return null;
    this.#sounds[audioID].playbackRate = rate;
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
    if (!this.#sounds[audioID]) return null;
    return this.#sounds[audioID].playbackRate;
  }
};

const AudioHandler = new _AudioHandler;
export default AudioHandler;
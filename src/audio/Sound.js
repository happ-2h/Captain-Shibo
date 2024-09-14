export default class Sound {
  buffer;
  volume;
  playbackRate;

  /**
   *
   * @param {AudioBuffer} buffer  - Buffer of the decoded audio file
   * @param {Number} volume       - Gain value to play the audio file at
   * @param {Number} playbackRate - Playback rate to play the audio file at
   */
  constructor(buffer=null, volume=1.0, playbackRate=1.0) {
    this.buffer = buffer;
    this.volume = volume;
    this.playbackRate = playbackRate;
  }
};
import { Transport, VAMPartUI, IVAMPart } from "../types";

export class VAMPartVideo implements IVAMPart {
  private _id: string;
  private _type: string;
  private _transport = Transport.STOP;
  private videoElement: HTMLVideoElement = null;
  private trimStart = 0;
  private trimEnd = 0;
  private _duration = 0;
  private _maxDuration = 0;

  constructor(data: VAMPartUI, videoElement: HTMLVideoElement) {
    this._id = data.id;
    this._type = data.type;
    this.videoElement = videoElement;
  }

  get id() {
    return this._id;
  }

  get type() {
    return this._type;
  }

  get transport() {
    return this._transport;
  }

  get currentTime() {
    return this.videoElement.currentTime;
  }

  get maxDuration() {
    return this._maxDuration * 1000;
  }

  get duration() {
    return this._duration * 1000;
  }

  async play() {
    await this.videoElement.play();
    this._transport = Transport.PLAY;
    // console.log("Audio play");
  }
  setStartOffset(millis: number) {}

  pause() {
    this.videoElement.pause();
    this._transport = Transport.PAUSE;
    // console.log("Audio pause");
  }

  stop() {
    this.videoElement.pause();
    this.videoElement.currentTime = 0;
    this._transport = Transport.STOP;
    // console.log("Audio stop");
  }

  setPosition(p: number) {
    this.videoElement.currentTime = p / 1000;
  }

  updateTrim(s: number, e: number) {
    this.trimStart = s / 1000;
    this.trimEnd = e / 1000;
    this._duration = this.maxDuration - this.trimStart + this.trimEnd;
    // console.log(start, trimStart);
  }
}

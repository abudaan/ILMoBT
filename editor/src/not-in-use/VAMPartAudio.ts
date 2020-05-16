import { Observable } from "rxjs";
import { distinctUntilKeyChanged } from "rxjs/operators";
import { Transport, RootState, VAMPartUI, IVAMPart } from "../types";
import { getState$ } from "../redux/store";
import { audioContext } from "../media";

export class VAMPartAudio implements IVAMPart {
  private _id: string;
  private _type: string;
  private _transport = Transport.STOP;
  private file: File = null;
  private gainNode: GainNode = null;
  private pannerNode: PannerNode = null;
  private audioNode: AudioBufferSourceNode = null;
  private audioBuffer: AudioBuffer = null;
  private audioContext: AudioContext = null;
  private trimStart = 0;
  private trimEnd = 0;
  private index = 0;
  private offset = 0; // value in seconds!
  private timestamp = 0;
  private _duration = 0;
  private _maxDuration = 0;
  private state$: Observable<RootState>;

  constructor(data: VAMPartUI, audioBuffer: AudioBuffer) {
    this._id = data.id;
    this.audioBuffer = audioBuffer;
    this.audioContext = audioContext;
    this.gainNode = audioContext.createGain();
    this._duration = this._maxDuration = this.audioBuffer.duration;
    this.pannerNode = audioContext.createPanner();
    // this.state$ = getState$();
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
    return this.offset * 1000;
  }

  get maxDuration() {
    return this._maxDuration * 1000;
  }

  get duration() {
    return this._duration * 1000;
  }

  async play() {
    this.audioNode = this.audioContext.createBufferSource();
    this.audioNode.buffer = this.audioBuffer;

    this.audioNode
      .connect(this.gainNode)
      .connect(this.pannerNode)
      .connect(this.audioContext.destination);

    this.audioNode.start(17 / 1000, this.offset, this._duration);
    // this.audioNode.start();

    this.timestamp = performance.now();
    this._transport = Transport.PLAY;
    console.log("Audio play offset", this.offset);
  }

  pause() {
    if (this.audioNode) {
      this.audioNode.stop();
    }
    this._transport = Transport.PAUSE;
    // console.log("Audio pause");
  }

  stop() {
    if (this.audioNode) {
      this.audioNode.stop();
    }
    this._transport = Transport.STOP;
    // console.log("Audio stop");
  }

  setPosition(p: number) {
    this.offset = p / 1000;
  }

  setStartOffset(millis: number) {}

  updateTrim(s: number, e: number) {
    this.trimStart = s / 1000;
    this.trimEnd = e / 1000;
    this.offset = this.trimStart;
    this._duration = this.maxDuration - this.trimStart + this.trimEnd;
    // console.log(start, trimStart);
  }
}

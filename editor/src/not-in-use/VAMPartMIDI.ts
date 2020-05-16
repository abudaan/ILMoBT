import { Transport, RootState, IVAMPart, VAMPartUI } from "../types";
import { getState$ } from "../redux/store";
import { Song } from "../webdaw/types";
import { schedule, getSchedulerIndex } from "../webdaw/scheduler";
import { getMIDIAccess, getMIDIDevices } from "../webdaw/init-midi";
import { distinctUntilKeyChanged } from "rxjs/operators";
import { unschedule } from "../webdaw/unschedule";
import { MIDIEvent } from "../webdaw/midi_events";
import { outputs } from "../media";
import { Observable } from "rxjs";

export class VAMPartMIDI implements IVAMPart {
  private _id: string;
  private _type: string;
  private _transport = Transport.STOP;
  private midiAccess: WebMidi.MIDIAccess;
  private song: Song;
  private trimStart = 0;
  private trimEnd = 0;
  private index = 0;
  private millis = 0;
  private timestamp = 0;
  private _duration = 0;
  private _maxDuration = 0;
  private scheduled: MIDIEvent[] = [];
  private state$: Observable<RootState>;

  constructor(data: VAMPartUI, song: Song) {
    this._id = data.id;
    this.song = song;
    this.state$ = getState$();

    this.song.tracks.forEach(track => {
      track.outputs.push(...outputs.map(o => o.id));
    });
    this._maxDuration = this._duration = this.song.events[this.song.events.length - 1].millis;

    this.state$.pipe(distinctUntilKeyChanged("playheadPosition")).subscribe(() => {
      if (this._transport === Transport.PLAY) {
        this.playClock(performance.now());
      }
    });
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
    return this.millis;
  }

  get maxDuration() {
    return this._maxDuration;
  }

  get duration() {
    return this._duration;
  }

  private playClock(ts: number) {
    ({ index: this.index, scheduled: this.scheduled } = schedule({
      song: this.song,
      millis: this.millis,
      index: this.index,
      outputs: this.midiAccess?.outputs,
    }));
    this.millis += ts - this.timestamp;
    this.timestamp = ts;
  }

  async play() {
    this.timestamp = performance.now();
    this._transport = Transport.PLAY;
  }

  pause() {
    this._transport = Transport.PAUSE;
    unschedule(this.song, this.scheduled, this.midiAccess?.outputs);
    // console.log("MIDI pause");
  }

  stop() {
    this._transport = Transport.STOP;
    this.index = getSchedulerIndex(this.song, 0);
    unschedule(this.song, this.scheduled, this.midiAccess?.outputs);
    // console.log("MIDI stop");
  }

  setPosition(p: number) {
    this.millis = p;
    unschedule(this.song, this.scheduled, this.midiAccess?.outputs);
    this.index = getSchedulerIndex(this.song, this.millis);
    // console.log(p, start, trimStart, millis, index);
  }
  setStartOffset(millis: number) {}

  updateTrim(s: number, e: number) {
    this.trimStart = s;
    this.trimEnd = e;
    this.millis = this.trimStart;
    this.index = getSchedulerIndex(this.song, this.millis);
    this._duration = this.maxDuration - this.trimStart + this.trimEnd;
    // console.log(start, trimStart);
  }
}

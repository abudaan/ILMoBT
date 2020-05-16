import React, { useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState, RefMIDI } from "../types";
import { NoteOnEvent } from "../../../webdaw/midi_events";
import { createNotePair } from "../../../webdaw/create_note_pair";

const margin = 20;
const width = 500;
const height = 500 / 5;

const draw = (canvas: HTMLCanvasElement, track: RefMIDI) => {
  const events = track.song.events;
  const notes = createNotePair(events);
  // console.log(notes);
  const duration = track.duration;
  // const duration = track.song.events[track.song.events.length - 1].ticks;
  const pixelsPerMilli = width / duration;
  var ctx = canvas.getContext("2d");
  ctx.fillStyle = "#222222";
  ctx.fillRect(0, 0, width, height);

  const [min, max] = events.reduce(
    (acc, val) => {
      const event = val as NoteOnEvent;
      if (event.noteNumber < acc[0]) {
        acc[0] = event.noteNumber;
      }
      if (event.noteNumber > acc[1]) {
        acc[1] = event.noteNumber;
      }
      return acc;
    },
    [Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER]
  );
  const pixelsPerPitch = (height - margin * 2) / (max - min);
  // console.log(pixelsPerPitch, min, max)
  events.forEach(e => {
    const event = e as NoteOnEvent;
    if (event.type[0] === 128 || event.velocity === 0) {
      return;
    }
    const x = event.millis * pixelsPerMilli;
    const y = height - (margin + (event.noteNumber - min) * pixelsPerPitch);
    // console.log(event.noteNumber, y);
    ctx.fillStyle = "#f7bd3e";
    // ctx.fillStyle = 'rgb(' + 100 + ',' + 99 + ',' + (event.velocity * 2) + ')'
    ctx.fillRect(x, y, 2, 2);
  });
};

export const PianoRollPreview = (): JSX.Element => {
  const canvasRef = useRef(null);
  const tracks = useSelector((state: RootState) => state.tracks);
  const currentTrackIndex = useSelector((state: RootState) => state.currentTrackIndex);
  const currentTrack = tracks[currentTrackIndex];

  useEffect(() => {
    if (canvasRef.current) {
      draw(canvasRef.current, currentTrack);
    }
  });

  return <canvas width={width} height={height} ref={canvasRef}></canvas>;
};

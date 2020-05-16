import uniquid from "uniquid";
import { store } from "../store";
import { RootState, VAMPart, Transport, RefVideo, RefAudio, RefMIDI } from "../../types";
import { audioContext, outputs } from "../../media";
import { FILE_UPLOADED } from "../../constants";
import { Dispatch } from "redux";
import { createSongFromMIDIFile } from "../../webdaw/sugar_coating";
import { AudioEvent } from "../../webdaw/audio_event";

let i = 0;
export const handleFileUpload = (
  e: React.ChangeEvent<HTMLInputElement>,
  fileType: string
) => async (dispatch: Dispatch): Promise<void> => {
  const target = e.target as HTMLInputElement;
  const files = target.files as FileList;
  const state = store.getState() as RootState;
  const { width, tracks, partsById, referencesById } = state;

  const file = files[0];
  // const id = fileType === "video" ? fileType : `${fileType}-${uniquid()}`;
  const id = fileType === "video" ? fileType : `${fileType}-${i++}`;

  let vamPart: VAMPart = {
    id,
    type: fileType,
    fileName: file.name,
    fileSize: file.size,
    modified: new Date(file.lastModified),
    start: 0,
    trimStart: 0,
    trimEnd: 0,
    duration: 0,
    muted: false,
    transport: Transport.STOP,
    currentTime: 0,
  };
  let duration: number;
  let videoURL: string;
  let reference: RefVideo | RefAudio | RefMIDI;

  if (fileType === "video") {
    reference = referencesById.video as RefVideo;
    const video = reference.videoElement as HTMLVideoElement;
    const url = URL.createObjectURL(file);
    duration = await new Promise(resolve => {
      video.src = url;
      video.addEventListener("canplay", (): void => {
        resolve(video.duration * 1000);
      });
    });
    videoURL = url;
  } else if (fileType === "audio") {
    const ab = await file.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(ab);
    duration = audioBuffer.duration * 1000;
    const audioEvent: AudioEvent = {
      audioBuffer,
      audioNode: null,
      gainNode: audioContext.createGain(),
      pannerNode: audioContext.createPanner(),
      start: 0,
      duration,
      offset: 0,
    };
    reference = {
      id,
      audioEvent,
    } as RefAudio;
  } else if (fileType === "midi") {
    const ab = await file.arrayBuffer();
    const song = await createSongFromMIDIFile(ab);
    duration = song.events[song.events.length - 1].millis;
    song.tracks.forEach(track => {
      track.outputs.push(...outputs.map(o => o.id));
    });
    reference = { id, song, timestamp: 0, millis: 0, index: 0, scheduled: [] } as RefMIDI;
  }
  vamPart.duration = duration;
  const maxDuration = tracks.reduce((acc, track) => {
    // atm a track can only contain a single part
    const p = partsById[track.partIds[0]];
    let d = p.duration - p.trimStart + p.trimEnd;
    // check if we are replacing the current video
    if (p.type === "video" && fileType === "video") {
      d = 0;
    }
    if (d > acc) {
      return d;
    }
    return acc;
  }, 0);
  const durationTimeline = Math.max(maxDuration, duration);
  const millisPerPixel = width / durationTimeline;
  // console.log(millisPerPixel, Math.max(maxDuration, duration), width, durationTimeline);

  dispatch({
    type: FILE_UPLOADED,
    payload: {
      vamPart,
      reference,
      millisPerPixel,
      durationTimeline,
      videoURL,
    },
  });
};

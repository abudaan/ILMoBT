import { getMIDIDevices, getMIDIAccess } from "../../webdaw/init-midi";

let midiAccess: WebMidi.MIDIAccess = null;
let audioContext: AudioContext = null;
let inputs: WebMidi.MIDIInput[] = [];
let outputs: WebMidi.MIDIOutput[] = [];

export const init = async () => {
  midiAccess = await getMIDIAccess();
  ({ inputs, outputs } = await getMIDIDevices());
  // audioContext.suspend();
  // audioContext = new AudioContext();
};

export const enable = async () => {
  if (audioContext) {
    return;
  }
  if (audioContext.state === "running") {
    return;
  }
  audioContext = new AudioContext();
  await audioContext.resume();
  // console.log(audioContext);
};

export { midiAccess, audioContext, inputs, outputs };

import { store } from "../store";
import { RootState } from "../../types";
import { SEND_TO_FRIEND, SAVE_MIDI_FILE, PANIC, SENT_TO_FRIEND } from "../../constants";
import { unschedule } from "../../../../webdaw/unschedule";
import { midiAccess } from "../../media";
import { clock, getMIDIFile } from "../../util/midi_utils";
import { Dispatch } from "redux";

export const sendToFriend = () => async (dispatch: Dispatch): Promise<void> => {
  clock.stop();
  const state = store.getState() as RootState;
  const { songData, notes, form } = state;
  const { noteMapping } = songData;
  const { name, email, nameFriend, emailFriend, message } = form;
  unschedule(songData.song, midiAccess.outputs);

  const data = {
    name,
    email,
    nameFriend,
    emailFriend,
    message,
    song: getMIDIFile(songData, notes, noteMapping, "base64"),
  };

  dispatch({
    type: SEND_TO_FRIEND,
  });

  const response = await fetch("https://ilmobt.heartbeatjs.org/post-song.php", {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "no-cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });

  console.log(response.json());

  dispatch({
    type: SENT_TO_FRIEND,
  });
};

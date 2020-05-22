// import "jzz";
import "./styles/index.scss";
import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { RESIZE } from "./constants";
import { store } from "./redux/store";
import { setupClock } from "./observers";
import { Transport } from "./types";
import { init, midiAccess } from "./media";
import { App } from "./components/App";
import { unschedule } from "../../webdaw/unschedule";
import { loadAlbum } from "./redux/actions/loadAlbum";
import { loadSong } from "./redux/actions/loadSong";
import { handleTransport } from "./redux/actions/handleTransport";

document.addEventListener("DOMContentLoaded", () => {
  init().then(() => {
    const player = document.getElementById("player");

    if (midiAccess === null) {
      const browsers = [
        "Chromium",
        "Chrome",
        "Brave",
        "Edge",
        "Opera",
        "Vivaldi",
        "Samsung Internet",
      ].map(b => <li key={b}>{b}</li>);
      render(
        <div className="no-chromium-warning">
          The MIDI player only runs in Chromium based browsers such as:
          <ul>{browsers}</ul>
        </div>,
        player
      );
      return;
    }

    render(
      <Provider store={store}>
        <App></App>
      </Provider>,
      player
    );

    const s = location.search;
    const id = s.substring(s.indexOf("=") + 1);
    if (id) {
      store.dispatch(loadSong(`https://ilmobt.heartbeatjs.org/backend/songs/${id}.json`));
    } else {
      if (window.location.hostname === "localhost") {
        store.dispatch(loadAlbum("/assets/list.json"));
      } else {
        store.dispatch(loadAlbum("https://ilmobt.heartbeatjs.org/list.json"));
      }
    }

    const resize = () => {
      const rect = player.getBoundingClientRect();
      store.dispatch({
        type: RESIZE,
        payload: {
          width: rect.width,
          height: rect.height,
        },
      });
    };
    resize();
    window.addEventListener("resize", resize);

    // set up a clock using RxJS
    setupClock();

    document.addEventListener("keydown", e => {
      if (e.keyCode === 32 || e.keyCode === 13) {
        const { transport } = store.getState();
        const action = transport === Transport.PLAY ? Transport.PAUSE : Transport.PLAY;
        // console.log(action);
        store.dispatch(handleTransport(action));
      } else if (e.keyCode === 96) {
        store.dispatch(handleTransport(Transport.STOP));
      }
    });
    document.addEventListener("keyup", e => {
      // console.log(e);
    });

    const cleanup = () => {
      const state = store.getState();
      state.transport = Transport.STOP; // YOLO!
      state.tracks.forEach(({ song }) => {
        unschedule(song, midiAccess?.outputs);
      });
    };

    window.addEventListener("beforeunload", event => {
      cleanup();
    });

    window.addEventListener("visibilitychange", event => {
      cleanup();
    });
  });
});

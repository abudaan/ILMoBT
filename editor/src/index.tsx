// import "jzz";
import "./styles/index.scss";
import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { RESIZE } from "./constants";
import { store } from "./redux/store";
import { Transport } from "./types";
import { init, midiAccess } from "./media";
import { handleTransport } from "./redux/actions/handleTransport";
import { App } from "./components/App";
import { setupSong } from "./redux/actions/setupSong";

document.addEventListener("DOMContentLoaded", () => {
  init().then(() => {
    const editor = document.getElementById("editor");

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
        <div className="message">
          The MIDI editor only runs in Chromium based browsers such as:
          <ul>{browsers}</ul>
        </div>,
        editor
      );
      return;
    }

    store.dispatch(setupSong());

    render(
      <Provider store={store}>
        <App></App>
      </Provider>,
      editor
    );

    const resize = () => {
      const rect = editor.getBoundingClientRect();
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
      store.dispatch(handleTransport(Transport.STOP));
    };

    window.addEventListener("beforeunload", event => {
      cleanup();
    });

    window.addEventListener("visibilitychange", event => {
      cleanup();
    });
  });
});

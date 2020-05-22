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
import { loadJSON } from "./redux/actions/loadJSON";

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

    if (window.location.hostname === "localhost") {
      store.dispatch(loadJSON("./config.json"));
    } else {
      store.dispatch(loadJSON("https://ilmobt.heartbeatjs.org/editor/config.json"));
    }

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
    window.addEventListener("resize", resize);

    document.addEventListener("keydown", e => {});
    document.addEventListener("keyup", e => {
      const target = e.target as HTMLElement;
      // console.log(target.nodeName);
      if (target.nodeName === "INPUT" || target.nodeName === "TEXTAREA") {
        return;
      }
      if (e.keyCode === 32 || e.keyCode === 13) {
        const { transport } = store.getState();
        const action = transport === Transport.PLAY ? Transport.PAUSE : Transport.PLAY;
        // console.log(action);
        store.dispatch(handleTransport(action));
      } else if (e.keyCode === 96) {
        store.dispatch(handleTransport(Transport.STOP));
      }
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

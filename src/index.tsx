import "./styles/index.scss";
import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { RESIZE } from "./constants";
import { store } from "./redux/store";
import { setupClock } from "./observers";
import { Transport } from "./types";
import { init } from "./media";
import { handleTransport, loadJSON } from "./redux/actions/handleOther";
import { App } from './components/App'

document.addEventListener("DOMContentLoaded", () => {

  init().then(() => {
    const album = document.getElementById("album");
    render(
      <Provider store={store}>
        <App></App>
      </Provider>,
      album
    );

    store.dispatch(loadJSON('https://ilmobt.heartbeatjs.org/list.json'));

    const resize = () => {
      const rect = album.getBoundingClientRect();
      store.dispatch({
        type: RESIZE,
        payload: {
          width: rect.width,
          height: rect.height,
        },
      });
    }
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
  })
});

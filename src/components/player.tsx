import { useEffect, useState } from "preact/hooks";
import Controls from "./constrols";
import ProgressBar from "./progressbar";
import History from "./history";
import Home from "./home";
import store from "../store";
import { getToken } from "../utils/spotify";
import useStore from "../hooks/useStore";

export default function Player() {
  const token = useStore((state) => state.accessToken);

  useEffect(() => {
    const code = location.href.split("code=")[1]?.split("&")[0];
    if (code) {
      history.replaceState(null, '', location.pathname);
      getToken(code).then((token) => {
        store.setAccessToken(token[0]);
        store.setRefreshToken(token[1]);
      });
    }
  }, []);

  return (
    <div class="player">
      {token ? <History /> : <Home />}
      <ProgressBar />
      <Controls />
    </div>
  );
}

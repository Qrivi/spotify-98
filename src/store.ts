import { StateUpdater } from "preact/hooks";
import { currentlyPlaying, isTrackObjectFull } from "./utils/spotify";

export interface Track {
  title: string;
  artists: string;
  album: string;
    artwork: string;
    duration: number;
    started: number;
}

export interface State {
  accessToken: string;
  refreshToken: string;
  refreshed: Date;
  history: Track[];
  playing: boolean;
}

function createStore(initialState: State) {
  let currentState = initialState;
  const listeners = new Set<StateUpdater<State>>();

  return {
    getState: () => currentState,
    subscribe: (listener: StateUpdater<State>) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },

    setAccessToken: (token: string) => {
      currentState = { ...currentState, accessToken: token, refreshed: new Date() };
      listeners.forEach((listener) => listener(currentState));
    },

    setRefreshToken: (token: string) => {
      currentState = {
        ...currentState,
        refreshToken: token,
      };
      listeners.forEach((listener) => listener(currentState));
    },
    pingSpotify: async () => {
      // TODO add try catch
      const response = await currentlyPlaying(currentState.accessToken);
      if (isTrackObjectFull(response?.item)) {
        const currentTrack = currentState.history[currentState.history.length - 1];
        const fetchedTrack = {
          title: response!.item.name,
          artists: response!.item.artists.map((artist) => artist.name).join(", "),
          album: response!.item.album.name,
          artwork: response!.item.album.images[0].url,
          duration: response!.item.duration_ms,
          started: Date.now(),
        };

        if (JSON.stringify(fetchedTrack) !== JSON.stringify(currentTrack)) {
          currentState = {
            ...currentState,
            history: [...currentState.history, fetchedTrack],
          };
        }

        if (response!.is_playing !== currentState.playing) {
          currentState = {
            ...currentState,
            playing: response!.is_playing,
          };
        }

        listeners.forEach((listener) => listener(currentState));
      }
    },
  };
}

const store = createStore({
  accessToken: "",
  refreshToken: "",
  refreshed: new Date(),
  history: [],
  playing: false,
});

export default store;

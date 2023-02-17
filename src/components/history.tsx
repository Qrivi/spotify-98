import { useEffect } from "preact/hooks";
import useStore from "../hooks/useStore";
import store from "../store";

export default function History() {
  let elapsedSeconds = -1;
  useEffect(() => {
    const interval = setInterval(() => {
      elapsedSeconds++;
      if (elapsedSeconds % 5 === 0) {
        console.log("deelbaar door 5", elapsedSeconds);

        store.pingSpotify();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const isPlaying = useStore((state) => state.playing);
  const history = useStore((state) => state.history);
  const currentTrack = history.length ? history[history.length - 1] : undefined;

  return (
    <div className="history">
      <div
        className="album"
        style={{
          backgroundImage: `url('${currentTrack?.artwork}')`,
          animationPlayState: isPlaying ? "running" : "paused",
          opacity: currentTrack ? 1 : 0,
        }}
      ></div>
      <div className="container">
        <ol>
          {history.map((track, index) => {
            return <li key={index}>{`${track.title} - ${track.artists}.mp3`}</li>;
          })}
        </ol>
      </div>
    </div>
  );
}

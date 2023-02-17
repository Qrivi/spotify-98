import useStore from "../hooks/useStore";

export default function ProgressBar() {
  const isPlaying = useStore((state) => state.playing);
  const history = useStore((state) => state.history);
  const {duration, started} = history.length ? history[history.length - 1] : {duration: 0, started: 0};

  if( duration || started ) {
  
  }


  return (
      <div className="progressbar">
      <div className="knob"></div>
    </div>
  );
}

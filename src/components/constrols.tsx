import play from "../assets/icons/1-play.png";
import pause from "../assets/icons/2-pause.png";
import stop from "../assets/icons/3-stop.png";
import prev from "../assets/icons/4-prev.png";
import rewind from "../assets/icons/5-rewind.png";
import forward from "../assets/icons/6-forward.png";
import next from "../assets/icons/7-next.png";
import tune from "../assets/icons/8-tune.png";
import useStore from "../hooks/useStore";

export default function Controls() {
  const isPlaying = useStore((state) => state.playing);
  
  return (
    <div class="controls">
      <div class="group">
        <button class={`play ${isPlaying && "active"}`}>
          <img src={play} />
        </button>
        <button class={`pause ${!isPlaying && "active"}`}>
          <img src={pause} />
        </button>
        <button class="stop">
          <img src={stop} />
        </button>
      </div>
      <div class="group">
        <button class="prev">
          <img src={prev} />
        </button>
        <button class="rewind">
          <img src={rewind} />
        </button>
        <button class="forward">
          <img src={forward} />
        </button>
        <button class="next">
          <img src={next} />
        </button>
      </div>
      <div class="group">
        <button class="tune">
          <img src={tune} />
        </button>
      </div>
    </div>
  );
}

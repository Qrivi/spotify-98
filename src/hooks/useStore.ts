import { useEffect, useState } from "preact/hooks";
import store, { State } from "../store";

type StateSelector<T> = (state: State) =>  T;

const useStore = <T>(selector: StateSelector<T> ):  T => {
  const [state, setState] = useState(selector(store.getState()));
  useEffect(() => store.subscribe((state) => setState(selector(state as State))), []);
  return state;
};

export default useStore;

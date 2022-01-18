import { useCallback, useRef, useState } from "react";
import "./App.css";

// import { useWorker } from "react-hooks-worker";

const createWorker = () =>
  new Worker(new URL("./workers/worker.js", import.meta.url));

const defaultState = {
  count: 0,
  active: false,
  pause: false,
  limit: 10,
};

function App() {
  const worker = useRef(createWorker());
  const [counter, setCounter] = useState(defaultState);

  // useEffect(() => {
  //   worker.current.postMessage(7);

  //   worker.current.addEventListener("message", (evt) => {
  //     console.log(evt);
  //     setResult(evt.data);
  //   });
  // }, []);

  const handleCount = useCallback(
    (flg) => () => {
      // console.log(counter.count);
      const newState =
        flg !== "reset"
          ? { ...counter, [flg]: !counter[flg] }
          : defaultState;
      console.log(newState);
      setCounter(newState);
      worker.current.postMessage(newState);
      // let newState = { ...counter, active: !counter.active };
      // console.log(newState);
    },
    [counter, worker]
  );

  worker.current.onmessage = (evt) => {
    console.log(evt);
    const { count, active, pause, limit } = evt.data;
    // console.log(evt.data);

    setCounter({ count, active, pause, limit });
  };

  return (
    <>
      <div>Counter: {counter.count}</div>
      {!counter.active && (
        <button onClick={handleCount("active")}>start</button>
      )}
      {counter.active && (
        <button onClick={handleCount("pause")}>
          {counter.pause ? "resume" : "pause"}
        </button>
      )}
      {counter.pause && <button onClick={handleCount("reset")}>reset</button>}
    </>
  );
}

export default App;

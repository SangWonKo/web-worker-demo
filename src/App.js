import { useCallback, useRef, useState } from "react";
import "./App.css";

// import { useWorker } from "react-hooks-worker";

const createWorker = () =>
  new Worker(new URL("./workers/worker.js", import.meta.url));

const defaultState = {
  count: 0,
  stop: false,
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

  const handleCount = useCallback(() => {
    setCounter((prev) => ({ ...prev, count: counter.count }));
    worker.current.postMessage(counter);
  }, [counter, worker]);

  worker.current.onmessage = (evt) => {
    const { count, stop, limit } = evt.data;
    console.log(evt);
    setCounter({ count, stop, limit });
  };

  return (
    <>
      <div>Counter: {counter.count}</div>
      <button onClick={handleCount}>start</button>
    </>
  );
}

export default App;

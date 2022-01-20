import { useCallback, useRef, useState } from "react";
import { motion, Variants, Transition, AnimatePresence } from "framer-motion";
import styled from "styled-components";
import "./App.css";

// import { useWorker } from "react-hooks-worker";

const MotionText = styled(motion.div)`
  font-size: 60px;
  font-family: "Montserrat Alternates";
  font-weight: 600;
  line-height: 40px;
  text-align: center;
`;

const MotionButton = styled(motion.button)`
  border: none;
  cursor: pointer;
  background-color: #fff;
  color: #5e5e5e;
  border-radius: 36px;
  outline: none;
  margin: 0;
  padding: 10px;
  padding-left: 20px;
  padding-right: 20px;
  margin-top: 20px;
  font-family: "Montserrat Alternates";
  font-size: 42px;
  letter-spacing: -2px;
  font-weight: 600;
  line-height: 40px;
  position: relative;
  text-align: center;
  display: flex;
  align-items: center;
  box-shadow: 0px 40px 80px 0px rgba(0, 0, 0, 0.05),
    inset 0px -10px 20px 0px rgba(0, 0, 0, 0.05),
    0px 10px 20px 0px rgba(0, 0, 0, 0.05);
`;

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
        flg !== "reset" ? { ...counter, [flg]: !counter[flg] } : defaultState;
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
      <AnimatePresence>
        <MotionText
          key={counter.count}
          exit={{ y: -75, opacity: 0, position: "absolute" }}
          initial={{ y: 150, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            ease: "easeOut",
            duration: 1,
          }}
        >
          {counter.count}
        </MotionText>
      </AnimatePresence>
      {!counter.active && (
        <MotionButton onClick={handleCount("active")}>start</MotionButton>
      )}
      {counter.active && (
        <MotionButton onClick={handleCount("pause")}>
          {counter.pause ? "resume" : "pause"}
        </MotionButton>
      )}
      {counter.pause && <MotionButton onClick={handleCount("reset")}>reset</MotionButton>}
    </>
  );
}

export default App;

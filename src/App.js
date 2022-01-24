import { Suspense, useCallback, useRef, useState } from "react";
import { motion, Variants, Transition, AnimatePresence } from "framer-motion";
import { styled } from "@mui/material/styles";
import "./App.css";
import { Box, Container, Grid } from "@mui/material";
import Star from "./Star";

// import { useWorker } from "react-hooks-worker";

const MotionText = styled(motion.div)`
  font-size: 60px;
  /* font-family: "Montserrat Alternates"; */
  font-weight: 600;
  line-height: 40px;
  text-align: center;
`;

const StyledContainer = styled(Container)`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  font-family: "Inter", Arial;
  background: #f4f5fa;
`;

const MotionButton = styled(motion.button)`
  border: none;
  cursor: pointer;
  background-color: #fff;
  color: #5e5e5e;
  border-radius: 36px;
  outline: none;
  padding: 20px;
  padding-left: 25px;
  padding-right: 25px;
  margin: 15px 0;
  /* font-family: "Montserrat Alternates"; */
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

  &:disabled {
    cursor: default;
    opacity: 0.5;
    background-color: #d6d6d6;
  }
`;

const MotionIcon = styled(motion.div)`
  display: block;
  width: 600px;
  height: 300px;
  z-index: 1;
  pointer-events: none;
  transform-origin: 50% 52%;
  /* filter: grayscale(var(--button-star-greyscale))
    contrast(var(--button-star-contrast)); */
  opacity: 0.3;
  position: absolute;
  left: 50px;
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
  const [textColor, setTextColor] = useState("#000000");
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
      if (flg === "reset") setTextColor("#000000");
      const newState =
        flg !== "reset" ? { ...counter, [flg]: !counter[flg] } : defaultState;
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
    const newColor = Math.floor(Math.random() * 16777215).toString(16);
    setCounter({
      count,
      active: count === 10 ? false : active,
      pause: count === 10 ? true : pause,
      limit,
    });
    setTextColor("#" + newColor);
  };

  return (
    <StyledContainer>
      <MotionIcon>
        <Suspense fallback={null}>
          <Star isHover={true} />
        </Suspense>
      </MotionIcon>
      <Grid
        container
        spacing={2}
        alignItems="center"
        justifyContent="center"
        maxWidth="sm"
      >
        <Grid item xs={3}>
          <AnimatePresence>
            <MotionText
              key={counter.count}
              exit={{ y: -40, opacity: 0 }}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 0.25,
                // delay: 0.3,
              }}
              style={{ color: textColor }}
            >
              {counter.count}
            </MotionText>
          </AnimatePresence>
        </Grid>
        <Grid item xs={3}>
          <MotionButton
            onClick={handleCount("active")}
            disabled={counter.active}
            whileTap="press"
          >
            start
          </MotionButton>

          <MotionButton
            onClick={handleCount("pause")}
            disabled={!counter.active}
          >
            {counter.pause ? "resume" : "pause"}
          </MotionButton>

          <MotionButton
            onClick={handleCount("reset")}
            disabled={!counter.pause}
          >
            reset
          </MotionButton>
        </Grid>
      </Grid>
    </StyledContainer>
  );
}

export default App;

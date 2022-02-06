import { Suspense, useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";
import Star from "./Star";
import PageTransition from "./framer-motions/PageTransition";

// import { useWorker } from "react-hooks-worker";

const MotionText = styled(motion.div)`
  font-size: 60px;
  /* font-family: "Montserrat Alternates"; */
  font-weight: 600;
  line-height: 40px;
  text-align: center;
  padding: 100px;
`;

const Container = styled("div")`
  ${"--button-star-greyscale"}: 100%;
  ${"--button-star-contrast"}: 0%;
   display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
`;

const StyledBox = styled(Box)`
  padding-left: 120px;
  position: relative;
  text-align: center;
  display: flex;
  align-items: center;
`;

const MotionButton = styled(motion.button)`
  border: none;
  cursor: pointer;
  background-color: #fff;
  color: #5e5e5e;
  border-radius: 36px;
  outline: none;
  padding: 20px 25px;
  margin: 30px 0 20px;
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
  filter: grayscale(var(--button-star-greyscale))
    contrast(var(--button-star-contrast));
  opacity: 0.3;
  position: absolute;
  left: -240px;
`;

const createWorker = () =>
  new Worker(new URL("../workers/counter_worker.js", import.meta.url));

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
    const newColor = Math.floor(Math.random() * 0xffffff).toString(16);
    setCounter({
      count,
      active: count === counter.limit ? false : active,
      pause: count === counter.limit ? true : pause,
      limit,
    });
    setTextColor("#" + newColor);
  };

  const [isHover, setIsHover] = useState({
    start: false,
    pause: false,
    reset: false,
  });

  return (
    <PageTransition>
      <Container>
        <StyledBox>
          <MotionIcon
            animate={[isHover.start ? "hover" : "rest"]}
            variants={iconVariants}
          >
            <Suspense fallback={null}>
              <Star
                isHover={isHover.start}
                counter={counter}
                color={textColor}
              />
            </Suspense>
          </MotionIcon>
          <AnimatePresence>
            <MotionText
              key={counter.count}
              exit={{ y: -40, opacity: 0, position: "absolute" }}
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
          <Box width={150}>
            <Button
              // variants={buttonVariants}
              onClick={handleCount("active")}
              isHover={isHover.start}
              onHoverStart={() =>
                setIsHover((prev) => ({ ...prev, start: true }))
              }
              onHoverEnd={() =>
                setIsHover((prev) => ({ ...prev, start: false }))
              }
              disabled={counter.active}
            >
              start
            </Button>
            <Button
              onClick={handleCount("pause")}
              isHover={isHover.pause}
              onHoverStart={() =>
                setIsHover((prev) => ({ ...prev, pause: true }))
              }
              onHoverEnd={() =>
                setIsHover((prev) => ({ ...prev, pause: false }))
              }
              disabled={!counter.active}
            >
              {counter.pause ? "resume" : "pause"}
            </Button>

            <Button
              onClick={handleCount("reset")}
              isHover={isHover.reset}
              onHoverStart={() =>
                setIsHover((prev) => ({ ...prev, reset: true }))
              }
              onHoverEnd={() =>
                setIsHover((prev) => ({ ...prev, reset: false }))
              }
              disabled={!counter.pause}
            >
              reset
            </Button>
          </Box>
        </StyledBox>
      </Container>
    </PageTransition>
  );
}

export default App;

const Button = ({
  isHover,
  onHoverStart,
  onHoverEnd,
  variants,
  onClick,
  children,
  ...props
}) => {
  return (
    <MotionButton
      animate={[isHover ? "hover" : "rest"]}
      variants={buttonVariants}
      initial={false}
      whileTap="press"
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      onClick={onClick}
      {...props}
    >
      {children}
    </MotionButton>
  );
};

const buttonVariants = {
  rest: {
    transition: { duration: 0.7 },
  },
  hover: {
    scale: 1.2,
    y: -8,
  },
  press: { scale: 1.1 },
};

const iconVariants = {
  rest: {
    "--button-star-greyscale": "100%",
    "--button-star-contrast": "0%",
  },
  hover: {
    "--button-star-greyscale": "0%",
    "--button-star-contrast": "100%",
    opacity: 1,
  },
};

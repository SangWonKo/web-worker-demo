import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import PageTransition from "./PageTransition";
import { MotionButton} from "./StarredCounter";
const item = {
    hidden: { x: -50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
      }
    }
  };

const Home = () => {
    const navigate = useNavigate();
  return (
      <></>
    // <PageTransition>
    //   <motion.h1 variants={item} initial="hidden" animate="visible">
    //     Web Workers with Framer
    //   </motion.h1>
    //   <MotionButton onClick={() => navigate("/starred-counter")}>Starred</MotionButton>
    // </PageTransition>
  );
};

export default Home;

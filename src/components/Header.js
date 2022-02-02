import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import { useEffect, useMemo } from "react";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import PageTransition from "./PageTransition";

const item = {
  hidden: { x: -50, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
    },
  },
};

const MotionNav = styled(motion.nav)`
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /* background-color: white; */
  /* border-bottom: 1px solid #5e5e5e; */
  box-shadow: 0 2px 4px 2px rgb(0 0 0 / 5%);
`;

const navVariants = {
  expanded: {
    top: 0,
    height: "100vh",
    transition: {
      duration: 0.7,
      
    }

  },
  rest: {
    top: 0,
    height: "120px",
    transition: {
      duration: 0.7,
     
    }
  }
};

const Header = () => {
  const location = useLocation();
  const isHome = useMemo(
    () => (location.pathname === "/" ? true : false),
    [location]
  );

  useEffect(() => {
    console.log(isHome);
  }, [isHome]);

  return (
    <PageTransition>
      <MotionNav
        initial={false}
        animate={isHome ? "expanded" : "rest"}
        variants={navVariants}
      >
        <motion.h1 variants={item} initial="hidden" animate="visible">
          Web Workers with Framer
        </motion.h1>
        <Link to="starred-counter">starred</Link>
        <Link to="image-loader">image-loader</Link>
      </MotionNav>
    </PageTransition>
  );
};

export default Header;

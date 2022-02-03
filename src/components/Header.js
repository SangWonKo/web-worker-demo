import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";
// import { Link } from "react-router-dom";
// import PageTransition from "./framer-motions/PageTransition";

// const item = {
//   hidden: { x: -50, opacity: 0 },
//   visible: {
//     x: 0,
//     opacity: 1,
//     transition: {
//       duration: 0.8,
//     },
//   },
// };

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

const MotionTitle = styled(motion.h1)`
  font-size: 36px;
  color: #03c75a;
`;

const Icon = styled("div")`
  position: absolute;
  cursor: pointer;
  top: 30px;
  left: 30px;
`;

// const MotionSvg = styled(motion.svg)`
//   width: 100px;
//   overflow: visible;
//   fill: none;

//   stroke: #000;
//   stroke-width: 10px;
// `;

const LinkContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
`;
const MotionLink = styled(motion.button)`
  border: none;
  cursor: pointer;
  background: #03c75a;
  color: #fff;
  padding: 10px 40px;
  margin: 10px;
  font-size: 24px;
  border-radius: 8px;
  box-shadow: 0px 40px 80px 0px rgba(0, 0, 0, 0.05),
    inset 0px -10px 20px 0px rgba(0, 0, 0, 0.05),
    0px 10px 20px 0px rgba(0, 0, 0, 0.05);
`;

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = useMemo(
    () => (location.pathname === "/" ? true : false),
    [location]
  );
  const [hover, setHover] = useState(false);

  useEffect(() => {
    console.log(isHome);
  }, [isHome]);

  return (
    <MotionNav
      initial={false}
      animate={isHome ? "expanded" : "rest"}
      variants={navVariants}
    >
      <Icon onClick={() => navigate(-1)}>
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          width="44"
          height="44"
          fill="none"
          overflow="visible"
          viewBox="0 0 64 64"
          stroke="#03c75a"
          strokeWidth="6px"
          animate={isHome ? "hidden" : "visible"}
          // variants={svgVariants}
        >
          <motion.path
            d="M2 2h60v60H2z"
            stroke-linejoin="round"
            stroke-linecap="round"
            variants={pathVariants}
          />
          <motion.path
            d="M50 32H15m13-11L15 31.998 28 43"
            stroke-linejoin="round"
            stroke-linecap="round"
            variants={pathVariants}
          />
        </motion.svg>
      </Icon>

      <MotionTitle
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1, transition: { duration: 0.8 } }}
      >
        Web Workers with Framer
      </MotionTitle>
      <LinkContainer
        initial="hidden"
        animate={[isHome ? "visible" : "hidden"]}
        variants={linkVariants}
      >
        <MotionLink
          onClick={() => navigate("/starred-counter")}
          variants={itemVariants}
        >
          Starred
        </MotionLink>
        <MotionLink
          onClick={() => navigate("/image-loader")}
          variants={itemVariants}
        >
          Image-loader
        </MotionLink>
      </LinkContainer>
    </MotionNav>
  );
};

export default Header;

const navVariants = {
  expanded: {
    top: 0,
    height: "100vh",
    backgroundColor: "#f4f5fa",
    transition: {
      duration: 0.7,
    },
  },
  rest: {
    top: 0,
    height: "100px",
    backgroundColor: "#fff",
    transition: {
      duration: 0.7,
    },
  },
};

// const svgVariants = {
//   hidden: {
//     scale: 0,
//     transition: { duration: 1 },
//   },
//   visible: {
//     scale: 1,
//     transition: { duration: 1 },
//   },
// };

const pathVariants = {
  hidden: {
    opacity: 0,
    pathLength: 0,
    transition: {
      duration: 1,
      ease: "easeInOut",
    },
  },
  visible: {
    opacity: 1,
    pathLength: 1,
    transition: {
      duration: 1,
      ease: "easeInOut",
    },
  },
};
const linkVariants = {
  hidden: {
    display: "none",
    opacity: 0,
    y: 8,
    transition: {
      staggerChildren: 0.2,
      // staggerDirection: -1,
      when: "afterChildren",
    },
  },
  visible: {
    display: "flex",
    visibility: "visible",
    opacity: 1,
    y: 0,
    transition: {
      when: "beforeChildren",
      delayChildren: 0.2,
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

import { motion } from "framer-motion/three";
import { degreesToRadians } from "popmotion";
import { useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
// import { useEffect } from "react";

const Star = ({ isLiked, isHover, color = "#000000" }) => {
  const { nodes } = useGLTF("/star3.glb");

  // useEffect(() => {
  //   console.log(counter.count);

  //   return () => console.log(counter.count);
  // }, [counter.count]);

  return (
    <Canvas
      resize={{ offsetSize: true }}
      dpr={[1, 2]}
      camera={{ position: [0, 0, 5.5], fov: 45 }}
    >
      {lights.map(([x, y, z, intensity], i) => (
        <pointLight
          key={i}
          intensity={intensity}
          position={[x / 8, y / 8, z / 8]}
          color="#fff"
        />
      ))}
      <group dispose={null}>
        <motion.mesh
          geometry={nodes.Star.geometry}
          rotation={[Math.PI / 2, 0, degreesToRadians(360)]}
          scale={1}
          animate={[isHover ? "hover" : ""]}
          variants={{
            unliked: {
              x: [0, 0],
              y: [0, 0],
              scale: 0.9,
            },
            liked: {
              x: 4,
              y: [0, -1.5, 2],
              scale: 0.9,
              transition: { duration: 0.5 },
            },
            hover: {
              rotateZ: 0,
              rotateY: 0.3,
              scale: 1.5,
              // transition: {
              //   rotateZ: { duration: 1.5, ease: "linear", repeat: Infinity }
              // }
            },
          }}
          transition={isHover ? likedTransition : ""}
        >
          <meshPhongMaterial
            color={color === "#000000" ? "#ffdd00" : color}
            emissive={
              color === "#000000" ? "#ff9500" : colorLuminance(color, 0.5)
            }
            specular="#fff"
            shininess="100"
          />
        </motion.mesh>
      </group>
    </Canvas>
  );
};

const lights = [
  [2, 1, 4, 1],
  [8, 0, 4, 1],
];

export default Star;

const likedTransition = {
  rotateZ: { duration: 1.5, ease: "linear", repeat: Infinity },
};

const colorLuminance = (hex, lum) => {
  // validate hex string
  hex = String(hex).replace(/[^0-9a-f]/gi, "");
  if (hex.length < 6) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  lum = lum || 0;

  // convert to decimal and change luminosity
  var rgb = "#",
    c,
    i;
  for (i = 0; i < 3; i++) {
    c = parseInt(hex.substr(i * 2, 2), 16);
    c = Math.round(Math.min(Math.max(0, c + c * lum), 255)).toString(16);
    rgb += ("00" + c).substr(c.length);
  }

  return rgb;
};

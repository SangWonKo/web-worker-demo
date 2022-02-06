import { Close } from "@mui/icons-material";
import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import { Suspense } from "react";
import { RatingWrapper } from "./ImageLoader";
import Star from "./Star";

const Container = styled("div")`
  ${"--button-star-greyscale"}: 100%;
  ${"--button-star-contrast"}: 0%;
`;
const MotionCard = styled(motion.div)`
  height: auto;
  max-width: 1200px;
  overflow: hidden;
  margin: 70px auto;
  top: 0;
  left: 0;
  right: 0;
  position: fixed;
  z-index: 100;
  cursor: pointer;
  border-radius: 36px;
`;

const Overlay = styled("div")`
  z-index: 50;
  position: fixed;
  background: rgba(0, 0, 0, 0.3);
  will-change: opacity;
  top: 0;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100vw;
`;

const RatingStar = styled("button")`
  background-color: transparent;
  border: none;
  outline: none;
  cursor: pointer;
  width: 300px;
  height: 300px;
`;
// const MotionIcon = styled(motion.div)`
//   display: block;
//   width: 600px;
//   height: 300px;
//   z-index: 1;
//   pointer-events: none;
//   transform-origin: 50% 52%;
//   filter: grayscale(var(--button-star-greyscale))
//     contrast(var(--button-star-contrast));
//   opacity: 0.3;
//   position: absolute;
//   left: -240px;
// `;

const MotionIcon = styled(motion.div)(
  (props) => `
  display: block;
  width: 100px;
  height: 100px;
  z-index: 101;
  
  transform-origin: 50% 52%;
  filter: grayscale(var(--button-star-greyscale))
    contrast(var(--button-star-contrast));
  position: absolute;

  left: ${props.left}px;
`
);

const ExpandedCard = ({ onClick, img, rating, setRating, hover, setHover }) => {
  return (
    <Container>
      <Overlay />
      <MotionCard layoutId="expandable-card" transition={{ duration: 0.5 }}>
        <Card>
          <RatingWrapper>
            {[...Array(5)].map((star, index) => {
              index += 1;
              return (
                <MotionIcon
                  key={index}
                  animate={[index <= (hover || rating) ? "hover" : "rest"]}
                  variants={iconVariants}
                  // onClick={() => setRating(index)}
                  // onMouseEnter={() => setHover(index)}
                  // onMouseLeave={() => setHover(rating)}
                  left={-150 + index * 200}
                >
                  <RatingStar
                    type="button"
                    // key={index}
                    className={index <= (hover || rating) ? "on" : "off"}
                    onClick={() => setRating(index)}
                    onMouseEnter={() => setHover(index)}
                    onMouseLeave={() => setHover(rating)}
                  >
                    <Suspense fallback={null}>
                      <Star isHover={index <= (hover || rating)} />
                    </Suspense>
                  </RatingStar>
                </MotionIcon>
              );
            })}
          </RatingWrapper>
          <Close
            onClick={onClick}
            sx={{
              position: "absolute",
              fontSize: "44px",
              cursor: "pointer",
              right: 12,
              top: 10,
            }}
          />
          <CardMedia
            component="img"
            image={img}
            sx={{ height: "560px", width: "100vw" }}
          />
          <CardContent sx={{ textAlign: "left" }}>
            <Typography gutterBottom variant="h2">
              Item Title
            </Typography>
            <Typography variant="h4" color="text.secondary">
              Lorem ipsum 머시기머시기 블라블라 어쩌구저쩌구
            </Typography>
          </CardContent>
        </Card>
      </MotionCard>
    </Container>
  );
};

export default ExpandedCard;

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

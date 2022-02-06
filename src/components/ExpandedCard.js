import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";

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

const ExpandedCard = ({ onClick, img }) => {
  return (
    <>
      <Overlay />
      <MotionCard
        layoutId="expandable-card"
        onClick={onClick}
        transition={{ duration: 0.5 }}
      >
        <Card>
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
    </>
  );
};

export default ExpandedCard;

import { Star } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { AnimateSharedLayout, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import ExpandedCard from "./ExpandedCard";
import PageTransition from "./framer-motions/PageTransition";

const StyledContainer = styled(Container)`
  padding: 120px 0;
  min-height: 100vh;
  text-align: center;
`;

const ButtonWrapper = styled("div")`
  position: relative;
  width: 100%;
  height: 100%;
`;

const Glow = styled(motion.div)`
  background: linear-gradient(90deg, #ffa0ae 0%, #aacaef 75%);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  -webkit-filter: blur(15px);
  filter: blur(15px);
  border-radius: 36px;
`;

const StyledButton = styled(motion.button)`
  border: none;
  cursor: pointer;
  outline: none;
  background-color: #fff;
  color: #5e5e5e;
  padding: 20px 40px;
  margin: 10px;
  font-size: 42px;
  letter-spacing: -2px;
  font-weight: 600;
  line-height: 40px;
  border-radius: 36px;
  box-shadow: 0px 40px 80px 0px rgba(0, 0, 0, 0.05),
    inset 0px -10px 20px 0px rgba(0, 0, 0, 0.05),
    0px 10px 20px 0px rgba(0, 0, 0, 0.05);
`;

const MotionCard = styled(motion.div)`
  position: relative;
  overflow: hidden;
  width: 30%;
  height: 100%;
  cursor: pointer;
  /* margin: 0 auto; */
`;

export const RatingWrapper = styled("div")`
  position: absolute;
`;

const RatingStar = styled("button")`
  background-color: transparent;
  border: none;
  outline: none;
  cursor: pointer;
`;
const ImageWrap = styled("div")`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 130px;
  background-size: cover;
  background-color: #5e5e5e;
  transition: 2s ease all;
`;

const ImageLoader = () => {
  const [totalImages, setTotalImages] = useState(30);
  // const [images, setImages] = useState([]);
  const [show, setShow] = useState({
    with: false,
    without: false,
    both: false,
  });
  const images = useMemo(() => {
    let imageArr = new Array(totalImages).fill(undefined);
    if (show.both) {
      imageArr = imageArr.map(
        () =>
          `https://picsum.photos/seed/${Math.floor(
            Math.random() * 10000
          )}/480/360`
      );
    }

    return imageArr;
  }, [show.both, totalImages]);

  // const images = useMemo(() => {
  //   new Array(totalImages)
  //     .fill(undefined)
  //     .map(
  //       () =>
  //         `https://picsum.photos/seed/${Math.floor(
  //           Math.random() * 10000
  //         )}/720/1080`
  //     );
  // }, [totalImages]);

  const handleWithoutWorker = useCallback(
    (flg) => () => {
      setShow((prev) => ({ ...prev, both: flg }));

      const lastCount = totalImages;
      setTotalImages(0);
      setTimeout(() => {
        setTotalImages(lastCount);
      }, 300);
      // setImages(
      //   new Array(totalImages)
      //     .fill(undefined)
      //     .map(
      //       () =>
      //         `https://picsum.photos/seed/${Math.floor(
      //           Math.random() * 10000
      //         )}/480/360`
      //     )
      // );
    },
    [totalImages]
  );

  const [imageBlobs, setImageBlobs] = useState([]);
  const maxWorkers = navigator.hardwareConcurrency || 2;
  const [workers, setWorkers] = useState([]);

  useEffect(() => {
    if (workers.length === 0) {
      setWorkers(
        new Array(maxWorkers)
          .fill(undefined)
          .map(
            () =>
              new Worker(new URL("../workers/image_worker.js", import.meta.url))
          )
      );
    }

    // return () => {
    //   workers.forEach((worker) => worker.terminate());
    // };
  }, [maxWorkers, workers]);

  const imagesPerWorker = useMemo(
    () => Math.ceil(images.length / maxWorkers),
    [images.length, maxWorkers]
  );

  const revokeObjectUrls = useCallback(async (urls) => {
    if (urls.length) {
      urls.forEach((url) => {
        if (url) {
          URL.revokeObjectURL(url);
        }
      });
    }
  }, []);

  const loadImageWithWorker = useCallback(
    async (imageArr) => {
      if (window.Worker) {
        revokeObjectUrls(imageArr);
        setImageBlobs(new Array(imageArr.length).fill(undefined));

        const groupedImageArr = [];
        for (let i = 0; i < maxWorkers; i++) {
          const startIdx = i * imagesPerWorker;
          groupedImageArr.push(
            imageArr.slice(startIdx, startIdx + imagesPerWorker)
          );
        }
        console.log(groupedImageArr);
        console.log(workers);
        const imagePromises = groupedImageArr.map(
          (group, index) =>
            new Promise((resolve) => {
              const groupWorker = workers[index];

              if (groupWorker) {
                groupWorker.postMessage(group);

                groupWorker.onmessage = (e) => {
                  console.log(e.data);
                  resolve(e.data);
                };
              }
            })
        );

        const imageBlobsGroups = await Promise.all(imagePromises);

        console.log(imageBlobsGroups);

        const allImageBlobs = imageBlobsGroups.reduce(
          (result, group) => [...result, ...group],
          []
        );
        console.log(allImageBlobs);
        setImageBlobs(allImageBlobs);
      }
    },
    [imagesPerWorker, maxWorkers, workers, revokeObjectUrls]
  );

  useEffect(() => {
    if (show.both) {
      console.log("workerrrr");
      loadImageWithWorker(images);
    }
  }, [show.both, loadImageWithWorker, images]);

  // const handleWithWorker = useCallback(() => {
  //   setShow((prev) => ({ ...prev, with: true }));

  //   loadImageWithWorker(images);
  // }, [loadImageWithWorker, images]);

  // useEffect(() => {
  //   return () => {
  //     if (workers.length > 0) {
  //       workers.forEach((worker) => {
  //         worker.terminate();
  //       });
  //     }
  //   };
  // }, [workers]);

  const [btnHover, setBtnHover] = useState(false);

  return (
    <PageTransition>
      <StyledContainer maxWidth="xl">
        <StyledButton
          onClick={handleWithoutWorker(true)}
          animate={[btnHover ? "hover" : "rest"]}
          variants={buttonVariants}
          initial={false}
          whileTap="press"
          onHoverStart={() => setBtnHover(true)}
          onHoverEnd={() => setBtnHover(false)}
        >
          <ButtonWrapper>
            <Glow
              variants={glowVariants}
              transition={{
                ease: "easeOut",
                delay: 0.15,
              }}
            />
            Compare
          </ButtonWrapper>
        </StyledButton>
        <Grid container>
          <Grid item xs={6} textAlign="center">
            <h1>With Worker</h1>
            {show.both && (
              <Stack direction="row" flexWrap="wrap" justifyContent="center">
                {imageBlobs.map((imgBlob, index) => (
                  <ExpandableCard key={index} imgBlob={imgBlob} />
                ))}
              </Stack>
            )}
          </Grid>
          <Grid item xs={6} textAlign="center">
            <h1>Without Worker</h1>
            {show.both && (
              <Stack direction="row" flexWrap="wrap" justifyContent="center">
                {images.map((img, index) => (
                  <Card
                    key={index}
                    sx={{ width: "25%" }}
                    style={{ margin: "9px" }}
                  >
                    <ImageWrap
                      style={{
                        backgroundImage: `url(${img})`,
                      }}
                    />
                    {/* <CardMedia
                    component="img"
                    src={img}
                    sx={{ height: "130px", background: "#5e5e5e" }}
                  /> */}
                    <CardContent sx={{ textAlign: "left" }}>
                      <Typography gutterBottom variant="h6">
                        Item Title
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        fontSize={"12px"}
                      >
                        Lorem ipsum 머시기머시기 블라블라 어쩌구저쩌구
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            )}
            {/* <img src={"https://picsum.photos/seed/picsum/500/450"} alt="이미지" /> */}
          </Grid>
        </Grid>
      </StyledContainer>
    </PageTransition>
  );
};

export default ImageLoader;

const ExpandableCard = ({ imgBlob }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const ratingProps = { rating, setRating, hover, setHover };

  return (
    <AnimateSharedLayout>
      {isExpanded ? (
        <ExpandedCard
          onClick={() => setIsExpanded(false)}
          img={imgBlob}
          {...ratingProps}
        />
      ) : (
        <MotionCard
          layoutId="expandable-card"
          onClick={() => setIsExpanded(true)}
          transition={{ duration: 0.5 }}
        >
          <Card style={{ margin: "9px" }}>
            <RatingWrapper>
              {[...Array(5)].map((star, index) => {
                index += 1;
                return (
                  <RatingStar
                    type="button"
                    key={index}
                    className={index <= (hover || rating) ? "on" : "off"}
                    onClick={() => setRating(index)}
                    onMouseEnter={() => setHover(index)}
                    onMouseLeave={() => setHover(rating)}
                  >
                    <Star
                      sx={{
                        color:
                          index <= (hover || rating) ? "#ffdd00" : "#5e5e5e",
                      }}
                    />
                  </RatingStar>
                );
              })}
            </RatingWrapper>
            {imgBlob === undefined ? (
              <Skeleton variant="rectangular" height={130} />
            ) : (
              <ImageWrap
                style={{
                  backgroundImage: `url(${imgBlob})`,
                }}
              />
            )}
            {imgBlob === undefined ? (
              <Box sx={{ pt: 0.5 }}>
                <Skeleton />
                <Skeleton width="60%" />
              </Box>
            ) : (
              <CardContent sx={{ textAlign: "left" }}>
                <Typography gutterBottom variant="h6">
                  Item Title
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontSize={"12px"}
                >
                  Lorem ipsum 머시기머시기 블라블라 어쩌구저쩌구
                </Typography>
              </CardContent>
            )}
          </Card>
        </MotionCard>
      )}
    </AnimateSharedLayout>
  );
};

const buttonVariants = {
  rest: {
    transition: { duration: 0.7 },
  },
  hover: {
    scale: 1.2,
    y: -8,
    transition: {
      duration: 0.3,
      yoyo: Infinity,
    },
  },
  press: { scale: 1.1 },
};

const glowVariants = {
  rest: {
    // scale: 1.05,
    opacity: 0,
  },
  hover: {
    opacity: 0.8,
  },
};

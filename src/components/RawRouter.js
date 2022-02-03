import { styled } from "@mui/material/styles";
// import { AnimatePresence } from "framer-motion";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./Header";
import ImageLoader from "./ImageLoader";
import StarredCounter from "./StarredCounter";

const Container = styled("div")`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  font-family: "Inter", Arial;
  background: #f4f5fa;
`;
const RawRouter = () => {
  return (
    <BrowserRouter>
      <Container>
      <Header />
        {/* <AnimatePresence exitBeforeEnter initial={false}> */}
          <Routes>
            <Route index element={<></>} />
            <Route path="starred-counter" element={<StarredCounter />} />
            <Route path="image-loader" element={<ImageLoader />} />
          </Routes>
        {/* </AnimatePresence> */}
      </Container>
    </BrowserRouter>
  );
};

export default RawRouter;

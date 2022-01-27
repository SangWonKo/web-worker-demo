import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Home";

const RawRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route index element={Home}/>
                <Route path="starred-counter" element={Home}/>
                <Route path="image-loader" element={Home}/>
            </Routes>
        </BrowserRouter>
    );
};

export default RawRouter;
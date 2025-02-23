import { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ColorTest from "./pages/ColorTest";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";

function App() {
    const [count, setCount] = useState(0);

    return (
        <>
            <Router>
                <Routes>
                    <Route path="/" element={<MainLayout />}>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/colors" element={<ColorTest />} />
                    </Route>
                </Routes>
            </Router>
        </>
    );
}

export default App;

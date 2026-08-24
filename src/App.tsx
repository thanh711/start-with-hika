import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Katakana from "./pages/Katakana";
import Hiragana from "./pages/Hiragana";
import Learn from "./pages/Learn";
import Vocab from "./pages/Vocab";
import Setting from "./pages/Setting";
import "./styles/common.css";
import "./App.css";
import Home from "./pages/Home";
import Test from "./pages/Test";

export default function App() {
  return (
    <BrowserRouter basename="/start-with-hika">
      <div className="app-layout">
        <Sidebar />
        <div className="main-content">
          <Routes>
            {/* Mở app /start-with-hika/ -> vào learn luôn */}
            <Route path="/" element={<Navigate to="/vocab" replace />} />
            <Route path="/home" element={<Home />} />
            <Route path="/learn" element={<Learn />} />
          
<Route path="/test" element={<Test />} />
            <Route path="/vocab" element={<Vocab />} />
            <Route path="/hiragana" element={<Hiragana />} />
            <Route path="/kana" element={<Katakana />} />

            <Route path="/setting" element={<Setting />} />
            {/* Tất cả route lạ -> về home */}
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
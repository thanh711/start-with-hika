import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Katakana from "./pages/Katakana";
import Hiragana from "./pages/Hiragana";
import Learn from "./pages/Learn";
import Vocab from "./pages/Vocab";
import "./styles/common.css";
import "./App.css";

function Home() { return <div style={{padding: 20, color: 'white'}}>Trang chủ - chọn bảng chữ bên menu</div>; }
function Setting() { return <div style={{padding: 20, color: 'white'}}>Cài đặt</div>; }

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/vocab" element={<Vocab />} />
            <Route path="/hiragana" element={<Hiragana />} />
            <Route path="/kana" element={<Katakana />} />
            <Route path="/setting" element={<Setting />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Katakana from "./pages/Katakana";
import Hiragana from "./pages/Hiragana";
import "./App.css";

function Home() { return <div style={{padding: 20, color: 'white'}}>Trang chủ - chọn bảng chữ bên menu</div>; }
function Learn() { return <div style={{padding: 20, color: 'white'}}>Trang học tập</div>; }
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
            <Route path="/hiragana" element={<Hiragana />} />
            <Route path="/kana" element={<Katakana />} />
            <Route path="/setting" element={<Setting />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
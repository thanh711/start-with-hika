import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import "./App.css"; // nhớ import
import Katakana from "./pages/Katakana";
function App() {
  return (
    <BrowserRouter>
      <Sidebar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<h1>Trang chủ</h1>} />
          <Route path="/learn" element={<h1>Trang học</h1>} />
          <Route path="/kana" element={<Katakana />} />
          <Route path="/setting" element={<h1>Cài đặt</h1>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
export default App;
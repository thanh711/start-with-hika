import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";

type MenuItem = { path: string; label: string; shortLabel: string };

const menu: MenuItem[] = [
  { path: "/home", label: "🏠 Trang chủ", shortLabel: "Trang chủ" },
  { path: "/learn", label: "📚 Học chữ", shortLabel: "Học chữ" },
  { path: "/vocab", label: "📝 Từ vựng", shortLabel: "Từ vựng" },
  { path: "/hiragana", label: "🅱 Hiragana", shortLabel: "Hiragana" },
  { path: "/kana", label: "🅰 Katakana", shortLabel: "Katakana" },
  { path: "/test", label: "🧪 Test 20 câu", shortLabel: "Test 20 câu" },
  { path: "/setting", label: "⚙ Cài đặt", shortLabel: "Cài đặt" },
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  
  // Fix: với basename="/start-with-hika" thì pathname đã strip basename rồi, nên so sánh trực tiếp
  const currentPage = menu.find(m => location.pathname === m.path || location.pathname.startsWith(m.path + "/"))?.shortLabel || "Kana App";

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <header className="mobile-header">
        <button className="hamburger" onClick={() => setOpen(!open)}>{open ? "✕" : "☰"}</button>
        <span className="header-title">{currentPage}</span>
      </header>
      {open && <div className="overlay" onClick={() => setOpen(false)}></div>}
      <div className={`sidebar ${open ? "open" : ""}`}>
        <div className="sidebar-logo">
          <span>ようこそ</span>
          <b>Kana</b>
        </div>
        <nav>
          {menu.map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={isActive(item.path) ? "active" : ""} 
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="sidebar-foot">v1.0 • /start-with-hika/</div>
      </div>
    </>
  );
}
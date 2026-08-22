import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";

type MenuItem = { path: string; label: string; shortLabel: string };

const menu: MenuItem[] = [
  { path: "/home", label: "🏠 Trang chủ", shortLabel: "Trang chủ" },
  { path: "/learn", label: "📚 Học chữ", shortLabel: "Học chữ" },
  { path: "/vocab", label: "📝 Từ vựng", shortLabel: "Từ vựng" },
  { path: "/hiragana", label: "🅱️ Hiragana", shortLabel: "Hiragana" },
  { path: "/kana", label: "🅰️ Katakana", shortLabel: "Katakana" },
  { path: "/setting", label: "⚙️ Cài đặt", shortLabel: "Cài đặt" },
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const currentPage = menu.find(m => m.path === location.pathname)?.shortLabel || "Kana App";

  return (
    <>
      <header className="mobile-header">
        <button className="hamburger" onClick={() => setOpen(!open)}>{open? "✕" : "☰"}</button>
        <span className="header-title">{currentPage}</span>
      </header>
      {open && <div className="overlay" onClick={() => setOpen(false)}></div>}
      <div className={`sidebar ${open? "open" : ""}`}>
        <nav>
          {menu.map((item) => (
            <Link key={item.path} to={item.path} className={location.pathname === item.path? "active" : ""} onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
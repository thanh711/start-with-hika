import { useState, useEffect } from "react";
import "../styles/common.css";
import "./Setting.css";

type SettingKey = "sound" | "autoNext" | "showHint";
type PhoneRow = { stt: number; value: string; };

const phoneData: PhoneRow[] = [
  { stt: 1, value: "0961592142" },
  { stt: 2, value: "0389495031" },
];

export default function Setting() {
  const [settings, setSettings] = useState<Record<SettingKey, boolean>>({
    sound: true,
    autoNext: true,
    showHint: true,
  });
  const [showPhone, setShowPhone] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("kana-settings");
    if (saved) setSettings(JSON.parse(saved));
  }, []);

  const toggle = (key: SettingKey) => {
    const next = {...settings, [key]:!settings[key] };
    setSettings(next);
    localStorage.setItem("kana-settings", JSON.stringify(next));
  };

  const resetProgress = () => {
    if (confirm("Xóa toàn bộ tiến độ học?")) {
      localStorage.removeItem("kana-progress");
      localStorage.removeItem("kana-settings");
      alert("Đã reset!");
      setSettings({ sound: true, autoNext: true, showHint: true });
    }
  };

  return (
    <div className="setting-page">
      <div className="page-top-title">
        <div>
          <h1>設定 <span style={{color:'#a78bfa'}}>Setting</span></h1>
          <p>Cài đặt học tập và dữ liệu.</p>
        </div>
      </div>

      <div className="setting-section">
        <div className="section-header">
          <h2><span className="section-num">1</span> Học tập</h2>
        </div>

        <div className="kana-card setting-card">
          <div className="setting-row">
            <div>
              <b>Âm thanh quiz</b>
              <p>Bật/tắt âm khi đúng/sai</p>
            </div>
            <label className="switch">
              <input type="checkbox" checked={settings.sound} onChange={() => toggle("sound")} />
              <span className="slider"></span>
            </label>
          </div>

          <div className="setting-row">
            <div>
              <b>Tự chuyển câu</b>
              <p>Tự next sau khi trả lời đúng 0.8s</p>
            </div>
            <label className="switch">
              <input type="checkbox" checked={settings.autoNext} onChange={() => toggle("autoNext")} />
              <span className="slider"></span>
            </label>
          </div>

          <div className="setting-row">
            <div>
              <b>Hiện gợi ý</b>
              <p>Hiện placeholder "gõ hiragana/katakana..."</p>
            </div>
            <label className="switch">
              <input type="checkbox" checked={settings.showHint} onChange={() => toggle("showHint")} />
              <span className="slider"></span>
            </label>
          </div>
        </div>
      </div>

      <div className="setting-section">
        <div className="section-header">
          <h2><span className="section-num">2</span> Hiển thị</h2>
        </div>
        <div className="explain-box">
          <h4>Theme</h4>
          <ul>
            <li>Dark only: #0f1219 / card #1c2333 / border #2a344b</li>
            <li>Chữ chính #e2e8f0, chữ mờ #94a3b8</li>
            <li>Không hỗ trợ light mode để tập trung học</li>
          </ul>
        </div>
      </div>

      <div className="setting-section">
        <div className="section-header">
          <h2><span className="section-num">3</span> Dữ liệu</h2>
        </div>
        <div className="kana-card setting-card">
          <div className="setting-row">
            <div>
              <b>Reset tiến độ</b>
              <p>Xóa localStorage, về mặc định</p>
            </div>
            <button className="setting-danger-btn" onClick={resetProgress}>Reset</button>
          </div>

          {/* CLICK VÀO DÒNG NÀY ĐỂ SHOW DATA MỚI */}
          <div
            className="setting-info"
            onClick={() => setShowPhone(!showPhone)}
            style={{ cursor: "pointer", userSelect: "none" }}
            title="Click để xem SĐT"
          >
            Version 1.0 • Base: /start-with-hika/ • CSS thuần, không module {showPhone? "▲" : "▼"}
          </div>

          {showPhone && (
            <div style={{ marginTop: 12, borderTop: "1px solid #2a344b", paddingTop: 12 }}>
              <table className="note-table" style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th style={{ width: 60 }}>stt</th>
                    <th>value</th>
                  </tr>
                </thead>
                <tbody>
                  {phoneData.map((r) => (
                    <tr key={r.stt}>
                      <td>{r.stt}</td>
                      <td style={{ fontWeight: 700, color: "#e2e8f0", letterSpacing: 0.5 }}>{r.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
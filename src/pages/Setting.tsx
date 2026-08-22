import { useState, useEffect } from "react";
import "../styles/common.css";
import "./Setting.css";

type SettingKey = "sound" | "autoNext" | "showHint";

export default function Setting() {
  const [settings, setSettings] = useState<Record<SettingKey, boolean>>({
    sound: true,
    autoNext: true,
    showHint: true,
  });

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
          <div className="setting-info">
            Version 1.0 • Base: /start-with-hika/ • CSS thuần, không module
          </div>
        </div>
      </div>
    </div>
  );
}
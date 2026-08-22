import "../styles/common.css";
import "./Home.css";

export default function Home() {
  return (
    <div className="home-page">
      <div className="page-top-title">
        <div>
          <h1>ようこそ <span className="home-accent">Kana</span></h1>
          <p>App học Hiragana / Katakana / Từ vựng tối giản, dark theme.</p>
        </div>
      </div>

      <div className="kana-card home-intro-card">
        <h3>Kana Learning App là gì?</h3>
        <p>
          App giúp bạn học 46 âm Hiragana, 46 âm Katakana, âm ghép Youon, trường âm Chouon,
          ngắt âm Sokuon và 25 từ vựng cơ bản. Tất cả offline, giao diện tối #0f1219 tập trung vào chữ.
        </p>

        <div className="home-mini-grid">
          <div className="home-mini-item">
            <span className="dot pink"></span>
            <b>Hiragana</b> - ひらがな + Dakuon, Handakuon
          </div>
          <div className="home-mini-item">
            <span className="dot blue"></span>
            <b>Katakana</b> - カタカナ + Chouon ー
          </div>
          <div className="home-mini-item">
            <span className="dot mix"></span>
            <b>Quiz 5 mode</b> - hira, kata, mix, hard, asian
          </div>
          <div className="home-mini-item">
            <span className="dot vocab"></span>
            <b>Vocab</b> - 25 từ, ẩn romaji •••• tap để hiện
          </div>
        </div>
      </div>

      <div className="explain-box">
        <h4>Cách app hoạt động</h4>
        <ul>
          <li>Xem bảng chữ ở 2 trang Hiragana / Katakana, dùng switch để ẩn/hiện Youon, Chouon, Sokuon.</li>
          <li>Học ở trang Learn, gõ tay ở hard/asian để nhớ lâu hơn.</li>
          <li>Không tracking, không quảng cáo, CSS thuần chỉ 3 màu chính.</li>
        </ul>
      </div>

      <p className="home-foot">Made for mobile first • Dark only • v1.0</p>
    </div>
  );
}
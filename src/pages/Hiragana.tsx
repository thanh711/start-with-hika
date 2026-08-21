import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Hiragana.css";

type Cell = { kana: string; roma: string };
type Row = { id: string; base: (Cell | null)[]; dakuon?: (Cell | null)[]; handakuon?: (Cell | null)[] };
type YouonRow = { id: string; base: Cell[]; dakuon?: Cell[]; handakuon?: Cell[]; hasColor?: boolean };

const ROWS: Row[] = [
  { id: "a", base: [{kana:"あ",roma:"a"}, {kana:"い",roma:"i"}, {kana:"う",roma:"u"}, {kana:"え",roma:"e"}, {kana:"お",roma:"o"}] },
  { id: "ka", base: [{kana:"か",roma:"ka"}, {kana:"き",roma:"ki"}, {kana:"く",roma:"ku"}, {kana:"け",roma:"ke"}, {kana:"こ",roma:"ko"}], dakuon: [{kana:"が",roma:"ga"}, {kana:"ぎ",roma:"gi"}, {kana:"ぐ",roma:"gu"}, {kana:"げ",roma:"ge"}, {kana:"ご",roma:"go"}] },
  { id: "sa", base: [{kana:"さ",roma:"sa"}, {kana:"し",roma:"shi"}, {kana:"す",roma:"su"}, {kana:"せ",roma:"se"}, {kana:"そ",roma:"so"}], dakuon: [{kana:"ざ",roma:"za"}, {kana:"じ",roma:"ji"}, {kana:"ず",roma:"zu"}, {kana:"ぜ",roma:"ze"}, {kana:"ぞ",roma:"zo"}] },
  { id: "ta", base: [{kana:"た",roma:"ta"}, {kana:"ち",roma:"chi"}, {kana:"つ",roma:"tsu"}, {kana:"て",roma:"te"}, {kana:"と",roma:"to"}], dakuon: [{kana:"だ",roma:"da"}, {kana:"ぢ",roma:"ji"}, {kana:"づ",roma:"zu"}, {kana:"で",roma:"de"}, {kana:"ど",roma:"do"}] },
  { id: "na", base: [{kana:"な",roma:"na"}, {kana:"に",roma:"ni"}, {kana:"ぬ",roma:"nu"}, {kana:"ね",roma:"ne"}, {kana:"の",roma:"no"}] },
  { id: "ha", base: [{kana:"は",roma:"ha"}, {kana:"ひ",roma:"hi"}, {kana:"ふ",roma:"fu"}, {kana:"へ",roma:"he"}, {kana:"ほ",roma:"ho"}], dakuon: [{kana:"ば",roma:"ba"}, {kana:"び",roma:"bi"}, {kana:"ぶ",roma:"bu"}, {kana:"べ",roma:"be"}, {kana:"ぼ",roma:"bo"}], handakuon: [{kana:"ぱ",roma:"pa"}, {kana:"ぴ",roma:"pi"}, {kana:"ぷ",roma:"pu"}, {kana:"ぺ",roma:"pe"}, {kana:"ぽ",roma:"po"}] },
  { id: "ma", base: [{kana:"ま",roma:"ma"}, {kana:"み",roma:"mi"}, {kana:"む",roma:"mu"}, {kana:"め",roma:"me"}, {kana:"も",roma:"mo"}] },
  { id: "ya", base: [{kana:"や",roma:"ya"}, null, {kana:"ゆ",roma:"yu"}, null, {kana:"よ",roma:"yo"}] },
  { id: "ra", base: [{kana:"ら",roma:"ra"}, {kana:"り",roma:"ri"}, {kana:"る",roma:"ru"}, {kana:"れ",roma:"re"}, {kana:"ろ",roma:"ro"}] },
  { id: "wa", base: [{kana:"わ",roma:"wa"}, null, null, null, {kana:"を",roma:"wo"}] },
  { id: "n", base: [{kana:"ん",roma:"n"}, null, null, null, null] },
];

const YOUON_ROWS: YouonRow[] = [
  { id: "ki", base: [{kana:"きゃ",roma:"kya"}, {kana:"きゅ",roma:"kyu"}, {kana:"きょ",roma:"kyo"}], dakuon: [{kana:"ぎゃ",roma:"gya"}, {kana:"ぎゅ",roma:"gyu"}, {kana:"ぎょ",roma:"gyo"}], hasColor: true },
  { id: "shi", base: [{kana:"しゃ",roma:"sha"}, {kana:"しゅ",roma:"shu"}, {kana:"しょ",roma:"sho"}], dakuon: [{kana:"じゃ",roma:"ja"}, {kana:"じゅ",roma:"ju"}, {kana:"じょ",roma:"jo"}], hasColor: true },
  { id: "chi", base: [{kana:"ちゃ",roma:"cha"}, {kana:"ちゅ",roma:"chu"}, {kana:"ちょ",roma:"cho"}], dakuon: [{kana:"ぢゃ",roma:"ja"}, {kana:"ぢゅ",roma:"ju"}, {kana:"ぢょ",roma:"jo"}], hasColor: true },
  { id: "ni", base: [{kana:"にゃ",roma:"nya"}, {kana:"にゅ",roma:"nyu"}, {kana:"にょ",roma:"nyo"}] },
  { id: "hi", base: [{kana:"ひゃ",roma:"hya"}, {kana:"ひゅ",roma:"hyu"}, {kana:"ひょ",roma:"hyo"}], dakuon: [{kana:"びゃ",roma:"bya"}, {kana:"びゅ",roma:"byu"}, {kana:"びょ",roma:"byo"}], handakuon: [{kana:"ぴゃ",roma:"pya"}, {kana:"ぴゅ",roma:"pyu"}, {kana:"ぴょ",roma:"pyo"}], hasColor: true },
  { id: "mi", base: [{kana:"みゃ",roma:"mya"}, {kana:"みゅ",roma:"myu"}, {kana:"みょ",roma:"myo"}] },
  { id: "ri", base: [{kana:"りゃ",roma:"rya"}, {kana:"りゅ",roma:"ryu"}, {kana:"りょ",roma:"ryo"}] },
];

export default function Hiragana() {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [expandedYouon, setExpandedYouon] = useState<Set<string>>(new Set());
  const [showYouon, setShowYouon] = useState(true);
  const [showChouon, setShowChouon] = useState(true);
  const [showSokuon, setShowSokuon] = useState(true);

  const toggle = (id: string) => {
    const s = new Set(expanded);
    s.has(id) ? s.delete(id) : s.add(id);
    setExpanded(s);
  };
  const toggleYouon = (id: string) => {
    const s = new Set(expandedYouon);
    s.has(id) ? s.delete(id) : s.add(id);
    setExpandedYouon(s);
  };

  return (
    <div className="kana-container dark">
      {/* TITLE TỔNG */}
      <div className="page-top-title">
        <h1>ひらがな</h1>
        <p>Hiragana - Bảng chữ mềm • 46 âm cơ bản + âm ghép, trường âm, ngắt âm</p>
      </div>

      {/* 1. BẢNG CHỮ CÁI */}
      <div className="section-header">
        <div className="section-title-left">
          <span className="num">1</span>
          <h2>Bảng chữ cái</h2>
        </div>
        <button className="learn-btn" onClick={() => navigate('/learn?mode=hiragana')}>Học</button>
      </div>

      <div className="kana-table">
        {ROWS.map(row => {
          const hasDaku = !!(row.dakuon || row.handakuon);
          const isOpen = expanded.has(row.id);
          return (
            <div key={row.id} className="row-group">
              <div className={`kana-row ${hasDaku ? 'has-daku' : ''} ${isOpen ? 'open' : ''}`} onClick={() => hasDaku && toggle(row.id)}>
                {row.base.map((cell, i) => cell ? <div key={i} className="kana-cell"><b>{cell.kana}</b><small>{cell.roma}</small></div> : <div key={i} className="kana-cell empty"></div>)}
              </div>
              {isOpen && row.dakuon && <div className="kana-row dakuon-row">{row.dakuon.map((c,i) => c ? <div key={i} className="kana-cell daku"><b>{c.kana}</b><small>{c.roma}</small></div> : <div key={i} className="kana-cell empty"></div>)}</div>}
              {isOpen && row.handakuon && <div className="kana-row handakuon-row">{row.handakuon.map((c,i) => c ? <div key={i} className="kana-cell handaku"><b>{c.kana}</b><small>{c.roma}</small></div> : <div key={i} className="kana-cell empty"></div>)}</div>}
            </div>
          );
        })}
      </div>

      {/* 2. ÂM GHÉP */}
      <div className="section-header">
        <div className="section-title-left">
          <span className="num">2</span>
          <h2>Âm ghép Youon</h2>
        </div>
        <label className="switch">
          <input type="checkbox" checked={showYouon} onChange={() => setShowYouon(!showYouon)} />
          <span className="slider"></span>
        </label>
      </div>
      {showYouon && (
        <>
          <div className="explain-box">
            <p><b>Cách tạo:</b> Cột <code>i</code> + やゆよ nhỏ (ゃゅょ). Ví dụ: き + ゃ = きゃ (kya)</p>
            <p className="hint-small">Hàng xanh nhạt có âm đục / bán đục, bấm để xem.</p>
          </div>
          <div className="youon-grid">
            {YOUON_ROWS.map(row => {
              const hasDaku = !!(row.dakuon || row.handakuon);
              const isOpen = expandedYouon.has(row.id);
              return (
                <div key={row.id} className="row-group">
                  <div className={`youon-main ${row.hasColor ? 'has-daku' : ''} ${isOpen ? 'open' : ''}`} onClick={() => hasDaku && toggleYouon(row.id)}>
                    {row.base.map(c => <div key={c.kana} className="kana-cell youon"><b>{c.kana}</b><small>{c.roma}</small></div>)}
                    {hasDaku && <span className="youon-arrow">{isOpen ? '▲' : '▼'}</span>}
                  </div>
                  {isOpen && row.dakuon && <div className="youon-main dakuon-row">{row.dakuon.map(c => <div key={c.kana} className="kana-cell daku"><b>{c.kana}</b><small>{c.roma}</small></div>)}</div>}
                  {isOpen && row.handakuon && <div className="youon-main handakuon-row">{row.handakuon.map(c => <div key={c.kana} className="kana-cell handaku"><b>{c.kana}</b><small>{c.roma}</small></div>)}</div>}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* 3. TRƯỜNG ÂM */}
      <div className="section-header">
        <div className="section-title-left">
          <span className="num">3</span>
          <h2>Trường âm Chouon</h2>
        </div>
        <label className="switch">
          <input type="checkbox" checked={showChouon} onChange={() => setShowChouon(!showChouon)} />
          <span className="slider"></span>
        </label>
      </div>
      {showChouon && (
        <div className="explain-box">
          <p>Hiragana <b>KHÔNG dùng ー</b> như Katakana. Mà kéo dài bằng cách thêm nguyên âm.</p>
          <div className="chouon-table">
            <div className="chouon-row"><b>Cột あ (a)</b><span>Thêm あ → かあさん (kaasan - mẹ)</span></div>
            <div className="chouon-row"><b>Cột い (i)</b><span>Thêm い → おにいさん (oniisan - anh trai)</span></div>
            <div className="chouon-row"><b>Cột う (u)</b><span>Thêm う → くうき (kuuki - không khí)</span></div>
            <div className="chouon-row"><b>Cột え (e)</b><span>Thêm い hoặc え → せんせい (sensei), おねえさん (oneesan)</span></div>
            <div className="chouon-row"><b>Cột お (o)</b><span>Thêm う hoặc お → ありがとう (arigatou), おおきい (ookii)</span></div>
          </div>
          <p className="note">Mẹo: 90% hàng え thêm い, hàng お thêm う.</p>
        </div>
      )}

      {/* 4. NGẮT ÂM */}
      <div className="section-header">
        <div className="section-title-left">
          <span className="num">4</span>
          <h2>Ngắt âm Sokuon</h2>
        </div>
        <label className="switch">
          <input type="checkbox" checked={showSokuon} onChange={() => setShowSokuon(!showSokuon)} />
          <span className="slider"></span>
        </label>
      </div>
      {showSokuon && (
        <div className="explain-box">
          <p>Dùng <code>っ</code> nhỏ, tạo ngắt, gấp đôi phụ âm sau.</p>
          <div className="example-list">
            <div><b>きって</b><span>kitte - tem</span></div>
            <div><b>がっこう</b><span>gakkou - trường học</span></div>
            <div><b>いっしょ</b><span>issho - cùng nhau</span></div>
          </div>
        </div>
      )}
    </div>
  );
}
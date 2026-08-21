import { useState } from "react";
import "./Katakana.css";

type Cell = { kana: string; roma: string };
type Row = { id: string; base: (Cell | null)[]; dakuon?: (Cell | null)[]; handakuon?: (Cell | null)[] };
type YouonRow = { id: string; base: Cell[]; dakuon?: Cell[]; handakuon?: Cell[]; hasColor?: boolean };

const ROWS: Row[] = [
  { id: "a", base: [{kana:"ア",roma:"a"}, {kana:"イ",roma:"i"}, {kana:"ウ",roma:"u"}, {kana:"エ",roma:"e"}, {kana:"オ",roma:"o"}] },
  { id: "ka", base: [{kana:"カ",roma:"ka"}, {kana:"キ",roma:"ki"}, {kana:"ク",roma:"ku"}, {kana:"ケ",roma:"ke"}, {kana:"コ",roma:"ko"}], dakuon: [{kana:"ガ",roma:"ga"}, {kana:"ギ",roma:"gi"}, {kana:"グ",roma:"gu"}, {kana:"ゲ",roma:"ge"}, {kana:"ゴ",roma:"go"}] },
  { id: "sa", base: [{kana:"サ",roma:"sa"}, {kana:"シ",roma:"shi"}, {kana:"ス",roma:"su"}, {kana:"セ",roma:"se"}, {kana:"ソ",roma:"so"}], dakuon: [{kana:"ザ",roma:"za"}, {kana:"ジ",roma:"ji"}, {kana:"ズ",roma:"zu"}, {kana:"ゼ",roma:"ze"}, {kana:"ゾ",roma:"zo"}] },
  { id: "ta", base: [{kana:"タ",roma:"ta"}, {kana:"チ",roma:"chi"}, {kana:"ツ",roma:"tsu"}, {kana:"テ",roma:"te"}, {kana:"ト",roma:"to"}], dakuon: [{kana:"ダ",roma:"da"}, {kana:"ヂ",roma:"ji"}, {kana:"ヅ",roma:"zu"}, {kana:"デ",roma:"de"}, {kana:"ド",roma:"do"}] },
  { id: "na", base: [{kana:"ナ",roma:"na"}, {kana:"ニ",roma:"ni"}, {kana:"ヌ",roma:"nu"}, {kana:"ネ",roma:"ne"}, {kana:"ノ",roma:"no"}] },
  { id: "ha", base: [{kana:"ハ",roma:"ha"}, {kana:"ヒ",roma:"hi"}, {kana:"フ",roma:"fu"}, {kana:"ヘ",roma:"he"}, {kana:"ホ",roma:"ho"}], dakuon: [{kana:"バ",roma:"ba"}, {kana:"ビ",roma:"bi"}, {kana:"ブ",roma:"bu"}, {kana:"ベ",roma:"be"}, {kana:"ボ",roma:"bo"}], handakuon: [{kana:"パ",roma:"pa"}, {kana:"ピ",roma:"pi"}, {kana:"プ",roma:"pu"}, {kana:"ペ",roma:"pe"}, {kana:"ポ",roma:"po"}] },
  { id: "ma", base: [{kana:"マ",roma:"ma"}, {kana:"ミ",roma:"mi"}, {kana:"ム",roma:"mu"}, {kana:"メ",roma:"me"}, {kana:"モ",roma:"mo"}] },
  { id: "ya", base: [{kana:"ヤ",roma:"ya"}, null, {kana:"ユ",roma:"yu"}, null, {kana:"ヨ",roma:"yo"}] },
  { id: "ra", base: [{kana:"ラ",roma:"ra"}, {kana:"リ",roma:"ri"}, {kana:"ル",roma:"ru"}, {kana:"レ",roma:"re"}, {kana:"ロ",roma:"ro"}] },
  { id: "wa", base: [{kana:"ワ",roma:"wa"}, null, null, null, {kana:"ヲ",roma:"wo"}] },
  { id: "n", base: [{kana:"ン",roma:"n"}, null, null, null, null] },
];

const YOUON_ROWS: YouonRow[] = [
  { id: "ki", base: [{kana:"キャ",roma:"kya"}, {kana:"キュ",roma:"kyu"}, {kana:"キョ",roma:"kyo"}], dakuon: [{kana:"ギャ",roma:"gya"}, {kana:"ギュ",roma:"gyu"}, {kana:"ギョ",roma:"gyo"}], hasColor: true },
  { id: "shi", base: [{kana:"シャ",roma:"sha"}, {kana:"シュ",roma:"shu"}, {kana:"ショ",roma:"sho"}], dakuon: [{kana:"ジャ",roma:"ja"}, {kana:"ジュ",roma:"ju"}, {kana:"ジョ",roma:"jo"}], hasColor: true },
  { id: "chi", base: [{kana:"チャ",roma:"cha"}, {kana:"チュ",roma:"chu"}, {kana:"チョ",roma:"cho"}], dakuon: [{kana:"ヂャ",roma:"ja"}, {kana:"ヂュ",roma:"ju"}, {kana:"ヂョ",roma:"jo"}], hasColor: true },
  { id: "ni", base: [{kana:"ニャ",roma:"nya"}, {kana:"ニュ",roma:"nyu"}, {kana:"ニョ",roma:"nyo"}] },
  { id: "hi", base: [{kana:"ヒャ",roma:"hya"}, {kana:"ヒュ",roma:"hyu"}, {kana:"ヒョ",roma:"hyo"}], dakuon: [{kana:"ビャ",roma:"bya"}, {kana:"ビュ",roma:"byu"}, {kana:"ビョ",roma:"byo"}], handakuon: [{kana:"ピャ",roma:"pya"}, {kana:"ピュ",roma:"pyu"}, {kana:"ピョ",roma:"pyo"}], hasColor: true },
  { id: "mi", base: [{kana:"ミャ",roma:"mya"}, {kana:"ミュ",roma:"myu"}, {kana:"ミョ",roma:"myo"}] },
  { id: "ri", base: [{kana:"リャ",roma:"rya"}, {kana:"リュ",roma:"ryu"}, {kana:"リョ",roma:"ryo"}] },
];

export default function Katakana() {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [expandedYouon, setExpandedYouon] = useState<Set<string>>(new Set());

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
      <h1>カタカナ 46</h1>
      <div className="kana-table">
        {ROWS.map(row => {
          const hasDaku = !!(row.dakuon || row.handakuon);
          const isOpen = expanded.has(row.id);
          return (
            <div key={row.id} className="row-group">
              <div className={`kana-row ${hasDaku ? 'has-daku' : ''} ${isOpen ? 'open' : ''}`} onClick={() => hasDaku && toggle(row.id)}>
                {row.base.map((cell, i) => cell ? (
                  <div key={i} className="kana-cell"><b>{cell.kana}</b><small>{cell.roma}</small></div>
                ) : (
                  <div key={i} className="kana-cell empty"></div>
                ))}
              </div>
              {isOpen && row.dakuon && (
                <div className="kana-row dakuon-row">
                  {row.dakuon.map((c, i) => c ? <div key={i} className="kana-cell daku"><b>{c.kana}</b><small>{c.roma}</small></div> : <div key={i} className="kana-cell empty"></div>)}
                </div>
              )}
              {isOpen && row.handakuon && (
                <div className="kana-row handakuon-row">
                  {row.handakuon.map((c, i) => c ? <div key={i} className="kana-cell handaku"><b>{c.kana}</b><small>{c.roma}</small></div> : <div key={i} className="kana-cell empty"></div>)}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <h2 className="section-title">1. Âm ghép Youon (拗音)</h2>
      <div className="explain-box">
        <p><b>Cách tạo:</b> Cột <code>i</code> + ヤユヨ nhỏ (ャュョ) → Bỏ <code>i</code>. Ví dụ: キ + ャ = キャ (kya)</p>
        <p className="hint-small">Hàng màu xanh nhạt có âm đục / bán đục, bấm để xem.</p>
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
              {isOpen && row.dakuon && (
                <div className="youon-main dakuon-row">
                  {row.dakuon.map(c => <div key={c.kana} className="kana-cell daku"><b>{c.kana}</b><small>{c.roma}</small></div>)}
                </div>
              )}
              {isOpen && row.handakuon && (
                <div className="youon-main handakuon-row">
                  {row.handakuon.map(c => <div key={c.kana} className="kana-cell handaku"><b>{c.kana}</b><small>{c.roma}</small></div>)}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <h2 className="section-title">2. Trường âm Chouon (長音) - ー</h2>
      <div className="explain-box">
        <p>Dấu <code>ー</code> kéo dài âm trước nó. Trong Katakana dùng cho tất cả các hàng.</p>
        <div className="example-list"><div><b>コーヒー</b><span>koohii - cà phê</span></div><div><b>ケーキ</b><span>keeki - bánh kem</span></div></div>
      </div>

      <h2 className="section-title">3. Ngắt âm Sokuon (促音) - ッ</h2>
      <div className="explain-box">
        <p>Chữ <code>ッ</code> nhỏ tạo ngắt, gấp đôi phụ âm sau.</p>
        <div className="example-list"><div><b>ベッド</b><span>beddo - giường</span></div><div><b>チケット</b><span>chiketto - vé</span></div></div>
      </div>
    </div>
  );
}
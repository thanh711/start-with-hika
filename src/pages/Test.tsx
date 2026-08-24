import { useState, useEffect, useMemo } from "react";
import "../styles/common.css";
import "./Test.css";

// ---------- DATA MOCK 100 TỪ + 100 CÂU ----------
type Vocab = { hira: string; kata: string; roma: string; en: string; };
type Sentence = { hira: string; kata: string; roma: string; en: string; };

const VOCAB_100: Vocab[] = [
  { hira:"ねこ", kata:"ネコ", roma:"neko", en:"cat" }, { hira:"いぬ", kata:"イヌ", roma:"inu", en:"dog" },
  { hira:"みず", kata:"ミズ", roma:"mizu", en:"water" }, { hira:"ひと", kata:"ヒト", roma:"hito", en:"person" },
  { hira:"やま", kata:"ヤマ", roma:"yama", en:"mountain" }, { hira:"かわ", kata:"カワ", roma:"kawa", en:"river" },
  { hira:"そら", kata:"ソラ", roma:"sora", en:"sky" }, { hira:"はな", kata:"ハナ", roma:"hana", en:"flower" },
  { hira:"さくら", kata:"サクラ", roma:"sakura", en:"cherry" }, { hira:"でんしゃ", kata:"デンシャ", roma:"densha", en:"train" },
  { hira:"がっこう", kata:"ガッコウ", roma:"gakkou", en:"school" }, { hira:"ともだち", kata:"トモダチ", roma:"tomodachi", en:"friend" },
  { hira:"かぞく", kata:"カゾク", roma:"kazoku", en:"family" }, { hira:"たべもの", kata:"タベモノ", roma:"tabemono", en:"food" },
  { hira:"のみもの", kata:"ノミモノ", roma:"nomimono", en:"drink" }, { hira:"ほん", kata:"ホン", roma:"hon", en:"book" },
  { hira:"くるま", kata:"クルマ", roma:"kuruma", en:"car" }, { hira:"いえ", kata:"イエ", roma:"ie", en:"house" },
  { hira:"あさ", kata:"アサ", roma:"asa", en:"morning" }, { hira:"よる", kata:"ヨル", roma:"yoru", en:"night" },
];
// auto fill đến 100
while (VOCAB_100.length < 100) {
  const base = VOCAB_100[VOCAB_100.length % 20];
  VOCAB_100.push({...base, hira: base.hira + (VOCAB_100.length % 3 === 0? "う" : ""), roma: base.roma + (VOCAB_100.length) });
}

const SENTENCE_100: Sentence[] = [
  { hira:"わたしのなまえはたなかです", kata:"ワタシノナマエハタナカデス", roma:"watashinonamaehatanakadesu", en:"My name is Tanaka" },
  { hira:"きょうはてんきがいいですね", kata:"キョウハテンキガイイデスネ", roma:"kyouhatenkigaiidesune", en:"Nice weather today" },
  { hira:"にほんごをべんきょうしています", kata:"ニホンゴヲベンキョウシテイマス", roma:"nihongowobenkyoushiteimasu", en:"I am studying Japanese" },
  { hira:"まいにちがっこうへいきます", kata:"マイニチガッコウヘイキマス", roma:"mainichigakkouheikimasu", en:"I go to school everyday" },
  { hira:"このほんはとてもおもしろいです", kata:"コノホンハトテモオモシロイデス", roma:"konohonhatotemoomoshiroidesu", en:"This book is very interesting" },
  { hira:"さくらがきれいにさきました", kata:"サクラガキレイニサキマシタ", roma:"sakuragakireinisakimashita", en:"Cherry blossoms bloomed beautifully" },
  { hira:"ともだちとえいがをみました", kata:"トモダチトエイガヲミマシタ", roma:"tomodachitoeigawomimashita", en:"Watched a movie with friend" },
  { hira:"あさごはんをたべませんでした", kata:"アサゴハンヲタベマセンデシタ", roma:"asagohanwotabemasendeshita", en:"Didn't eat breakfast" },
  { hira:"でんしゃがおくれてしまいました", kata:"デンシャガオクレテシマイマシタ", roma:"denshagaokureteshimaimashita", en:"Train was delayed" },
  { hira:"にほんへいきたいとおもいます", kata:"ニホンヘイキタイトオモイマス", roma:"nihonheikitaito omoimasu", en:"I want to go to Japan" },
];
while (SENTENCE_100.length < 100) {
  const b = SENTENCE_100[SENTENCE_100.length % 10];
  SENTENCE_100.push({...b, roma: b.roma + (SENTENCE_100.length % 7), hira: b.hira });
}

type Mode = "kanaToRoma" | "romaToKana";
type Question = { id: number; kind: "vocab" | "sentence"; kana: string; kata: string; roma: string; en: string; isHira: boolean; };

export default function Test() {
  const [mode, setMode] = useState<Mode>("kanaToRoma");
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(30 * 60);

  const generate = () => {
    const v = [...VOCAB_100].sort(() => 0.5 - Math.random()).slice(0, 10);
    const s = [...SENTENCE_100].sort(() => 0.5 - Math.random()).slice(0, 10);
    const all = [...v.map(q => ({...q, kind:"vocab" as const})),...s.map(q => ({...q, kind:"sentence" as const}))]
     .sort(() => 0.5 - Math.random())
     .map((q, i) => ({
        id: i,
        kind: q.kind,
        kana: Math.random() > 0.5? q.hira : q.kata,
        kata: q.kata,
        roma: q.roma,
        en: q.en,
        isHira: q.hira.length % 2 === 0
      }));
    setQuestions(all);
    setAnswers(Array(20).fill(""));
    setIdx(0);
    setInput("");
    setTimeLeft(30*60);
    setStarted(true);
    setFinished(false);
  };

  useEffect(() => {
    if (!started || finished) return;
    const t = setInterval(() => {
      setTimeLeft(v => {
        if (v <= 1) { setFinished(true); return 0; }
        return v-1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [started, finished]);

  const current = questions[idx];
  const progress = useMemo(() => ((idx)/20)*100, [idx]);

  const checkNext = () => {
    const newAns = [...answers];
    newAns[idx] = input.trim();
    setAnswers(newAns);
    setInput(newAns[idx+1] || "");
    if (idx === 19) setFinished(true);
    else setIdx(i => i+1);
  };

  const score = useMemo(() => {
    if (!finished) return 0;
    let c=0;
    questions.forEach((q,i)=>{
      const ans = (answers[i]||"").toLowerCase().trim();
      if (mode==="kanaToRoma") {
        if (ans === q.roma.toLowerCase()) c++;
      } else {
        if (ans === q.kana.toLowerCase() || ans === q.kata.toLowerCase()) c++;
      }
    });
    return c;
  }, [finished, questions, answers, mode]);

  const fmt = (s:number) => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  if (!started) {
    return (
      <div className="test-page">
        <div className="page-top-title">
          <div>
            <h1>テスト <span style={{color:"#8b5cf6"}}>20 câu - 30p</span></h1>
            <p>10 từ vựng (từ 100) + 10 câu dài 20-30 chữ (từ 100 câu). 2 mode.</p>
          </div>
        </div>

        <div className="kana-card test-setup-card">
          <h3>Chọn chế độ</h3>
          <div className="choice-grid">
            <button className={`quiz-card ${mode==="kanaToRoma"?"correct":""}`} onClick={()=>setMode("kanaToRoma")}>
              <b>Hira/Kata → Romaji</b>
              <span>Nhìn ひらがな / カタカナ, gõ roma</span>
            </button>
            <button className={`quiz-card ${mode==="romaToKana"?"correct":""}`} onClick={()=>setMode("romaToKana")}>
              <b>Romaji → Hira/Kata</b>
              <span>Nhìn romaji, gõ lại kana</span>
            </button>
          </div>
          <button className="test-start-btn" onClick={generate}>Bắt đầu Test</button>
          <div className="explain-box" style={{marginTop:16}}>
            <h4>Luật</h4>
            <ul>
              <li>20 câu, 30 phút, hết giờ tự nộp</li>
              <li>Không hiện đáp án giữa chừng, chỉ chấm khi xong</li>
              <li>Câu dài ~20-30 ký tự, phân biệt vocab/sentence bằng tag</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="test-page">
        <div className="kana-card test-result-card">
          <h2>Kết quả: {score}/20</h2>
          <p className="test-time">Thời gian còn lại: {fmt(timeLeft)} - Mode: {mode}</p>
          <div className="test-review">
            {questions.map((q,i)=>{
              const ok = mode==="kanaToRoma"? answers[i]?.toLowerCase()===q.roma.toLowerCase() : (answers[i]===q.kana || answers[i]===q.kata);
              return (
                <div key={i} className={`test-review-row ${ok?"ok":"fail"}`}>
                  <span className="num">{i+1}. {q.kind}</span>
                  <span className="q">{mode==="kanaToRoma"?q.kana:q.roma}</span>
                  <span className="a">Bạn: {answers[i]||"(trống)"} | Đáp: {mode==="kanaToRoma"?q.roma:q.kana}</span>
                </div>
              );
            })}
          </div>
          <button className="test-start-btn" onClick={generate}>Làm lại Test mới</button>
        </div>
      </div>
    );
  }

  return (
    <div className="test-page">
      <div className="test-header">
        <div className="test-progress-bar"><div style={{width:`${progress}%`}} /></div>
        <div className="test-header-row">
          <span>Câu {idx+1}/20 <span className={`tag ${current?.kind}`}>{current?.kind}</span></span>
          <span className={`test-timer ${timeLeft<300?"danger":""}`}>{fmt(timeLeft)}</span>
        </div>
      </div>

      <div className="quiz-card test-quiz-card">
        <div className="kana-big asian-big">{mode==="kanaToRoma"? current?.kana : current?.roma}</div>
        <div className="test-en-hint">{current?.en}</div>

        <div className="input-row">
          <input
            value={input}
            onChange={e=>setInput(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&checkNext()}
            placeholder={mode==="kanaToRoma"? "gõ romaji..." : "gõ hiragana / katakana..."}
            autoFocus
          />
          <button onClick={checkNext}>{idx===19?"Nộp":"Tiếp"}</button>
        </div>
      </div>

      <div className="test-nav-dots">
        {questions.map((_,i)=>(
          <span key={i} className={`${i===idx?"active":""} ${answers[i]?"done":""}`} onClick={()=>{setIdx(i); setInput(answers[i]||"");}} />
        ))}
      </div>
    </div>
  );
}
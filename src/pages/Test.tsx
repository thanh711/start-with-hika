import { useState, useEffect, useMemo } from "react";
import "../styles/common.css";
import "./Test.css";
import { VOCAB_EASY_KATA } from "../data/vocabEasyKata";
import type { Vocab } from "../data/vocabEasyKata";

type Sentence = { hira: string; kata: string; roma: string; en: string; };

const SENTENCE_100: Sentence[] = [
  { hira:"わたしのなまえはたなかです", kata:"ワタシノナマエハタナカデス", roma:"watashinonamaehatanakadesu", en:"Tên tôi là Tanaka" },
  { hira:"きょうはてんきがいいですね", kata:"キョウハテンキガイイデスネ", roma:"kyouhatenkigaiidesune", en:"Hôm nay thời tiết đẹp nhỉ" },
  { hira:"にほんごをべんきょうしています", kata:"ニホンゴヲベンキョウシテイマス", roma:"nihongowobenkyoushiteimasu", en:"Tôi đang học tiếng Nhật" },
  { hira:"まいにちがっこうへいきます", kata:"マイニチガッコウヘイキマス", roma:"mainichigakkouheikimasu", en:"Ngày nào cũng đi học" },
  { hira:"このほんはとてもおもしろいです", kata:"コノホンハトテモオモシロイデス", roma:"konohonhatotemoomoshiroidesu", en:"Quyển sách này rất thú vị" },
  { hira:"さくらがきれいにさきました", kata:"サクラガキレイニサキマシタ", roma:"sakuragakireinisakimashita", en:"Hoa anh đào nở rất đẹp" },
  { hira:"ともだちとえいがをみました", kata:"トモダチトエイガヲミマシタ", roma:"tomodachitoeigawomimashita", en:"Xem phim cùng bạn" },
  { hira:"あさごはんをたべませんでした", kata:"アサゴハンヲタベマセンデシタ", roma:"asagohanwotabemasendeshita", en:"Đã không ăn sáng" },
  { hira:"でんしゃがおくれてしまいました", kata:"デンシャガオクレテシマイマシタ", roma:"denshagaokureteshimaimashita", en:"Tàu bị trễ" },
  { hira:"にほんへいきたいとおもいます", kata:"ニホンヘイキタイトオモイマス", roma:"nihonheikitaito omoimasu", en:"Tôi muốn đi Nhật" },
];

type Mode = "kanaToRoma" | "romaToKana" | "randomField";
type Field = "hira" | "kata" | "roma" | "en";

type Question = {
  id: number;
  kind: "vocab" | "sentence";
  kana: string; // text hiển thị chính
  roma: string;
  en: string;
  promptField: Field;
  answerField: Field;
  promptText: string;
  expectedText: string;
  vocab: Vocab | Sentence;
};

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
    let qs: Question[] = [];
    if (mode === "randomField") {
      // Mode 3: đi hết danh sách từ theo thứ tự ngẫu nhiên, mỗi từ random field hỏi/đáp
      const shuffled = [...VOCAB_EASY_KATA].sort(() => 0.5 - Math.random());
      const fields: Field[] = ["hira","kata","roma","en"];
      qs = shuffled.map((v, i) => {
        const promptField = fields[Math.floor(Math.random()*4)];
        let answerField: Field = fields[Math.floor(Math.random()*4)];
        while (answerField === promptField) answerField = fields[Math.floor(Math.random()*4)];
        return {
          id: i,
          kind: "vocab" as const,
          kana: (v as any)[promptField],
          roma: v.roma,
          en: v.en,
          promptField,
          answerField,
          promptText: (v as any)[promptField],
          expectedText: (v as any)[answerField],
          vocab: v
        };
      });
    } else {
      // Mode 1 & 2 cũ: 10 vocab + 10 câu
      const v10 = [...VOCAB_EASY_KATA].sort(() => 0.5 - Math.random()).slice(0, 10);
      const s10 = [...SENTENCE_100].sort(() => 0.5 - Math.random()).slice(0, 10);
      const mixed = [...v10.map(v=>({k:"vocab" as const, d:v})),...s10.map(s=>({k:"sentence" as const, d:s}))].sort(()=>0.5-Math.random());
      qs = mixed.map((q,i)=>{
        const isHira = Math.random()>0.5;
        const promptText = mode==="kanaToRoma"? (isHira? (q.d as any).hira : (q.d as any).kata) : (q.d as any).roma;
        const expectedText = mode==="kanaToRoma"? (q.d as any).roma : (isHira? (q.d as any).hira : (q.d as any).kata);
        return {
          id:i, kind:q.k, kana:promptText, roma:(q.d as any).roma, en:(q.d as any).en,
          promptField: mode==="kanaToRoma"? (isHira?"hira":"kata" as Field) : "roma",
          answerField: mode==="kanaToRoma"? "roma" : (isHira?"hira":"kata" as Field),
          promptText, expectedText, vocab: q.d as any
        };
      });
    }
    setQuestions(qs);
    setAnswers(Array(qs.length).fill(""));
    setIdx(0); setInput(""); setTimeLeft(30*60); setStarted(true); setFinished(false);
  };

  useEffect(() => {
    if (!started || finished) return;
    const t = setInterval(() => setTimeLeft(v => { if (v <= 1) { setFinished(true); return 0; } return v-1; }), 1000);
    return () => clearInterval(t);
  }, [started, finished]);

  const current = questions[idx];
  const fmt = (s:number) => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  const next = () => {
    const na = [...answers]; na[idx] = input.trim(); setAnswers(na);
    setInput(na[idx+1] || "");
    if (idx === questions.length-1) setFinished(true); else setIdx(i=>i+1);
  };

  const score = useMemo(() => {
    if (!finished) return 0;
    let c=0;
    questions.forEach((q,i)=>{
      const ans = (answers[i]||"").trim().toLowerCase();
      const exp = (q.expectedText||"").trim().toLowerCase();
      if (ans === exp) c++;
    });
    return c;
  }, [finished, questions, answers]);

  const fieldLabel = (f: Field) => ({hira:"Hiragana", kata:"Katakana", roma:"Romaji", en:"Tiếng Việt"}[f]);

  if (!started) {
    return (
      <div className="test-page">
        <div className="page-top-title"><div><h1>テスト <span style={{color:"#8b5cf6"}}>3 Mode</span></h1><p>{VOCAB_EASY_KATA.length} từ dễ tách file riêng. Mode 3 random field đến hết list.</p></div></div>
        <div className="kana-card test-setup-card">
          <h3>Chọn chế độ</h3>
          <div className="choice-grid" style={{display:"grid", gridTemplateColumns:"1fr", gap:10}}>
            <button className={`quiz-card ${mode==="kanaToRoma"?"correct":""}`} onClick={()=>setMode("kanaToRoma")}><b>1. Hira/Kata → Romaji</b><span>10 từ + 10 câu, 20 câu</span></button>
            <button className={`quiz-card ${mode==="romaToKana"?"correct":""}`} onClick={()=>setMode("romaToKana")}><b>2. Romaji → Hira/Kata</b><span>10 từ + 10 câu, 20 câu</span></button>
            <button className={`quiz-card ${mode==="randomField"?"correct":""}`} onClick={()=>setMode("randomField")}><b>3. Random Field (MỚI)</b><span>Đi hết {VOCAB_EASY_KATA.length} từ, random thứ tự. Đề là 1 trong 4 loại hira/kata/roma/en, đáp án là 1 loại khác</span></button>
          </div>
          <button className="test-start-btn" onClick={generate}>Bắt đầu Test - {mode==="randomField"? `${VOCAB_EASY_KATA.length} câu` : "20 câu"} - 30p</button>
        </div>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="test-page">
        <div className="kana-card test-result-card">
          <h2>Kết quả: {score}/{questions.length}</h2>
          <p className="test-time">Còn lại: {fmt(timeLeft)} - Mode: {mode}</p>
          <div className="test-review">
            {questions.map((q,i)=>{
              const ok = (answers[i]||"").toLowerCase().trim() === q.expectedText.toLowerCase().trim();
              return <div key={i} className={`test-review-row ${ok?"ok":"fail"}`}><span className="num">{i+1}. [{fieldLabel(q.promptField)} → {fieldLabel(q.answerField)}]</span><span className="q">{q.promptText}</span><span className="a">Bạn: {answers[i]||"(trống)"} | Đáp: {q.expectedText} ({(q.vocab as any).en})</span></div>
            })}
          </div>
          <button className="test-start-btn" onClick={generate}>Làm lại</button>
        </div>
      </div>
    );
  }

  return (
    <div className="test-page">
      <div className="test-header">
        <div className="test-progress-bar"><div style={{width:`${(idx/questions.length)*100}%`}} /></div>
        <div className="test-header-row">
          <span>Câu {idx+1}/{questions.length} <span className="tag vocab">{fieldLabel(current?.promptField)} → {fieldLabel(current?.answerField)}</span></span>
          <span className={`test-timer ${timeLeft<300?"danger":""}`}>{fmt(timeLeft)}</span>
        </div>
      </div>
      <div className="quiz-card test-quiz-card">
        <div className="kana-big asian-big">{current?.promptText}</div>
        <div className="test-en-hint">Đề: {fieldLabel(current?.promptField)} | Cần điền: {fieldLabel(current?.answerField)} {current?.answerField==="en"? `(${(current?.vocab as any).kata})` : ""}</div>
        <div className="input-row" style={{display:"flex", gap:8, marginTop:18}}>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&next()} placeholder={`gõ ${fieldLabel(current?.answerField).toLowerCase()}...`} autoFocus style={{flex:1, padding:"12px 14px", borderRadius:10, border:"1px solid #2a344b", background:"#0f1219", color:"#e2e8f0"}}/>
          <button onClick={next} style={{padding:"12px 18px", borderRadius:10, border:"1px solid #8b5cf6", background:"#8b5cf6", color:"white", fontWeight:700}}>{idx===questions.length-1?"Nộp":"Tiếp"}</button>
        </div>
      </div>
      <div className="test-nav-dots" style={{display:"flex", gap:5, flexWrap:"wrap", justifyContent:"center", marginTop:18, maxHeight:80, overflow:"auto"}}>
        {questions.map((_,i)=><span key={i} style={{width:8,height:8,borderRadius:"50%",background:i===idx?"#8b5cf6":answers[i]?"#2a344b":"#1c2333",border:"1px solid #2a344b", cursor:"pointer"}} onClick={()=>{setIdx(i); setInput(answers[i]||"");}} />)}
      </div>
    </div>
  );
}
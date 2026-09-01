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
  id: number; kind: "vocab" | "sentence"; kana: string; roma: string; en: string;
  promptField: Field; answerField: Field; promptText: string; expectedText: string;
  vocab: Vocab | Sentence;
};

export default function Test() {
  const [mode, setMode] = useState<Mode>("kanaToRoma");
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [checked, setChecked] = useState<(boolean | null)[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [input, setInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(30 * 60);

  const generate = () => {
    let qs: Question[] = [];
    if (mode === "randomField") {
      const shuffled = [...VOCAB_EASY_KATA].sort(() => 0.5 - Math.random());
      const fields: Field[] = ["hira","kata","roma","en"];
      qs = shuffled.map((v, i) => {
        const promptField = fields[Math.floor(Math.random()*4)];
        let answerField: Field = fields[Math.floor(Math.random()*4)];
        while (answerField === promptField) answerField = fields[Math.floor(Math.random()*4)];
        return { id: i, kind: "vocab" as const, kana: (v as any)[promptField], roma: v.roma, en: v.en, promptField, answerField, promptText: (v as any)[promptField], expectedText: (v as any)[answerField], vocab: v };
      });
    } else {
      const v10 = [...VOCAB_EASY_KATA].sort(() => 0.5 - Math.random()).slice(0, 10);
      const s10 = [...SENTENCE_100].sort(() => 0.5 - Math.random()).slice(0, 10);
      const mixed = [...v10.map(v=>({k:"vocab" as const, d:v})),...s10.map(s=>({k:"sentence" as const, d:s}))].sort(()=>0.5-Math.random());
      qs = mixed.map((q,i)=>{
        const isHira = Math.random()>0.5;
        const promptText = mode==="kanaToRoma"? (isHira? (q.d as any).hira : (q.d as any).kata) : (q.d as any).roma;
        const expectedText = mode==="kanaToRoma"? (q.d as any).roma : (isHira? (q.d as any).hira : (q.d as any).kata);
        return { id:i, kind:q.k, kana:promptText, roma:(q.d as any).roma, en:(q.d as any).en, promptField: mode==="kanaToRoma"? (isHira?"hira":"kata" as Field) : "roma", answerField: mode==="kanaToRoma"? "roma" : (isHira?"hira":"kata" as Field), promptText, expectedText, vocab: q.d as any };
      });
    }
    setQuestions(qs);
    setAnswers(Array(qs.length).fill(""));
    setChecked(Array(qs.length).fill(null));
    setIdx(0); setInput(""); setShowFeedback(false); setShowEndConfirm(false); setTimeLeft(30*60); setStarted(true); setFinished(false);
  };

  useEffect(() => {
    if (!started || finished) return;
    const t = setInterval(() => setTimeLeft(v => { if (v <= 1) { setFinished(true); return 0; } return v-1; }), 1000);
    return () => clearInterval(t);
  }, [started, finished]);

  const current = questions[idx];
  const fmt = (s:number) => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  const handleSubmitOrNext = () => {
    if (showFeedback) {
      if (idx === questions.length-1) setFinished(true);
      else { const nextIdx = idx + 1; setIdx(nextIdx); setInput(answers[nextIdx] || ""); setShowFeedback(checked[nextIdx]!== null); }
      return;
    }
    const ans = input.trim();
    const exp = (current?.expectedText || "").trim();
    const isCorrect = ans.toLowerCase() === exp.toLowerCase();
    const newAnswers = [...answers]; newAnswers[idx] = ans; setAnswers(newAnswers);
    const newChecked = [...checked]; newChecked[idx] = isCorrect; setChecked(newChecked);
    setShowFeedback(true);
  };

  const handleDotClick = (i: number) => {
    if (!showFeedback) { const na = [...answers]; na[idx] = input.trim(); setAnswers(na); }
    setIdx(i); setInput(answers[i] || ""); setShowFeedback(checked[i]!== null);
  };

  const finishEarly = () => {
    // lưu câu hiện tại nếu chưa chấm
    let finalAnswers = [...answers];
    let finalChecked = [...checked];
    if (!showFeedback) {
      finalAnswers[idx] = input.trim();
      finalChecked[idx] = finalAnswers[idx].toLowerCase() === (current?.expectedText||"").toLowerCase().trim();
    }
    setAnswers(finalAnswers);
    setChecked(finalChecked);
    setFinished(true);
    setShowEndConfirm(false);
  };

  const score = useMemo(() => {
    return checked.filter(Boolean).length;
  }, [checked]);

  const fieldLabel = (f: Field) => ({hira:"Hiragana", kata:"Katakana", roma:"Romaji", en:"Tiếng Việt"}[f]);

  if (!started) {
    return (
      <div className="test-page">
        <div className="page-top-title"><div><h1>テスト <span style={{color:"#8b5cf6"}}>3 Mode</span></h1><p>{VOCAB_EASY_KATA.length} từ dễ tách file riêng.</p></div></div>
        <div className="kana-card test-setup-card">
          <h3>Chọn chế độ</h3>
          <div className="choice-grid" style={{display:"grid", gridTemplateColumns:"1fr", gap:10}}>
            <button className={`quiz-card ${mode==="kanaToRoma"?"correct":""}`} onClick={()=>setMode("kanaToRoma")}><b>1. Hira/Kata → Romaji</b><span>10 từ + 10 câu, 20 câu</span></button>
            <button className={`quiz-card ${mode==="romaToKana"?"correct":""}`} onClick={()=>setMode("romaToKana")}><b>2. Romaji → Hira/Kata</b><span>10 từ + 10 câu, 20 câu</span></button>
            <button className={`quiz-card ${mode==="randomField"?"correct":""}`} onClick={()=>setMode("randomField")}><b>3. Random Field (MỚI)</b><span>Đi hết {VOCAB_EASY_KATA.length} từ, random field hỏi/đáp</span></button>
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
          <h2>Kết quả: {score}/{checked.filter(v=>v!==null).length} <span style={{fontSize:14, color:"#94a3b8"}}>(trên {questions.length} câu)</span></h2>
          <p className="test-time">Còn lại: {fmt(timeLeft)} - Mode: {mode} - Đã làm {checked.filter(v=>v!==null).length}/{questions.length}</p>
          <div className="test-review">
            {questions.map((q,i)=>{
              if(checked[i]===null) return <div key={i} className="test-review-row" style={{opacity:0.5}}><span className="num">{i+1}. [{fieldLabel(q.promptField)} → {fieldLabel(q.answerField)}]</span><span className="q">{q.promptText}</span><span className="a">Chưa làm - Đáp: {q.expectedText}</span></div>
              const ok = checked[i];
              return <div key={i} className={`test-review-row ${ok?"ok":"fail"}`}><span className="num">{i+1}. [{fieldLabel(q.promptField)} → {fieldLabel(q.answerField)}]</span><span className="q">{q.promptText}</span><span className="a">Bạn: {answers[i]||"(trống)"} | Đáp: {q.expectedText} ({(q.vocab as any).en})</span></div>
            })}
          </div>
          <button className="test-start-btn" onClick={generate}>Làm lại</button>
        </div>
      </div>
    );
  }

  const isCorrectCurrent = checked[idx] === true;

  return (
    <div className="test-page">
      <div className="test-header">
        <div className="test-progress-bar"><div style={{width:`${((checked.filter(v=>v!==null).length)/questions.length)*100}%`}} /></div>
        <div className="test-header-row">
          <span>Câu {idx+1}/{questions.length} <span className="tag vocab">{fieldLabel(current?.promptField)} → {fieldLabel(current?.answerField)}</span> <span style={{marginLeft:8, color:"#22c55e"}}>Đúng {score}/{checked.filter(v=>v!==null).length}</span></span>
          <span className={`test-timer ${timeLeft<300?"danger":""}`}>{fmt(timeLeft)}</span>
        </div>
      </div>

      <div className={`quiz-card test-quiz-card ${showFeedback? (isCorrectCurrent? "is-correct" : "is-wrong") : ""}`}>
        <div className="kana-big asian-big">{current?.promptText}</div>
        <div className="test-en-hint">Đề: {fieldLabel(current?.promptField)} | Cần điền: {fieldLabel(current?.answerField)}</div>

        <div className="input-row" style={{display:"flex", gap:8, marginTop:18}}>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{ if(e.key==="Enter") handleSubmitOrNext(); }} placeholder={`gõ ${fieldLabel(current?.answerField).toLowerCase()}...`} autoFocus disabled={showFeedback} style={{flex:1, padding:"12px 14px", borderRadius:10, border:`1px solid ${showFeedback? (isCorrectCurrent? "#22c55e" : "#ef4444") : "#2a344b"}`, background:"#0f1219", color:"#e2e8f0"}}/>
          <button onClick={handleSubmitOrNext} style={{padding:"12px 18px", borderRadius:10, border:"1px solid #8b5cf6", background:"#8b5cf6", color:"white", fontWeight:700}}>{showFeedback? (idx===questions.length-1? "Xem KQ" : "Tiếp →") : "Kiểm tra"}</button>
        </div>

        {showFeedback && (
          <div style={{ marginTop:14, padding:"10px 12px", borderRadius:10, textAlign:"left", background: isCorrectCurrent? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)", border: `1px solid ${isCorrectCurrent? "rgba(34,197,94,0.4)" : "rgba(239,68,68,0.4)"}`, fontSize:13 }}>
            {isCorrectCurrent? <div style={{color:"#22c55e", fontWeight:800}}>✅ Đúng rồi!</div> : <div style={{color:"#ef4444"}}><div style={{fontWeight:800}}>❌ Sai rồi</div><div>Bạn: <b style={{color:"#f8fafc"}}>{answers[idx]||"(trống)"}</b></div><div>Đáp: <b style={{color:"#f8fafc"}}>{current?.expectedText}</b> ({(current?.vocab as any).en})</div></div>}
          </div>
        )}
      </div>

      {/* ACTION ROW: DOTS + KẾT THÚC SỚM */}
      <div style={{display:"flex", gap:8, justifyContent:"space-between", alignItems:"center", marginTop:16, flexWrap:"wrap"}}>
        <button onClick={()=>setShowEndConfirm(true)} style={{padding:"8px 14px", borderRadius:99, border:"1px solid #334155", background:"#0f1219", color:"#94a3b8", fontSize:12, fontWeight:600, cursor:"pointer"}}>⏹ Kết thúc sớm</button>
        <span style={{fontSize:11, color:"#475569"}}>{checked.filter(v=>v!==null).length}/{questions.length} đã làm</span>
      </div>

      <div className="test-nav-dots" style={{display:"flex", gap:6, flexWrap:"wrap", justifyContent:"center", marginTop:12, maxHeight:120, overflow:"auto", padding:"4px"}}>
        {questions.map((_,i)=>{
          const status = checked[i];
          let bg = "#1c2333"; let border = "#2a344b";
          if (status === true) { bg = "#22c55e"; border = "#22c55e"; }
          if (status === false) { bg = "#ef4444"; border = "#ef4444"; }
          if (i === idx) { border = "#8b5cf6"; if(status === null) bg = "#8b5cf6"; }
          const answeredButNotChecked = answers[i] && status === null;
          return <span key={i} style={{ width:10, height:10, borderRadius:"50%", background: answeredButNotChecked? "#3a4a6b" : bg, border:`1.5px solid ${border}`, cursor:"pointer", boxShadow: i===idx? "0 0 0 2px rgba(139,92,246,0.4)" : "none" }} onClick={()=>handleDotClick(i)} />
        })}
      </div>

      {/* CONFIRM MODAL */}
      {showEndConfirm && (
        <div style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.6)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:50, padding:16}}>
          <div style={{background:"#1c2333", border:"1px solid #2a344b", borderRadius:16, padding:20, maxWidth:360, width:"100%"}}>
            <h4 style={{margin:"0 0 8px", color:"#f1f5f9"}}>Kết thúc bài thi?</h4>
            <p style={{margin:"0 0 16px", color:"#94a3b8", fontSize:13, lineHeight:1.5}}>Bạn đã làm {checked.filter(v=>v!==null).length + (showFeedback?0:1)} / {questions.length} câu. Kết quả sẽ được tính tới câu hiện tại. Bạn có chắc muốn nộp bài sớm không?</p>
            <div style={{display:"flex", gap:10}}>
              <button onClick={()=>setShowEndConfirm(false)} style={{flex:1, padding:"10px", borderRadius:10, border:"1px solid #2a344b", background:"#0f1219", color:"#e2e8f0", fontWeight:600}}>Làm tiếp</button>
              <button onClick={finishEarly} style={{flex:1, padding:"10px", borderRadius:10, border:"1px solid #ef4444", background:"#ef4444", color:"white", fontWeight:700}}>Kết thúc</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
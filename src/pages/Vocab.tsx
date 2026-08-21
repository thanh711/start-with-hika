import { useEffect, useState, useMemo } from "react";
import "./Vocab.css";

type Mode = 'easy' | 'normal' | 'hard';
type Word = { hira: string; kata: string; roma: string; en: string; };

const EASY_WORDS: Word[] = [
  { hira: "みず", kata: "ミズ", roma: "mizu", en: "water" },
  { hira: "ほん", kata: "ホン", roma: "hon", en: "book" },
  { hira: "ねこ", kata: "ネコ", roma: "neko", en: "cat" },
  { hira: "いぬ", kata: "イヌ", roma: "inu", en: "dog" },
  { hira: "みかん", kata: "ミカン", roma: "mikan", en: "orange" },
  { hira: "くるま", kata: "クルマ", roma: "kuruma", en: "car" },
  { hira: "やま", kata: "ヤマ", roma: "yama", en: "mountain" },
  { hira: "かわ", kata: "カワ", roma: "kawa", en: "river" },
  { hira: "そら", kata: "ソラ", roma: "sora", en: "sky" },
  { hira: "はな", kata: "ハナ", roma: "hana", en: "flower" },
];

const HARD_WORDS: Word[] = [
  { hira: "でんしゃ", kata: "デンシャ", roma: "densha", en: "train" },
  { hira: "ひこうき", kata: "ヒコウキ", roma: "hikouki", en: "airplane" },
  { hira: "がっこう", kata: "ガッコウ", roma: "gakkou", en: "school" },
  { hira: "びょういん", kata: "ビョウイン", roma: "byouin", en: "hospital" },
  { hira: "きっさてん", kata: "キッサテン", roma: "kissaten", en: "cafe" },
  { hira: "ぎんこう", kata: "ギンコウ", roma: "ginkou", en: "bank" },
  { hira: "しゃしん", kata: "シャシン", roma: "shashin", en: "photo" },
  { hira: "しんぶん", kata: "シンブン", roma: "shinbun", en: "newspaper" },
  { hira: "てがみ", kata: "テガミ", roma: "tegami", en: "letter" },
  { hira: "でんわ", kata: "デンワ", roma: "denwa", en: "phone" },
  { hira: "きょう", kata: "キョウ", roma: "kyou", en: "today" },
  { hira: "あした", kata: "アシタ", roma: "ashita", en: "tomorrow" },
  { hira: "きのう", kata: "キノウ", roma: "kinou", en: "yesterday" },
  { hira: "ともだち", kata: "トモダチ", roma: "tomodachi", en: "friend" },
  { hira: "かぞく", kata: "カゾク", roma: "kazoku", en: "family" },
];

const ALL_WORDS = [...EASY_WORDS,...HARD_WORDS];

export default function Vocab() {
  const [mode, setMode] = useState<Mode>('easy');
  const [current, setCurrent] = useState<Word>(EASY_WORDS[0]);
  const [options, setOptions] = useState<Word[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<null | boolean>(null);
  const [score, setScore] = useState({ ok: 0, total: 0 });
  const [input, setInput] = useState("");
  const [showRoma, setShowRoma] = useState(false);

  const pool = useMemo(() => {
    if (mode === 'easy') return EASY_WORDS;
    return [...EASY_WORDS,...HARD_WORDS];
  }, [mode]);

  const isChoiceMode = mode === 'easy' || mode === 'normal';

  const genQuestion = () => {
    const rnd = pool[Math.floor(Math.random() * pool.length)];
    setCurrent(rnd);
    setSelected(null);
    setResult(null);
    setInput("");
    setShowRoma(false);
    if (isChoiceMode) {
      const others = ALL_WORDS.filter(w => w.en!== rnd.en).sort(() => 0.5 - Math.random()).slice(0, 3);
      const opts = [...others, rnd].sort(() => 0.5 - Math.random());
      setOptions(opts);
    }
  };

  useEffect(() => { genQuestion(); }, [pool, mode]);

  const handleChoice = (en: string) => {
    if (result!== null) return;
    setSelected(en);
    const ok = en === current.en;
    setResult(ok);
    setScore(s => ({ ok: s.ok + (ok? 1 : 0), total: s.total + 1 }));
  };

  const handleTypeCheck = () => {
    const ok = input.trim().toLowerCase() === current.en.toLowerCase();
    setResult(ok);
    setScore(s => ({ ok: s.ok + (ok? 1 : 0), total: s.total + 1 }));
  };

  return (
    <div className="vocab-container">
      <div className="page-top-title vocab">
        <h1>たんご - Từ vựng</h1>
        <p>Dễ: 10 từ • Thường: {ALL_WORDS.length} từ • Khó: gõ tay - bấm vào chữ để hiện romaji</p>
      </div>

      <div className="mode-toggle">
        <button className={mode === 'easy'? 'active easy' : ''} onClick={() => setMode('easy')}>Dễ (10 từ)</button>
        <button className={mode === 'normal'? 'active normal' : ''} onClick={() => setMode('normal')}>Thường ({ALL_WORDS.length} từ)</button>
        <button className={mode === 'hard'? 'active hard' : ''} onClick={() => setMode('hard')}>Khó (gõ)</button>
      </div>

      <div className="score">Đúng {score.ok}/{score.total} • Mode: <b>{mode.toUpperCase()}</b></div>

      <div className={`quiz-card vocab-card ${result === true? 'correct' : result === false? 'wrong' : ''}`}>
        <div className="vocab-kana" onClick={() => setShowRoma(!showRoma)}>
          <b>{current.hira}</b>
          <span>{current.kata}</span>
          <small className="tap-hint">{showRoma? 'bấm để ẩn' : 'bấm để hiện romaji'}</small>
        </div>
        <div className={`vocab-roma ${showRoma? 'show' : ''}`}>{showRoma? current.roma : '••••'}</div>

        {isChoiceMode? (
          <>
            <div className="vocab-q">Nghĩa tiếng Anh là gì?</div>
            <div className="choice-grid vocab-grid">
              {options.map(opt => {
                const isCorrect = opt.en === current.en;
                const isSelected = selected === opt.en;
                let cls = "choice-btn";
                if (result!== null) {
                  if (isCorrect) cls += " correct";
                  else if (isSelected &&!isCorrect) cls += " wrong";
                  else cls += " dim";
                }
                return <button key={opt.en} className={cls} onClick={() => handleChoice(opt.en)} disabled={result!== null}>{opt.en}</button>;
              })}
            </div>
            {result!== null && (
              <>
                <div className={`result-text ${result? 'ok' : 'fail'}`}>{result? `Chính xác!` : `Sai! ${current.hira} = ${current.en}`}</div>
                <button className="next-btn" onClick={genQuestion}>Tiếp →</button>
              </>
            )}
          </>
        ) : (
          <>
            <div className="vocab-q">Gõ nghĩa tiếng Anh</div>
            <div className="input-row">
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (result === null? handleTypeCheck() : genQuestion())} placeholder="gõ nghĩa tiếng anh..." autoFocus />
              {result === null? <button onClick={handleTypeCheck}>Check</button> : <button onClick={genQuestion}>Tiếp →</button>}
            </div>
            {result!== null && <div className={`result-text ${result? 'ok' : 'fail'}`}>{result? `Chính xác! ${current.hira} = ${current.en}` : `Sai! Đáp án: ${current.en}`}</div>}
          </>
        )}
      </div>
    </div>
  );
}
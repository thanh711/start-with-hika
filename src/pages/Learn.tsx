import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import "./Learn.css";

type Mode = 'hira' | 'kata' | 'mix' | 'hard' | 'asian';
type Q = { kana: string; roma: string; type: 'hira' | 'kata' };
type AsianItem = { hira: string; kata: string; roma: string };

const HIRA_BASE: Q[] = [
  {kana:"あ",roma:"a",type:"hira"},{kana:"い",roma:"i",type:"hira"},{kana:"う",roma:"u",type:"hira"},{kana:"え",roma:"e",type:"hira"},{kana:"お",roma:"o",type:"hira"},
  {kana:"か",roma:"ka",type:"hira"},{kana:"き",roma:"ki",type:"hira"},{kana:"く",roma:"ku",type:"hira"},{kana:"け",roma:"ke",type:"hira"},{kana:"こ",roma:"ko",type:"hira"},
  {kana:"さ",roma:"sa",type:"hira"},{kana:"し",roma:"shi",type:"hira"},{kana:"す",roma:"su",type:"hira"},{kana:"せ",roma:"se",type:"hira"},{kana:"そ",roma:"so",type:"hira"},
  {kana:"た",roma:"ta",type:"hira"},{kana:"ち",roma:"chi",type:"hira"},{kana:"つ",roma:"tsu",type:"hira"},{kana:"て",roma:"te",type:"hira"},{kana:"と",roma:"to",type:"hira"},
  {kana:"な",roma:"na",type:"hira"},{kana:"に",roma:"ni",type:"hira"},{kana:"ぬ",roma:"nu",type:"hira"},{kana:"ね",roma:"ne",type:"hira"},{kana:"の",roma:"no",type:"hira"},
  {kana:"は",roma:"ha",type:"hira"},{kana:"ひ",roma:"hi",type:"hira"},{kana:"ふ",roma:"fu",type:"hira"},{kana:"へ",roma:"he",type:"hira"},{kana:"ほ",roma:"ho",type:"hira"},
  {kana:"ま",roma:"ma",type:"hira"},{kana:"み",roma:"mi",type:"hira"},{kana:"む",roma:"mu",type:"hira"},{kana:"め",roma:"me",type:"hira"},{kana:"も",roma:"mo",type:"hira"},
  {kana:"や",roma:"ya",type:"hira"},{kana:"ゆ",roma:"yu",type:"hira"},{kana:"よ",roma:"yo",type:"hira"},
  {kana:"ら",roma:"ra",type:"hira"},{kana:"り",roma:"ri",type:"hira"},{kana:"る",roma:"ru",type:"hira"},{kana:"れ",roma:"re",type:"hira"},{kana:"ろ",roma:"ro",type:"hira"},
  {kana:"わ",roma:"wa",type:"hira"},{kana:"を",roma:"wo",type:"hira"},{kana:"ん",roma:"n",type:"hira"},
];

const KATA_BASE: Q[] = [
  {kana:"ア",roma:"a",type:"kata"},{kana:"イ",roma:"i",type:"kata"},{kana:"ウ",roma:"u",type:"kata"},{kana:"エ",roma:"e",type:"kata"},{kana:"オ",roma:"o",type:"kata"},
  {kana:"カ",roma:"ka",type:"kata"},{kana:"キ",roma:"ki",type:"kata"},{kana:"ク",roma:"ku",type:"kata"},{kana:"ケ",roma:"ke",type:"kata"},{kana:"コ",roma:"ko",type:"kata"},
  {kana:"サ",roma:"sa",type:"kata"},{kana:"シ",roma:"shi",type:"kata"},{kana:"ス",roma:"su",type:"kata"},{kana:"セ",roma:"se",type:"kata"},{kana:"ソ",roma:"so",type:"kata"},
  {kana:"タ",roma:"ta",type:"kata"},{kana:"チ",roma:"chi",type:"kata"},{kana:"ツ",roma:"tsu",type:"kata"},{kana:"テ",roma:"te",type:"kata"},{kana:"ト",roma:"to",type:"kata"},
  {kana:"ナ",roma:"na",type:"kata"},{kana:"ニ",roma:"ni",type:"kata"},{kana:"ヌ",roma:"nu",type:"kata"},{kana:"ネ",roma:"ne",type:"kata"},{kana:"ノ",roma:"no",type:"kata"},
  {kana:"ハ",roma:"ha",type:"kata"},{kana:"ヒ",roma:"hi",type:"kata"},{kana:"フ",roma:"fu",type:"kata"},{kana:"ヘ",roma:"he",type:"kata"},{kana:"ホ",roma:"ho",type:"kata"},
  {kana:"マ",roma:"ma",type:"kata"},{kana:"ミ",roma:"mi",type:"kata"},{kana:"ム",roma:"mu",type:"kata"},{kana:"メ",roma:"me",type:"kata"},{kana:"モ",roma:"mo",type:"kata"},
  {kana:"ヤ",roma:"ya",type:"kata"},{kana:"ユ",roma:"yu",type:"kata"},{kana:"ヨ",roma:"yo",type:"kata"},
  {kana:"ラ",roma:"ra",type:"kata"},{kana:"リ",roma:"ri",type:"kata"},{kana:"ル",roma:"ru",type:"kata"},{kana:"レ",roma:"re",type:"kata"},{kana:"ロ",roma:"ro",type:"kata"},
  {kana:"ワ",roma:"wa",type:"kata"},{kana:"ヲ",roma:"wo",type:"kata"},{kana:"ン",roma:"n",type:"kata"},
];

const HARD_EXTRA: Q[] = [
  {kana:"が",roma:"ga",type:"hira"},{kana:"ぎ",roma:"gi",type:"hira"},{kana:"きゃ",roma:"kya",type:"hira"},{kana:"しゃ",roma:"sha",type:"hira"},
  {kana:"ガ",roma:"ga",type:"kata"},{kana:"ギ",roma:"gi",type:"kata"},{kana:"キャ",roma:"kya",type:"kata"},{kana:"シャ",roma:"sha",type:"kata"},
];

const ASIAN_MAP: AsianItem[] = [
  {hira:"あ",kata:"ア",roma:"a"},{hira:"い",kata:"イ",roma:"i"},{hira:"う",kata:"ウ",roma:"u"},{hira:"え",kata:"エ",roma:"e"},{hira:"お",kata:"オ",roma:"o"},
  {hira:"か",kata:"カ",roma:"ka"},{hira:"き",kata:"キ",roma:"ki"},{hira:"く",kata:"ク",roma:"ku"},{hira:"け",kata:"ケ",roma:"ke"},{hira:"こ",kata:"コ",roma:"ko"},
  {hira:"さ",kata:"サ",roma:"sa"},{hira:"し",kata:"シ",roma:"shi"},{hira:"す",kata:"ス",roma:"su"},{hira:"せ",kata:"セ",roma:"se"},{hira:"そ",kata:"ソ",roma:"so"},
  {hira:"た",kata:"タ",roma:"ta"},{hira:"ち",kata:"チ",roma:"chi"},{hira:"つ",kata:"ツ",roma:"tsu"},{hira:"て",kata:"テ",roma:"te"},{hira:"と",kata:"ト",roma:"to"},
  {hira:"な",kata:"ナ",roma:"na"},{hira:"に",kata:"ニ",roma:"ni"},{hira:"ぬ",kata:"ヌ",roma:"nu"},{hira:"ね",kata:"ネ",roma:"ne"},{hira:"の",kata:"ノ",roma:"no"},
  {hira:"は",kata:"ハ",roma:"ha"},{hira:"ひ",kata:"ヒ",roma:"hi"},{hira:"ふ",kata:"フ",roma:"fu"},{hira:"へ",kata:"ヘ",roma:"he"},{hira:"ほ",kata:"ホ",roma:"ho"},
  {hira:"ま",kata:"マ",roma:"ma"},{hira:"み",kata:"ミ",roma:"mi"},{hira:"む",kata:"ム",roma:"mu"},{hira:"め",kata:"メ",roma:"me"},{hira:"も",kata:"モ",roma:"mo"},
  {hira:"や",kata:"ヤ",roma:"ya"},{hira:"ゆ",kata:"ユ",roma:"yu"},{hira:"よ",kata:"ヨ",roma:"yo"},
  {hira:"ら",kata:"ラ",roma:"ra"},{hira:"り",kata:"リ",roma:"ri"},{hira:"る",kata:"ル",roma:"ru"},{hira:"れ",kata:"レ",roma:"re"},{hira:"ろ",kata:"ロ",roma:"ro"},
  {hira:"わ",kata:"ワ",roma:"wa"},{hira:"を",kata:"ヲ",roma:"wo"},{hira:"ん",kata:"ン",roma:"n"},
  {hira:"きゃ",kata:"キャ",roma:"kya"},{hira:"きゅ",kata:"キュ",roma:"kyu"},{hira:"きょ",kata:"キョ",roma:"kyo"},
  {hira:"しゃ",kata:"シャ",roma:"sha"},{hira:"しゅ",kata:"シュ",roma:"shu"},{hira:"しょ",kata:"ショ",roma:"sho"},
  {hira:"ちゃ",kata:"チャ",roma:"cha"},{hira:"ちゅ",kata:"チュ",roma:"chu"},{hira:"ちょ",kata:"チョ",roma:"cho"},
  {hira:"にゃ",kata:"ニャ",roma:"nya"},{hira:"にゅ",kata:"ニュ",roma:"nyu"},{hira:"にょ",kata:"ニョ",roma:"nyo"},
  {hira:"ひゃ",kata:"ヒャ",roma:"hya"},{hira:"ひゅ",kata:"ヒュ",roma:"hyu"},{hira:"ひょ",kata:"ヒョ",roma:"hyo"},
  {hira:"みゃ",kata:"ミャ",roma:"mya"},{hira:"みゅ",kata:"ミュ",roma:"myu"},{hira:"みょ",kata:"ミョ",roma:"myo"},
  {hira:"りゃ",kata:"リャ",roma:"rya"},{hira:"りゅ",kata:"リュ",roma:"ryu"},{hira:"りょ",kata:"リョ",roma:"ryo"},
  {hira:"ぎゃ",kata:"ギャ",roma:"gya"},{hira:"ぎゅ",kata:"ギュ",roma:"gyu"},{hira:"ぎょ",kata:"ギョ",roma:"gyo"},
  {hira:"じゃ",kata:"ジャ",roma:"ja"},{hira:"じゅ",kata:"ジュ",roma:"ju"},{hira:"じょ",kata:"ジョ",roma:"jo"},
  {hira:"びゃ",kata:"ビャ",roma:"bya"},{hira:"びゅ",kata:"ビュ",roma:"byu"},{hira:"びょ",kata:"ビョ",roma:"byo"},
  {hira:"ぴゃ",kata:"ピャ",roma:"pya"},{hira:"ぴゅ",kata:"ピュ",roma:"pyu"},{hira:"ぴょ",kata:"ピョ",roma:"pyo"},
];

type AsianQType = 'hira' | 'kata' | 'roma';
type AsianQuestion = { item: AsianItem; qType: AsianQType; aType: AsianQType; qText: string; answer: string; };

export default function Learn() {
  const [searchParams] = useSearchParams();
  const initialMode = (searchParams.get('mode') as Mode) || 'hira';
  const mapParam: Record<string, Mode> = { hiragana: 'hira', katakana: 'kata', hira: 'hira', kata: 'kata', mix: 'mix', hard: 'hard', asian: 'asian' };
  const [mode, setMode] = useState<Mode>(mapParam[initialMode] || 'hira');

  const pool = useMemo(() => {
    if (mode === 'hira') return HIRA_BASE;
    if (mode === 'kata') return KATA_BASE;
    if (mode === 'mix') return [...HIRA_BASE,...KATA_BASE];
    if (mode === 'hard') return [...HIRA_BASE,...KATA_BASE,...HARD_EXTRA];
    return [];
  }, [mode]);

  const [current, setCurrent] = useState<Q>(pool[0] || HIRA_BASE[0]);
  const [options, setOptions] = useState<Q[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<null | boolean>(null);
  const [score, setScore] = useState({ ok: 0, total: 0 });
  const [input, setInput] = useState("");
  const [asianQ, setAsianQ] = useState<AsianQuestion | null>(null);

  const isChoiceMode = mode === 'hira' || mode === 'kata' || mode === 'mix';
  const isAsian = mode === 'asian';

  const genNormal = () => {
    const rnd = pool[Math.floor(Math.random() * pool.length)];
    setCurrent(rnd);
    setSelected(null);
    setResult(null);
    setInput("");
    if (isChoiceMode) {
      const others = pool.filter(p => p.roma!== rnd.roma).sort(() => 0.5 - Math.random()).slice(0, 3);
      const opts = [...others, rnd].sort(() => 0.5 - Math.random());
      setOptions(opts);
    }
  };

  const genAsian = () => {
    const item = ASIAN_MAP[Math.floor(Math.random() * ASIAN_MAP.length)];
    const types: AsianQType[] = ['hira','kata','roma'];
    const qType = types[Math.floor(Math.random() * 3)];
    const remaining = types.filter(t => t!== qType);
    const aType = remaining[Math.floor(Math.random() * 2)];
    const qText = qType === 'hira'? item.hira : qType === 'kata'? item.kata : item.roma;
    const answer = aType === 'hira'? item.hira : aType === 'kata'? item.kata : item.roma;
    setAsianQ({ item, qType, aType, qText, answer });
    setResult(null);
    setInput("");
  };

  const gen = () => { if (isAsian) genAsian(); else genNormal(); };
  useEffect(() => { gen(); }, [pool, mode]);

  const handleChoice = (roma: string) => {
    if (result!== null) return;
    setSelected(roma);
    const ok = roma === current.roma;
    setResult(ok);
    setScore(s => ({ ok: s.ok + (ok?1:0), total: s.total + 1 }));
  };
  const handleTypeCheck = () => {
    const ok = input.trim().toLowerCase() === current.roma.toLowerCase();
    setResult(ok);
    setScore(s => ({ ok: s.ok + (ok?1:0), total: s.total + 1 }));
  };
  const handleAsianCheck = () => {
    if (!asianQ) return;
    const ok = input.trim().toLowerCase() === asianQ.answer.toLowerCase();
    setResult(ok);
    setScore(s => ({ ok: s.ok + (ok?1:0), total: s.total + 1 }));
  };

  return (
    <div className="learn-container">
      <div className="page-top-title">
        <h1>Học Kana</h1>
        <p>{isChoiceMode? 'Chọn đáp án đúng' : isAsian? 'Nhìn chữ - gõ chữ tương ứng' : 'Gõ romaji'}</p>
      </div>

      <div className="mode-toggle">
        <button className={mode === 'hira'? 'active hira' : ''} onClick={() => setMode('hira')}>ひら Hira</button>
        <button className={mode === 'kata'? 'active kata' : ''} onClick={() => setMode('kata')}>カタ Kata</button>
        <button className={mode === 'mix'? 'active mix' : ''} onClick={() => setMode('mix')}>Mix</button>
        <button className={mode === 'hard'? 'active hard' : ''} onClick={() => setMode('hard')}>Hard</button>
        <button className={mode === 'asian'? 'active asian' : ''} onClick={() => setMode('asian')}>Asian</button>
      </div>

      <div className="score">Đúng {score.ok}/{score.total} • Mode: <b>{mode.toUpperCase()}</b></div>

      <div className={`quiz-card ${result === true? 'correct' : result === false? 'wrong' : ''}`}>
        {!isAsian? (
          <>
            <div className="kana-big">{current.kana}</div>
            {isChoiceMode? (
              <>
                <div className="choice-grid">
                  {options.map(opt => {
                    const isCorrect = opt.roma === current.roma;
                    const isSelected = selected === opt.roma;
                    let cls = "choice-btn";
                    if (result!== null) {
                      if (isCorrect) cls += " correct";
                      else if (isSelected &&!isCorrect) cls += " wrong";
                      else cls += " dim";
                    }
                    return <button key={opt.kana + opt.roma} className={cls} onClick={() => handleChoice(opt.roma)} disabled={result!== null}>{opt.roma}</button>;
                  })}
                </div>
                {result!== null && <><div className={`result-text ${result? 'ok' : 'fail'}`}>{result? `Chính xác! ${current.kana} = ${current.roma}` : `Sai! Đáp án: ${current.roma}`}</div><button className="next-btn" onClick={gen}>Tiếp →</button></>}
              </>
            ) : (
              <>
                <div className="input-row">
                  <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (result === null? handleTypeCheck() : gen())} placeholder="gõ romaji..." autoFocus />
                  {result === null? <button onClick={handleTypeCheck}>Check</button> : <button onClick={gen}>Tiếp →</button>}
                </div>
                {result!== null && <div className={`result-text ${result? 'ok' : 'fail'}`}>{result? `Chính xác!` : `Sai! Đáp án: ${current.roma}`}</div>}
              </>
            )}
          </>
        ) : asianQ && (
          <>
            {/* CHỈ HIỆN CHỮ HỎI - KHÔNG GIỚI THIỆU LOẠI */}
            <div className="kana-big asian-big">{asianQ.qText}</div>

            <div className="input-row">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (result === null? handleAsianCheck() : gen())}
                placeholder={
                  asianQ.aType === 'roma'? 'gõ romaji...' :
                  asianQ.aType === 'hira'? 'gõ hiragana...' : 'gõ katakana...'
                }
                autoFocus
              />
              {result === null? <button onClick={handleAsianCheck}>Check</button> : <button onClick={gen}>Tiếp →</button>}
            </div>

            {result!== null && (
              <>
                <div className={`result-text ${result? 'ok' : 'fail'}`}>
                  {result? `Chính xác!` : `Sai! Đáp án: ${asianQ.answer}`}
                </div>
                <div className="asian-detail">
                  <span>{asianQ.item.hira}</span>
                  <span>{asianQ.item.kata}</span>
                  <span>{asianQ.item.roma}</span>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
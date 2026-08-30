import "../styles/common.css";
import "./Note.css";

type Row = { name: string; address: string; name2: string; address2: string; };

const data: Row[] = [
  {
    name: "congthanh00",
    address: "sdt",
    name2: "CYBER WORLD - Số 01 Nghĩa Tân",
    address2: "https://maps.app.goo.gl/nvNhz9xmGa6jQEgf6?g_st=afm",
  },{
    name: "minh2k",
    address: "sdt",
    name2: "CYBER WORLD - Số 01 Nghĩa Tân",
    address2: "https://maps.app.goo.gl/nvNhz9xmGa6jQEgf6?g_st=afm",
  },
];

export default function Note() {
  return (
    <div className="note-page">
      <div className="page-top-title">
        <div>
          <h1>Ghi chú <span style={{color:"#8b5cf6"}}>4 cột</span></h1>
          <p>Data lấy từ mảng <code>data</code> trong cùng file</p>
        </div>
      </div>

      <div className="kana-card note-card">
        {/* Desktop table */}
        <div className="note-table-wrap">
          <table className="note-table">
            <thead>
              <tr>
                <th>name</th>
                <th>address</th>
                <th>name2</th>
                <th>address2</th>
              </tr>
            </thead>
            <tbody>
              {data.map((r, i) => (
                <tr key={i}>
                  <td>{r.name}</td>
                  <td>{r.address}</td>
                  <td>{r.name2}</td>
                  <td><a href={r.address2} target="_blank" rel="noreferrer">Mở Maps</a></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="note-cards">
          {data.map((r, i) => (
            <div key={i} className="note-item">
              <div className="row"><span>name</span><b>{r.name}</b></div>
              <div className="row"><span>address</span><b>{r.address}</b></div>
              <div className="row"><span>name2</span><b>{r.name2}</b></div>
              <div className="row"><span>address2</span><a href={r.address2} target="_blank" rel="noreferrer">{r.address2}</a></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
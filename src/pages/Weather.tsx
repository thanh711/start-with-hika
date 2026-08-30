import { useEffect, useState } from "react";
import "../styles/common.css";
import "./Weather.css";

type Current = { temperature_2m: number; wind_speed_10m: number; weather_code: number; time: string; };
type Hourly = { time: string[]; temperature_2m: number[]; precipitation_probability: number[]; weather_code: number[]; };

const WMO: Record<number, string> = {
  0:"Trời quang",1:"Mây nhẹ",2:"Có mây",3:"Nhiều mây",
  45:"Sương mù",48:"Sương đóng băng",51:"Mưa phùn nhẹ",53:"Mưa phùn",55:"Mưa phùn dày",
  61:"Mưa nhẹ",63:"Mưa vừa",65:"Mưa to",80:"Mưa rào nhẹ",81:"Mưa rào vừa",82:"Mưa rào to",
  95:"Dông",96:"Dông + đá nhẹ",99:"Dông + đá to"
};

const LAT = 21.0285;
const LON = 105.8342;

export default function Weather() {
  const [current, setCurrent] = useState<Current | null>(null);
  const [hourly, setHourly] = useState<Hourly | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchWeather = async () => {
    setLoading(true);
    try {
      // 2 ngày, lấy hourly 48h
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,wind_speed_10m,weather_code&hourly=temperature_2m,precipitation_probability,weather_code&timezone=Asia%2FBangkok&forecast_days=2`;
      const res = await fetch(url);
      const json = await res.json();
      setCurrent(json.current);
      setHourly(json.hourly);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchWeather(); }, []);

  // lọc hourly từ thời điểm hiện tại trở đi (48h)
  const now = new Date();
  const hourlyFiltered = (() => {
    if (!hourly) return [];
    const idx = hourly.time.findIndex(t => new Date(t) >= now);
    const start = idx === -1? 0 : idx;
    return hourly.time.slice(start, start + 48).map((t, i) => ({
      time: t,
      temp: hourly.temperature_2m[start + i],
      rain: hourly.precipitation_probability[start + i],
      code: hourly.weather_code[start + i],
    }));
  })();

  // group theo ngày để dễ đọc
  const grouped = hourlyFiltered.reduce((acc: Record<string, typeof hourlyFiltered>, cur) => {
    const day = new Date(cur.time).toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit' });
    if (!acc[day]) acc[day] = [];
    acc[day].push(cur);
    return acc;
  }, {});

  return (
    <div className="weather-page">
      <div className="page-top-title">
        <div>
          <h1>Hà Nội <span style={{color:"#8b5cf6"}}>48h tới</span></h1>
          <p>Open-Meteo • tự động cập nhật theo giờ xem • {now.toLocaleString('vi-VN')}</p>
        </div>
      </div>

      <div className="kana-card weather-current">
        {loading? <div>Đang tải...</div> : current? (
          <>
            <div className="temp-big">{Math.round(current.temperature_2m)}°C</div>
            <div className="desc">{WMO[current.weather_code] || `Code ${current.weather_code}`}</div>
            <div className="meta">Gió {current.wind_speed_10m} km/h • Hà Nội • {new Date(current.time).toLocaleTimeString('vi-VN')}</div>
          </>
        ) : <div>Lỗi tải dữ liệu</div>}
      </div>

      <div className="kana-card weather-hourly">
        <h3>Dự báo theo giờ - 2 ngày (48h từ bây giờ)</h3>
        {Object.entries(grouped).map(([day, hours]) => (
          <div key={day} className="day-block">
            <div className="day-label">{day}</div>
            <div className="hourly-scroll">
              {hours.map(h => (
                <div key={h.time} className={`hour-item ${h.rain >= 30? 'has-rain' : ''} ${h.rain >= 60? 'heavy-rain' : ''}`}>
                  <div className="h-time">{new Date(h.time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</div>
                  <div className="h-temp">{Math.round(h.temp)}°</div>
                  <div className="h-code">{WMO[h.code]?.slice(0,8) || h.code}</div>
                  <div className="h-rain">{h.rain}%</div>
                </div>
              ))}
            </div>
          </div>
        ))}
        <button className="fetch-btn" style={{marginTop:12, width:'100%'}} onClick={fetchWeather}>Làm mới</button>
      </div>
    </div>
  );
}
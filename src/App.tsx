import { useEffect, useState } from "react";
import {
  CITIES,
  buildUrl,
  formatDay,
  formatUpdated,
  getWeatherInfo,
  type WeatherResponse,
} from "./data";
import "./App.css";

type Status = "idle" | "loading" | "error" | "success";

export default function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [data, setData] = useState<WeatherResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [reloadKey, setReloadKey] = useState<number>(0);

  const selectedCity = CITIES.find((c) => c.id === selectedId) ?? null;

  useEffect(() => {
    if (selectedCity === null) return;

    const controller = new AbortController();
    setStatus("loading");

    fetch(buildUrl(selectedCity), { signal: controller.signal })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Máy chủ trả về lỗi ${res.status}`);
        }
        return res.json() as Promise<WeatherResponse>;
      })
      .then((json) => {
        setData(json);
        setStatus("success");
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setErrorMsg(err instanceof Error ? err.message : "Không thể kết nối");
        setStatus("error");
      });

    return () => controller.abort();
  }, [selectedCity, reloadKey]);

  return (
    <div className="app">
      <h1>Thời tiết Việt Nam</h1>

      <div className="layout">
        <nav className="cities" aria-label="Danh sách thành phố">
          <ul>
            {CITIES.map((c) => (
              <li key={c.id}>
                <button
                  className={c.id === selectedId ? "city active" : "city"}
                  onClick={() => setSelectedId(c.id)}
                  aria-current={c.id === selectedId}
                >
                  {c.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <main className="panel">
          {status === "idle" && (
            <p className="state">Chọn một thành phố để xem thời tiết.</p>
          )}

          {status === "loading" && (
            <p className="state" role="status">
              Đang tải thời tiết {selectedCity?.name}…
            </p>
          )}

          {status === "error" && (
            <div className="state" role="alert">
              <p>Không tải được dữ liệu: {errorMsg}.</p>
              <button className="retry" onClick={() => setReloadKey(reloadKey + 1)}>
                Thử lại
              </button>
            </div>
          )}

          {status === "success" && data !== null && (
            <>
              <section className="now">
                <h2>{selectedCity?.name}</h2>
                <p className="now-main">
                  <span className="icon">
                    {getWeatherInfo(data.current.weather_code).icon}
                  </span>
                  <span className="temp">
                    {Math.round(data.current.temperature_2m)}°C
                  </span>
                </p>
                <p>{getWeatherInfo(data.current.weather_code).label}</p>
                <ul className="stats">
                  <li>Độ ẩm: {data.current.relative_humidity_2m}%</li>
                  <li>Tốc độ gió: {data.current.wind_speed_10m} km/h</li>
                  <li>Cập nhật lúc: {formatUpdated(data.current.time)}</li>
                </ul>
              </section>

              <section className="forecast-box" aria-label="Dự báo 7 ngày">
                <h3>Dự báo 7 ngày</h3>
                <ul className="forecast">
                  {data.daily.time.map((t, i) => {
                    const day = formatDay(t);
                    const info = getWeatherInfo(data.daily.weather_code[i]);
                    return (
                      <li key={t} className={i === 0 ? "today" : ""}>
                        <span className="dow">{day.dow}</span>
                        <span className="date">{day.date}</span>
                        <span className="icon-sm" title={info.label}>
                          {info.icon}
                        </span>
                        <span className="range">
                          <b>{Math.round(data.daily.temperature_2m_max[i])}°</b>
                          <span> / {Math.round(data.daily.temperature_2m_min[i])}°</span>
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
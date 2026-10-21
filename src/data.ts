export type City = {
    id: string;
    name: string;
    lat: number;
    lon: number;
};

export const CITIES: City[] = [
    {id:"hanoi", name:"Hà Nội", lat:21.0285, lon:105.8542},
    {id:"hcm", name:"TP.Hồ Chí Minh", lat:10.7769, lon:106.7009},
    {id:"danang", name:"Đà Nẵng", lat:16.0544, lon:108.2022},
    {id:"hue", name:"Huế", lat:16.4637, lon:107.5909},
    {id:"cantho", name:"Cần Thơ", lat:10.0452, lon:105.7469},
    {id:"nhatrang", name:"Nha Trang", lat:12.2388, lon:109.1967},
    {id:"haiphong", name:"Hải Phòng", lat:20.8449, lon:106.6881},
    {id:"dalat", name:"Đà Lạt", lat:11.9404, lon:108.4583},
];

export type WeatherInfo = {
    icon: string;
    label: string;
};

const WEATHER_INFO: Record<number, WeatherInfo> = {
    0: {icon:"☀️", label:"Trời quang"},
    1: {icon:"🌤️", label:"Ít mây"},
    2: {icon:"⛅", label:"Mây rải rác"},
    3: {icon:"☁️", label:"Mây nhiều"},
    45: {icon:"🌫️", label:"Sương mù"},
    48: {icon:"🌫️", label:"Sương mù đóng băng"},
    51: {icon:"🌦️", label:"Mưa phùn nhẹ"},
    53: {icon:"🌦️", label:"Mưa phùn"},
    55: {icon:"🌦️", label:"Mưa phùn dày"},
    61: {icon:"🌧️", label:"Mưa nhỏ"},
    63: {icon:"🌧️", label:"Mưa vừa"},
    65: {icon:"🌧️", label:"Mưa to"},
    80: {icon:"🌦️", label:"Mưa rào nhẹ"},
    81: {icon:"🌦️", label:"Mưa rào"},
    82: {icon:"🌦️", label:"Mưa rào to"},
    95: {icon:"⛈️", label:"Giông bão"},
    96: {icon:"⛈️", label:"Giông bão kèm mưa đá"},
    99: {icon:"⛈️", label:"Giông bão kèm mưa đá lớn"},
};

export function getWeatherInfo(code: number): WeatherInfo {
    return WEATHER_INFO[code] ?? {icon:"❓", label:"Không xác định"};
}



export type WeatherResponse = {
  current: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    weather_code: number;
    wind_speed_10m: number;
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  };
};

export function buildUrl(city: City): string {
  return (
    "https://api.open-meteo.com/v1/forecast" +
    `?latitude=${city.lat}&longitude=${city.lon}` +
    "&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m" +
    "&daily=weather_code,temperature_2m_max,temperature_2m_min" +
    "&timezone=Asia%2FHo_Chi_Minh&forecast_days=7"
  );
}

export function formatUpdated(iso: string): string {
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getHours())}:${p(d.getMinutes())} ${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()}`;
}

const DAY_NAMES = [
  "Chủ nhật",
  "Thứ hai",
  "Thứ ba",
  "Thứ tư",
  "Thứ năm",
  "Thứ sáu",
  "Thứ bảy",
];

export function formatDay(isoDate: string): { dow: string; date: string } {
  const d = new Date(isoDate + "T00:00:00");
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return { dow: DAY_NAMES[d.getDay()], date: `${dd}/${mm}` };
}
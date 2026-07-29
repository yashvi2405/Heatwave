import { useEffect, useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { getWeatherData } from '../api';

const HEATWAVE_THRESHOLD = 40;

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass px-4 py-3 text-sm">
        <p className="text-slate-400 mb-1 text-xs">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }} className="font-semibold">
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getWeatherData(30);
      const formatted = res.data.data.map((row) => ({
        ...row,
        date:        new Date(row.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
        temperature: Number(row.temperature),
        humidity:    Number(row.humidity),
      }));
      setWeatherData(formatted);
    } catch (err) {
      console.error(err);
      setError('Could not load weather data. Is the backend server running?');
    } finally {
      setLoading(false);
    }
  };

  const latest        = weatherData[weatherData.length - 1];
  const maxTemp       = Math.max(...weatherData.map((d) => d.temperature), 0);
  const heatwaveCount = weatherData.filter((d) => d.temperature > HEATWAVE_THRESHOLD).length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 fade-in-up" id="dashboard-page">
      <div className="mb-10">
        <h1 className="font-display text-4xl font-extrabold text-white mb-2">Dashboard</h1>
        <p className="text-slate-400 text-sm">Live temperature and humidity trends with heatwave analysis</p>
      </div>

      {error && (
        <div id="dashboard-error" className="glass border border-red-500/30 text-red-400 p-4 rounded-xl mb-6 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div id="dashboard-loading" className="flex items-center gap-3 text-slate-400 mt-20 justify-center text-sm">
          <div className="w-4 h-4 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
          Loading data...
        </div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
            <StatCard
              label="Latest Temperature"
              value={latest ? `${latest.temperature}°C` : 'N/A'}
              alert={latest && latest.temperature > HEATWAVE_THRESHOLD}
              sub={latest ? latest.location : ''}
            />
            <StatCard
              label="Latest Humidity"
              value={latest ? `${latest.humidity}%` : 'N/A'}
              sub={latest ? latest.date : ''}
            />
            <StatCard
              label="Heatwave Readings"
              value={`${heatwaveCount} / ${weatherData.length}`}
              alert={heatwaveCount > 0}
              sub={`Peak: ${maxTemp}°C`}
            />
          </div>

          {/* Temperature chart */}
          <div className="glass p-6 mb-6">
            <h2 className="font-display font-semibold text-white text-base mb-1">Temperature Trend</h2>
            <p className="text-slate-500 text-xs mb-6">Degrees Celsius over time</p>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={weatherData}>
                <defs>
                  <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#f97316" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={['dataMin - 3', 'dataMax + 3']} tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ color: '#64748b', fontSize: 12 }} />
                <ReferenceLine
                  y={HEATWAVE_THRESHOLD}
                  label={{ value: '40°C Threshold', fill: '#ef4444', fontSize: 10 }}
                  stroke="#ef4444"
                  strokeDasharray="5 4"
                  strokeWidth={1}
                />
                <Area
                  type="monotone"
                  dataKey="temperature"
                  name="Temperature (°C)"
                  stroke="#f97316"
                  strokeWidth={2}
                  fill="url(#tempGrad)"
                  dot={{ fill: '#f97316', strokeWidth: 0, r: 3 }}
                  activeDot={{ r: 5, fill: '#f97316' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Humidity chart */}
          <div className="glass p-6">
            <h2 className="font-display font-semibold text-white text-base mb-1">Humidity Trend</h2>
            <p className="text-slate-500 text-xs mb-6">Relative humidity percentage over time</p>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={weatherData}>
                <defs>
                  <linearGradient id="humGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ color: '#64748b', fontSize: 12 }} />
                <Area
                  type="monotone"
                  dataKey="humidity"
                  name="Humidity (%)"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="url(#humGrad)"
                  dot={{ fill: '#3b82f6', strokeWidth: 0, r: 3 }}
                  activeDot={{ r: 5, fill: '#3b82f6' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ label, value, alert, sub }) {
  return (
    <div
      className="glass p-6 relative overflow-hidden transition-all duration-300 hover:scale-[1.02]"
      style={alert ? { borderColor: 'rgba(249,115,22,0.4)', boxShadow: '0 0 24px rgba(249,115,22,0.12)' } : {}}
    >
      {alert && (
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/8 to-transparent pointer-events-none" />
      )}
      {alert && (
        <span
          className="absolute top-4 right-4 text-xs font-semibold px-2 py-0.5 rounded-full text-orange-300"
          style={{ background: 'rgba(249,115,22,0.18)' }}
        >
          Alert
        </span>
      )}
      <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-2">{label}</p>
      <p className={`text-3xl font-display font-bold ${alert ? 'text-orange-400' : 'text-white'}`}>{value}</p>
      {sub && <p className="text-slate-600 text-xs mt-2">{sub}</p>}
    </div>
  );
}

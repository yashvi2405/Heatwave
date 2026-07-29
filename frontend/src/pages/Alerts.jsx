import { useEffect, useState } from 'react';
import { getAlerts } from '../api';

const levelConfig = {
  Low:      { border: 'rgba(34,197,94,0.2)',  bg: 'rgba(34,197,94,0.05)',  text: '#4ade80', dot: '#22c55e' },
  Moderate: { border: 'rgba(234,179,8,0.25)', bg: 'rgba(234,179,8,0.05)',  text: '#facc15', dot: '#eab308' },
  High:     { border: 'rgba(249,115,22,0.3)', bg: 'rgba(249,115,22,0.07)', text: '#fb923c', dot: '#f97316' },
  Severe:   { border: 'rgba(239,68,68,0.4)',  bg: 'rgba(239,68,68,0.08)',  text: '#f87171', dot: '#ef4444' },
};

export default function Alerts() {
  const [alerts,  setAlerts]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => { fetchAlerts(); }, []);

  const fetchAlerts = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getAlerts();
      setAlerts(res.data.alerts);
    } catch (err) {
      console.error(err);
      setError('Could not load alerts. Is the backend server running?');
    } finally {
      setLoading(false);
    }
  };

  const severeCnt = alerts.filter((a) => a.level === 'Severe').length;
  const highCnt   = alerts.filter((a) => a.level === 'High').length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 fade-in-up" id="alerts-page">
      {/* Header */}
      <div className="flex items-start justify-between mb-10 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-4xl font-extrabold text-white mb-2">Alerts</h1>
          <p className="text-slate-400 text-sm">
            Warnings automatically generated when predictions cross safe temperature thresholds
          </p>
        </div>
        <button
          onClick={fetchAlerts}
          id="refresh-alerts"
          className="btn-secondary text-sm flex items-center gap-2"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={loading ? 'animate-spin' : ''}>
            <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
          </svg>
          Refresh
        </button>
      </div>

      {/* Summary */}
      {alerts.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-8">
          <Pill count={alerts.length} label="Total" color="#94a3b8" />
          {severeCnt > 0 && <Pill count={severeCnt} label="Severe" color="#f87171" />}
          {highCnt   > 0 && <Pill count={highCnt}   label="High"   color="#fb923c" />}
        </div>
      )}

      {error && (
        <div id="alerts-error" className="glass border border-red-500/30 text-red-400 p-4 rounded-xl mb-6 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div id="alerts-loading" className="flex items-center gap-3 text-slate-400 mt-20 justify-center text-sm">
          <div className="w-4 h-4 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
          Loading alerts...
        </div>
      ) : alerts.length === 0 ? (
        <div id="no-alerts" className="glass p-16 text-center">
          <div
            className="w-14 h-14 rounded-2xl mx-auto mb-5 flex items-center justify-center"
            style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <h3 className="font-display text-lg font-bold text-white mb-2">All Clear</h3>
          <p className="text-slate-400 text-sm">No heatwave alerts have been recorded yet.</p>
        </div>
      ) : (
        <ul id="alerts-list" className="space-y-3">
          {alerts.map((alert, i) => {
            const cfg = levelConfig[alert.level] || levelConfig.Low;
            return (
              <li
                key={alert._id || alert.id || i}
                className="rounded-xl p-5 transition-all duration-200 hover:scale-[1.005]"
                style={{ border: `1px solid ${cfg.border}`, background: cfg.bg }}
              >
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-2 h-2 rounded-full inline-block"
                      style={{ background: cfg.dot, boxShadow: `0 0 6px ${cfg.dot}` }}
                    />
                    <span
                      className="text-xs font-semibold uppercase tracking-widest"
                      style={{ color: cfg.text }}
                    >
                      {alert.level}
                    </span>
                  </div>
                  <span className="text-xs text-slate-600">
                    {new Date(alert.date).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric',
                    })}
                  </span>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">{alert.message}</p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function Pill({ count, label, color }) {
  return (
    <div
      className="px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5"
      style={{ background: `${color}14`, color, border: `1px solid ${color}35` }}
    >
      <span className="font-bold">{count}</span> {label}
    </div>
  );
}

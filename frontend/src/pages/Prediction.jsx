import { useState } from 'react';
import { predictHeatwave } from '../api';

const levelConfig = {
  Low:      { border: 'rgba(34,197,94,0.3)',  bg: 'rgba(34,197,94,0.07)',   text: '#4ade80', label: 'Low Risk' },
  Moderate: { border: 'rgba(234,179,8,0.3)',  bg: 'rgba(234,179,8,0.07)',   text: '#facc15', label: 'Moderate Risk' },
  High:     { border: 'rgba(249,115,22,0.3)', bg: 'rgba(249,115,22,0.08)',  text: '#fb923c', label: 'High Risk' },
  Severe:   { border: 'rgba(239,68,68,0.4)',  bg: 'rgba(239,68,68,0.09)',   text: '#f87171', label: 'Severe Risk' },
};

const riskWidth = { Low: '25%', Moderate: '50%', High: '75%', Severe: '100%' };

export default function Prediction() {
  const [temperature, setTemperature] = useState('');
  const [humidity,    setHumidity]    = useState('');
  const [location,    setLocation]    = useState('');
  const [result,      setResult]      = useState(null);
  const [error,       setError]       = useState('');
  const [loading,     setLoading]     = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    if (temperature === '' || isNaN(temperature)) {
      setError('Please enter a valid temperature value.');
      return;
    }

    setLoading(true);
    try {
      const res = await predictHeatwave({
        temperature: parseFloat(temperature),
        humidity:    humidity !== '' ? parseFloat(humidity) : undefined,
        location,
      });
      setResult(res.data.prediction);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Could not get a prediction. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  const cfg = result ? (levelConfig[result.level] || levelConfig.Low) : null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 fade-in-up" id="prediction-page">
      {/* Header */}
      <div className="mb-10">
        <h1 className="font-display text-4xl font-extrabold text-white mb-3">Heatwave Prediction</h1>
        <p className="text-slate-400 text-sm leading-relaxed">
          Enter current weather readings to assess the heatwave risk level for a location.
        </p>
      </div>

      {/* Form */}
      <div className="glass p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="temp" className="block text-sm font-medium text-slate-300 mb-2">
              Temperature (°C) <span className="text-orange-400">*</span>
            </label>
            <input
              type="number"
              step="0.1"
              id="temp"
              name="temperature"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              placeholder="e.g. 42.5"
              className="dark-input"
              required
            />
          </div>

          <div>
            <label htmlFor="humidity" className="block text-sm font-medium text-slate-300 mb-2">
              Humidity (%) <span className="text-slate-500 font-normal">— optional</span>
            </label>
            <input
              type="number"
              step="0.1"
              id="humidity"
              name="humidity"
              value={humidity}
              onChange={(e) => setHumidity(e.target.value)}
              placeholder="e.g. 35"
              className="dark-input"
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-slate-300 mb-2">
              Location <span className="text-slate-500 font-normal">— optional</span>
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Mumbai"
              className="dark-input"
            />
          </div>

          <button
            type="submit"
            id="predict"
            disabled={loading}
            className="btn-primary w-full text-sm"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                Analyzing...
              </span>
            ) : (
              'Run Prediction'
            )}
          </button>
        </form>
      </div>

      {/* Error */}
      {error && (
        <div id="prediction-error" className="mt-5 glass border border-red-500/30 text-red-400 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Result */}
      {result && cfg && (
        <div
          id="result"
          className="mt-5 rounded-xl p-7 fade-in-up"
          style={{ border: `1px solid ${cfg.border}`, background: cfg.bg }}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-slate-400 text-xs uppercase tracking-widest mb-1">Result</p>
              <h2 className="font-display text-xl font-bold" style={{ color: cfg.text }}>
                {result.heatwave ? 'Heatwave Detected' : 'Conditions Normal'}
              </h2>
            </div>
            <span
              id="result-level"
              className="text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full"
              style={{ color: cfg.text, border: `1px solid ${cfg.border}` }}
            >
              {cfg.label}
            </span>
          </div>

          <p id="result-message" className="text-slate-300 text-sm leading-relaxed mb-6">{result.message}</p>

          {/* Risk bar */}
          <div>
            <div className="flex justify-between text-xs text-slate-500 mb-1.5">
              <span>Risk level</span>
              <span style={{ color: cfg.text }}>{result.level}</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: riskWidth[result.level], background: cfg.text }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

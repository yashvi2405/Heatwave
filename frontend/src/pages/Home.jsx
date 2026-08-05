// import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet'; // ✅ ADD THIS

const features = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    title: 'Live Dashboard',
    desc: 'Visualize real-time temperature and humidity trends with interactive dark-mode charts.',
    color: 'from-blue-500/20 to-blue-600/5',
    border: 'rgba(59,130,246,0.2)',
    iconColor: '#3b82f6',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
      </svg>
    ),
    title: 'Heatwave Prediction',
    desc: 'Enter live weather readings and instantly assess heatwave risk with a rule-based engine.',
    color: 'from-orange-500/20 to-orange-600/5',
    border: 'rgba(249,115,22,0.2)',
    iconColor: '#f97316',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
    title: 'Instant Alerts',
    desc: 'Automatic severity-graded warnings are stored in MongoDB whenever temperatures cross safe thresholds.',
    color: 'from-red-500/20 to-red-600/5',
    border: 'rgba(239,68,68,0.2)',
    iconColor: '#ef4444',
  },
];

const steps = [
  { num: '01', text: 'Weather readings (temperature, humidity, location) are submitted via the Prediction form.' },
  { num: '02', text: 'The rule-based engine checks each reading against the 40°C heatwave threshold.' },
  { num: '03', text: 'A severity-graded alert is created and stored automatically in MongoDB.' },
  { num: '04', text: 'The Dashboard and Alerts pages update so communities can stay informed.' },
];

export default function Home() {
  return (
    <>
      {/* ✅ SEO TAGS */}
      <Helmet>
        <title>Heatwave Monitor | Real-Time Heat Risk Platform</title>

        {/* Meta Tags */}
        <meta
          name="description"
          content="Real-time heatwave monitoring, prediction, and alerts. Track temperature and humidity trends and stay safe from extreme heat."
        />
        <meta
          name="keywords"
          content="heatwave monitoring, weather tracking, temperature prediction, humidity analysis, climate alerts"
        />
        <meta name="robots" content="index, follow" />

        {/* Open Graph (for sharing) */}
        <meta property="og:title" content="Heatwave Monitor Platform" />
        <meta property="og:description" content="Track and predict heatwaves in real time." />
        <meta property="og:type" content="website" />

      </Helmet>

      <div className="hero-bg" id="home-page">
        {/* Hero */}
        <section className="max-w-6xl mx-auto px-4 pt-24 pb-20 text-center fade-in-up">
          <h1 className="text-5xl md:text-7xl font-display font-extrabold leading-tight mb-6 text-white">
            Stay Ahead of the{' '}
            <span className="gradient-text">Heat</span>
          </h1>

          <p className="text-slate-400 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed mb-10">
            A real-time platform to track temperature and humidity, predict heatwave
            conditions, and alert communities before extreme heat strikes.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            {/* ✅ Anchor + Title for SEO */}
            <Link to="/prediction" id="cta-predict" title="Run Heatwave Prediction Tool" className="btn-primary text-base px-8 py-3.5">
              Run a Prediction
            </Link>

            <Link to="/dashboard" title="View Weather Dashboard" className="btn-secondary text-base px-8 py-3.5">
              View Dashboard
            </Link>
          </div>

          <div className="mt-20 opacity-20 pointer-events-none select-none">
            <svg viewBox="0 0 800 80" className="w-full max-w-2xl mx-auto" fill="none" stroke="#f97316" strokeWidth="2">
              <polyline points="0,70 100,50 180,60 260,30 340,45 420,10 500,25 580,5 680,20 800,15" />
            </svg>
          </div>
        </section>

        {/* Feature cards */}
        <section className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="glass p-7 hover:scale-[1.02] transition-all duration-300 cursor-default"
                style={{ borderColor: f.border }}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-gradient-to-br ${f.color}`}
                  style={{ color: f.iconColor }}
                >
                  {f.icon}
                </div>

                {/* ✅ Proper Heading Tag */}
                <h2 className="font-display font-bold text-white text-lg mb-2">{f.title}</h2>

                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="max-w-6xl mx-auto px-4 py-16">
          <div className="glass p-10">
            <h2 className="font-display text-3xl font-bold text-white mb-2">How it works</h2>
            <p className="text-slate-500 mb-10 text-sm">Four steps from reading to alert</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((s, i) => (
                <div key={i} className="relative">
                  <div
                    className="text-5xl font-display font-extrabold mb-4 leading-none"
                    style={{ WebkitTextStroke: '1px rgba(249,115,22,0.35)', color: 'transparent' }}
                  >
                    {s.num}
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="h-16" />
      </div>
    </>
  );
}
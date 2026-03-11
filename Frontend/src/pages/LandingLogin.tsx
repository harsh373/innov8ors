import { useState } from "react";
import { SignIn, SignUp } from "@clerk/clerk-react";
import { ShieldCheck, MapPin, BrainCircuit, Users, AlertTriangle, BarChart3, ChevronRight } from "lucide-react";

export default function LandingLogin() {
  const [authMode, setAuthMode] = useState<"landing" | "signin" | "signup">("landing");

  if (authMode === "signin") {
    return (
      <AuthWrapper onBack={() => setAuthMode("landing")} title="Welcome back" subtitle="Sign in to your FairPrice AI account">
        <SignIn appearance={{ elements: clerkStyles }}  />
        <p className="text-center text-sm text-gray-500 mt-4">
          No account?{" "}
          <button onClick={() => setAuthMode("signup")} className="text-blue-600 font-semibold hover:underline">
            Sign up free
          </button>
        </p>
      </AuthWrapper>
    );
  }

  if (authMode === "signup") {
    return (
      <AuthWrapper onBack={() => setAuthMode("landing")} title="Join FairPrice AI" subtitle="Start monitoring Delhi market prices today">
        <SignUp appearance={{ elements: clerkStyles }}  />
        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{" "}
          <button onClick={() => setAuthMode("signin")} className="text-blue-600 font-semibold hover:underline">
            Sign in
          </button>
        </p>
      </AuthWrapper>
    );
  }

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="min-h-screen bg-white overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .float { animation: float 4s ease-in-out infinite; }
        .fade-1 { animation: fadeUp 0.5s 0.05s ease both; }
        .fade-2 { animation: fadeUp 0.5s 0.15s ease both; }
        .fade-3 { animation: fadeUp 0.5s 0.25s ease both; }
        .fade-4 { animation: fadeUp 0.5s 0.38s ease both; }
        .fade-5 { animation: fadeUp 0.5s 0.5s ease both; }
      `}</style>

      {/* Navbar */}
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <ShieldCheck size={17} className="text-white" />
          </div>
          <span style={{ fontWeight: 800 }} className="text-lg text-gray-900">FairPrice AI</span>
        </div>

      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="fade-1 inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
              Live across 7 Delhi Mandis
            </div>

            <h1 className="fade-2 text-4xl sm:text-5xl lg:text-[52px] leading-[1.15] mb-5" style={{ fontWeight: 800, color: '#0f172a' }}>
              Is the price<br />
              <span style={{ color: '#2563eb' }}>actually fair?</span>
            </h1>

            <p className="fade-3 text-base sm:text-lg text-gray-500 leading-relaxed mb-8 max-w-lg">
              FairPrice AI uses machine learning to detect price anomalies across Delhi's major markets — empowering citizens to report and verify commodity prices in real time.
            </p>

            <div className="fade-4 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setAuthMode("signup")}
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white px-7 py-3.5 rounded-xl font-semibold text-base shadow-lg shadow-blue-100 transition-all"
              >
                Start Monitoring Free <ChevronRight size={17} />
              </button>
              <button
                onClick={() => setAuthMode("signin")}
                className="flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-700 px-7 py-3.5 rounded-xl font-semibold text-base border border-gray-200 transition-colors"
              >
                Sign In
              </button>
            </div>

            <div className="fade-5 mt-10 flex items-center gap-8">
              {[{ value: '7', label: 'Delhi Markets' }, { value: 'ML', label: 'AI Powered' }, { value: 'Live', label: 'Price Data' }].map((s) => (
                <div key={s.label}>
                  <div className="text-2xl text-gray-900" style={{ fontWeight: 800 }}>{s.value}</div>
                  <div className="text-xs text-gray-400 font-medium mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Floating Card */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative w-80">
              <div className="absolute inset-0 bg-blue-50 rounded-3xl rotate-3" />
              <div className="relative bg-white rounded-3xl shadow-xl border border-gray-100 p-6 float">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-bold text-gray-800">Azadpur Market</span>
                  <span className="text-xs bg-red-50 text-red-600 font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                    <AlertTriangle size={10} /> Spike
                  </span>
                </div>
                <div className="space-y-2.5 mb-4">
                  {[
                    { name: 'Tomato', actual: '₹68', ai: '₹45', up: true },
                    { name: 'Onion', actual: '₹32', ai: '₹30', up: false },
                    { name: 'Potato', actual: '₹28', ai: '₹27', up: false },
                  ].map((item) => (
                    <div key={item.name} className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-xl">
                      <span className="text-xs font-semibold text-gray-700">{item.name}</span>
                      <div className="flex items-center gap-1.5 text-xs font-semibold">
                        <span className="text-gray-900">{item.actual}</span>
                        <span className="text-gray-300">→</span>
                        <span className={item.up ? 'text-red-500' : 'text-green-500'}>{item.ai} AI</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-xl">
                  <BrainCircuit size={15} className="text-blue-600 shrink-0 mt-0.5" />
                  <span className="text-xs text-blue-700 font-medium leading-relaxed">Gemini AI: Seasonal price manipulation detected</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 border-y border-gray-100 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">How it works</p>
            <h2 className="text-3xl sm:text-4xl text-gray-900 mb-3" style={{ fontWeight: 800 }}>
              Price intelligence, simplified
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto text-base">
              Community reporting combined with ML models to keep Delhi's markets transparent
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Users, bg: 'bg-blue-50', color: 'text-blue-600', title: 'Community Reports', desc: 'Citizens report real prices from their local markets every day' },
              { icon: BrainCircuit, bg: 'bg-violet-50', color: 'text-violet-600', title: 'ML Analysis', desc: 'Model compares prices against historical benchmarks instantly' },
              { icon: AlertTriangle, bg: 'bg-orange-50', color: 'text-orange-500', title: 'Anomaly Alerts', desc: 'Unusual price spikes trigger alerts on the admin dashboard' },
              { icon: MapPin, bg: 'bg-green-50', color: 'text-green-600', title: 'Market Map', desc: 'Live map of all 7 Delhi mandis with deviation indicators' },
            ].map((f) => (
              <div key={f.title} className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md transition-shadow">
                <div className={`w-10 h-10 ${f.bg} rounded-xl flex items-center justify-center mb-4`}>
                  <f.icon size={19} className={f.color} />
                </div>
                <h3 className="font-bold text-gray-900 mb-1.5 text-sm">{f.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center mb-6">
            Covering 7 Major Delhi Mandis
          </p>
          <div className="flex flex-wrap justify-center gap-2.5">
            {['Azadpur', 'Daryaganj', 'Ghazipur', 'INA Market', 'Keshopur', 'Okhla', 'Rohini'].map((m) => (
              <div key={m} className="flex items-center gap-2 bg-white border border-gray-100 rounded-full px-4 py-2 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
                <span className="text-sm font-semibold text-gray-700">{m}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      <section className="pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-blue-600 rounded-3xl p-10 sm:p-14 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-56 h-56 bg-white/5 rounded-full -translate-y-16 translate-x-16" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-12 -translate-x-12" />
            <div className="relative">
              <BarChart3 size={32} className="text-blue-200 mx-auto mb-4" />
              <h2 className="text-2xl sm:text-3xl text-white mb-3" style={{ fontWeight: 800 }}>
                Start reporting prices today
              </h2>
              <p className="text-blue-100 text-sm sm:text-base mb-8 max-w-md mx-auto leading-relaxed">
                Help make Delhi's markets more transparent with AI-powered price intelligence.
              </p>
              <button
                onClick={() => setAuthMode("signup")}
                className="bg-white text-blue-600 font-bold px-8 py-3.5 rounded-xl hover:bg-blue-50 active:scale-95 transition-all shadow-lg text-sm sm:text-base"
              >
                Get Started Free →
              </button>
            </div>
          </div>
        </div>
      </section>

      
      <footer className="border-t border-gray-100 py-7">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center">
              <ShieldCheck size={13} className="text-white" />
            </div>
            <span className="font-bold text-gray-700 text-sm">FairPrice AI</span>
          </div>
          <p className="text-xs text-gray-400">Built for Delhi. Powered by ML + Gemini AI.</p>
        </div>
      </footer>
    </div>
  );
}

const AuthWrapper = ({ children, onBack, title, subtitle }: {
  children: React.ReactNode;
  onBack: () => void;
  title: string;
  subtitle: string;
}) => (
  <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="min-h-screen bg-white flex flex-col">
    <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');`}</style>
    <nav className="max-w-6xl mx-auto px-4 sm:px-6 py-5 w-full flex items-center justify-between">
      <button onClick={onBack} className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <ShieldCheck size={17} className="text-white" />
        </div>
        <span style={{ fontWeight: 800 }} className="text-lg text-gray-900">FairPrice AI</span>
      </button>
      <button onClick={onBack} className="text-sm font-semibold text-gray-400 hover:text-gray-700 transition-colors">
        ← Back
      </button>
    </nav>
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
      <div className="text-center mb-6">
        <h1 className="text-3xl text-gray-900 mb-1" style={{ fontWeight: 800 }}>{title}</h1>
        <p className="text-gray-500 text-sm">{subtitle}</p>
      </div>
      {children}
    </div>
  </div>
);

const clerkStyles = {
  card: "bg-white border border-gray-100 rounded-2xl shadow-xl",
  headerTitle: "text-gray-900 font-bold",
  headerSubtitle: "text-gray-500",
  socialButtonsBlockButton: "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl",
  formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl",
  footerActionText: "text-gray-500",
  footerActionLink: "text-blue-600 hover:text-blue-700 font-semibold",
  formFieldInput: "bg-white border border-gray-200 text-gray-900 focus:border-blue-500 rounded-xl",
  formFieldLabel: "text-gray-700 font-medium",
  dividerLine: "bg-gray-200",
  dividerText: "text-gray-400",
};
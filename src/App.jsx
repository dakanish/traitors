import { useState, useRef } from 'react';

// Your live Google Apps Script URL
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyeCqMBQkT9llWo3uYC8ebqGK2FrLBYEGXSlgBNozmM4VPYMQExPxEuZKiDvCllvzrC/exec";

export default function App() {
  const [pin, setPin] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [attending, setAttending] = useState(null);
  const [allergies, setAllergies] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const audioRef = useRef(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (audioRef.current) {
      audioRef.current.play().catch(() => console.log("Audio requires interaction first."));
    }
    
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${SCRIPT_URL}?pin=${pin}`);
      const data = await response.json();
      
      if (data.success) {
        setName(data.name);
      } else {
        setError('Identity not recognized. Try again.');
      }
    } catch (err) {
      setError('Connection lost to the castle. Try again.');
    }
    
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({
          name: name,
          attending: attending,
          allergies: allergies
        })
      });
      setSubmitted(true);
    } catch (err) {
      setSubmitted(true);
    }
    
    setLoading(false);
  };

  const TraitorLogo = () => (
    <svg width="75" height="90" viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-4 drop-shadow-[0_0_15px_rgba(217,119,6,0.4)]">
      <path d="M50 5C25 5 12 25 12 55C12 75 22 95 32 110C35 115 38 118 42 118H58C62 118 65 115 68 110C78 95 88 75 88 55C88 25 75 5 50 5Z" fill="#D97706" fillOpacity="0.15" stroke="#D97706" strokeWidth="3" strokeLinejoin="round"/>
      <path d="M50 5L82 45C85 65 72 85 58 95C54 98 46 98 42 95C28 85 15 65 18 45L50 5Z" fill="#2A080C" stroke="#D97706" strokeWidth="2.5"/>
      <path d="M30 42C35 38 45 35 50 35C55 35 65 38 70 42C75 52 72 72 58 78C54 80 46 80 42 78C28 72 25 52 30 42Z" fill="#150406"/>
      <path d="M36 46C40 44 46 45 49 47C52 45 58 44 62 46" stroke="#D97706" strokeWidth="2" strokeLinecap="round"/>
      <path d="M42 67C45 69 55 69 58 67" stroke="#D97706" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="50" cy="56" r="1.5" fill="#D97706"/>
    </svg>
  );

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#20000a] flex flex-col items-center justify-center p-4 text-center text-white font-serif">
        <TraitorLogo />
        <h1 className="text-4xl font-serif text-[#EC8A22] mb-4 tracking-wider uppercase">Your Fate is Sealed.</h1>
        <p className="text-xl text-slate-300 font-serif max-w-sm">
          {attending ? `The roundtable awaits, ${name}. Deception begins soon...` : `Cowardly, ${name}. You have chosen to watch from the shadows.`}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#4a021f] to-[#20000a] flex flex-col items-center justify-center p-4 text-white font-serif relative overflow-hidden">
      <audio ref={audioRef} src="/spooky-theme.mp3" loop />

      <div className="z-10 w-full max-w-md bg-[#2d0112]/95 p-8 rounded-lg border-2 border-[#e0660d]/30 shadow-[0_0_50px_rgba(0,0,0,0.9)] backdrop-blur-md">
        {!name ? (
          <form onSubmit={handleLogin} className="flex flex-col gap-6 items-center w-full">
            <TraitorLogo />

            <div className="text-center">
              <h1 className="text-3xl font-bold tracking-widest text-slate-100 uppercase">The Castle Awaits</h1>
              <p className="text-sm text-slate-400 italic mt-2">Enter your secret code to reveal your invitation.</p>
            </div>

            <div className="w-full relative">
              <input 
                type="password" 
                maxLength="4"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="* * * *" 
                className="w-full bg-[#1b000a] border-2 border-[#a51532] focus:border-[#EC8A22] p-4 text-center text-3xl font-bold outline-none rounded-md transition-all tracking-[0.7em] text-[#EC8A22] placeholder:text-red-900/40"
              />
              {error && <p className="text-red-500 text-center text-sm mt-2">{error}</p>}
            </div>

            <button type="submit" disabled={loading} className="w-full bg-[#350114] hover:bg-[#4a021f] disabled:bg-slate-900 text-[#EC8A22] border border-[#e0660d]/40 p-4 rounded uppercase tracking-widest font-bold transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)]">
              {loading ? "Verifying..." : "Reveal Identity >"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <h2 className="text-3xl text-center text-[#EC8A22] font-bold tracking-wider">WELCOME, {name.toUpperCase()}</h2>
            <p className="text-center text-slate-300 italic -mt-4">A feast of deceit & deception.</p>

            <div className="bg-[#1b000a]/80 p-5 rounded border border-[#e0660d]/20 text-center space-y-4">
              <h3 className="text-lg text-[#EC8A22] tracking-widest font-bold border-b border-[#e0660d]/20 pb-2 uppercase">The Traitors Banquet</h3>
              
              <div className="space-y-3 text-sm text-slate-200">
                <div>
                  <p className="font-bold text-[#EC8A22]">Banishment Burgundy Beef</p>
                  <p className="text-xs text-slate-400 italic">Rich stew served with rustic harvest vegetables</p>
                </div>
                <div className="border-t border-slate-900/60 pt-2">
                  <p className="font-bold text-[#EC8A22]">Devious Dark Chocolate Torte</p>
                  <p className="text-xs text-slate-400 italic">Served with raspberry coulis from the shadows</p>
                </div>
                <div className="border-t border-slate-900/60 pt-2">
                  <p className="font-bold text-[#EC8A22]">Faithful Feast Platters</p>
                  <p className="text-xs text-slate-400 italic">Assorted cheeses, bread, and poison-free bites</p>
                </div>
              </div>
            </div>

            <div className="text-center text-slate-300 text-sm space-y-1 my-2 border-y border-[#e0660d]/10 py-3">
              <p className="text-[#EC8A22] font-bold text-lg">Saturday, 8:00 PM</p>
              <p>The Castle (Our Place)</p>
            </div>

            <div className="flex gap-4">
              <button 
                type="button"
                onClick={() => setAttending(true)}
                className={`flex-1 p-3 border-2 rounded font-bold uppercase tracking-wider transition-all ${attending === true ? 'bg-[#e0660d]/20 border-[#EC8A22] text-[#EC8A22]' : 'border-slate-700 bg-transparent text-slate-400 hover:border-[#EC8A22]'}`}
              >
                100% Faithful
              </button>
              <button 
                type="button"
                onClick={() => setAttending(false)}
                className={`flex-1 p-3 border-2 rounded font-bold uppercase tracking-wider transition-all ${attending === false ? 'bg-red-950/40 border-red-800 text-red-500' : 'border-slate-700 bg-transparent text-slate-400 hover:border-red-900'}`}
              >
                Traitor (Decline)
              </button>
            </div>

            {attending && (
              <div className="mt-2 flex flex-col gap-2">
                <label className="text-xs text-[#EC8A22] tracking-wider uppercase font-bold">Any dietary requirements or allergies?</label>
                <textarea 
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  className="bg-[#1b000a] border border-slate-700 p-3 rounded outline-none focus:border-[#EC8A22] text-sm text-slate-200 resize-none h-20"
                  placeholder="e.g. No allergies, ready to dine..."
                />
              </div>
            )}

            <button 
              type="submit" 
              disabled={attending === null || loading}
              className="mt-2 bg-[#EC8A22] hover:bg-[#ff9c3a] disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 p-4 rounded uppercase tracking-widest font-bold transition-all shadow-[0_0_15px_rgba(236,138,34,0.3)]"
            >
              {loading ? "Sealing..." : "Seal My Fate"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
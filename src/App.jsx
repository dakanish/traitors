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
    
    // Play the Bradford roundtable audio track once right when they click Reveal your secret
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
    
    setLoading(true);
    setError('');

    try {
      // Fetch data directly from your Google Sheet 'Guests' tab
      const response = await fetch(`${SCRIPT_URL}?pin=${pin}`);
      const data = await response.json();
      
      if (data.success) {
        setName(data.name);
      } else {
        setError('Identity not recognised. Try again.');
      }
    } catch (err) {
      setError('Connection lost to the Bradford Court round table. Try again.');
    }
    
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Post the RSVP directly to your Google Sheet 'RSVPs' tab
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
      // Even if network glitches slightly on CORS, Google often still logs it
      setSubmitted(true);
    }
    
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#20000a] flex flex-col items-center justify-center p-4 text-center text-white">
        <div className="w-32 h-32 text-[#EC8A22] mb-6">
          <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full">
            <path d="M50,15 C20,40 25,65 50,85 C75,65 80,40 50,15 Z" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M50,16 C30,35 28,55 50,78 C72,55 70,35 50,16 Z M50,48 C43,48 40,54 41,58 C44,57 46,55 50,55 C54,55 56,57 59,58 C60,54 57,48 50,48 Z M50,60 C46,60 45,63 50,65 C55,63 54,60 50,60 Z" />
          </svg>
        </div>
        <h1 className="text-4xl font-serif text-[#EC8A22] mb-4 tracking-wider uppercase">Your Fate is Sealed.</h1>
        <p className="text-xl text-slate-300 font-serif max-w-sm">
          {attending ? `The final roundtable awaits, ${name}. Deception begins soon...` : `Cowardly, ${name}. You have chosen to watch from the shadows. I banish you forever.`}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#4a021f] to-[#20000a] flex flex-col items-center justify-center p-4 text-white font-serif relative overflow-hidden">
      {/* Audio player linked to your bradford-roundtable.mp3 file */}
      <audio ref={audioRef} src="/bradford-roundtable.mp3" />

      <div className="z-10 w-full max-w-md bg-[#2d0112]/95 p-8 rounded-lg border-2 border-[#e0660d]/30 shadow-[0_0_50px_rgba(0,0,0,0.9)] backdrop-blur-md">
        {!name ? (
          <form onSubmit={handleLogin} className="flex flex-col gap-6 items-center w-full">
            <div className="w-24 h-24 text-[#EC8A22]">
              <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full">
                <path d="M50,16 C23,37 25,62 50,82 C75,62 77,37 50,16 Z M50,22 C68,38 67,56 50,73 C33,56 32,38 50,22 Z" />
                <path d="M50,48 C44,48 41,53 43,57 C45,56 47,54 50,54 C53,54 55,56 57,57 C59,53 56,48 50,48 Z M45,60 C48,60 48,61 50,61 C52,61 52,60 55,60 C55,62 52,64 50,64 C48,64 45,62 45,60 Z" />
              </svg>
            </div>

            <div className="text-center">
              <h1 className="text-3xl font-bold tracking-widest text-slate-100 uppercase">The Bradford Court Round Table Awaits...</h1>
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
              {loading ? "Verifying..." : "Reveal your secret"}
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
                  <p className="font-bold text-[#EC8A22]">Banishement Jack O'Bert</p>
                  <p className="text-xs text-slate-400 italic">A carved disguise hiding a bubbling secret. Molten Camembert and roasted pumpkin, served with baguette for the ultimate round table dip</p>
                </div>
                <div className="border-t border-slate-900/60 pt-2">
                  <p className="font-bold text-[#EC8A22]">Traitor's Tipple</p>
                  <p className="text-xs text-slate-400 italic">Innocent on the surface, but crisp and deceptive. A refreshing pour to keep your wits sharp during the final banishment.</p>
                </div>
                <div className="border-t border-slate-900/60 pt-2">
                  <p className="font-bold text-[#EC8A22]">Shield & Provisions</p>
                  <p className="text-xs text-slate-400 italic">Arm yourself for the final: BYOB and extra snacks welcome at the castle doors.</p>
                </div>
              </div>
            </div>

            <div className="text-center text-slate-300 text-sm space-y-1 my-2 border-y border-[#e0660d]/10 py-3">
              <p className="text-[#EC8A22] font-bold text-lg">Friday, 30th October, 7:00 PM</p>
              <p>Bradford Court Round Table</p>
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
                  placeholder="... tbh, probably won't accomodate for, just BYO"
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
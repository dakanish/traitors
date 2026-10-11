import { useState, useRef } from 'react';

export default function App() {
  const [pin, setPin] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [attending, setAttending] = useState(null);
  const [allergies, setAllergies] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const audioRef = useRef(null);

  // Exact Guest List PINS
  const mockGuests = {
    '4045': 'Lindanheimer',
    '7297': 'Billie',
    '7135': 'Tim',
    '3982': 'Holly',
    '7137': 'Dakota',
    '7860': 'Catherminge',
    '8971': 'Lewis',
    '0369': 'User',
    '0246': 'User',

  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (audioRef.current) {
      audioRef.current.play().catch(() => console.log("Audio requires interaction first."));
    }

    if (mockGuests[pin]) {
      setName(mockGuests[pin]);
      setError('');
    } else {
      setError('Identity not recognized. Try again.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Your Apps Script POST goes here later
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#20000a] flex flex-col items-center justify-center p-4 text-center text-white">
        {/* Exact Hooded Graphic */}
        <div className="w-32 h-32 text-[#EC8A22] mb-6">
          <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full">
            <path d="M50,15 C20,40 25,65 50,85 C75,65 80,40 50,15 Z" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M50,16 C30,35 28,55 50,78 C72,55 70,35 50,16 Z M50,48 C43,48 40,54 41,58 C44,57 46,55 50,55 C54,55 56,57 59,58 C60,54 57,48 50,48 Z M50,60 C46,60 45,63 50,65 C55,63 54,60 50,60 Z" />
          </svg>
        </div>
        <h1 className="text-4xl font-serif text-[#EC8A22] mb-4 tracking-wider uppercase">Your Fate is Sealed.</h1>
        <p className="text-xl text-slate-300 font-serif max-w-sm">
          {attending ? `The roundtable awaits, ${name}. Deception begins soon...` : `Cowardly, ${name}. You have chosen to watch from the shadows.`}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#4a021f] to-[#20000a] flex flex-col items-center justify-center p-4 text-white font-serif relative overflow-hidden">
      {/* Background Audio */}
      <audio ref={audioRef} src="/spooky-theme.mp3" loop />

      <div className="z-10 w-full max-w-md bg-[#2d0112]/95 p-8 rounded-lg border-2 border-[#e0660d]/30 shadow-[0_0_50px_rgba(0,0,0,0.9)] backdrop-blur-md">
        {!name ? (
          <form onSubmit={handleLogin} className="flex flex-col gap-6 items-center w-full">
            {/* The Traitors hooded graphic (image_6.png replica) */}
            <div className="w-24 h-24 text-[#EC8A22]">
              <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full">
                {/* Outter hood curve */}
                <path d="M50,16 C23,37 25,62 50,82 C75,62 77,37 50,16 Z M50,22 C68,38 67,56 50,73 C33,56 32,38 50,22 Z" />
                {/* Shadowed face */}
                <path d="M50,48 C44,48 41,53 43,57 C45,56 47,54 50,54 C53,54 55,56 57,57 C59,53 56,48 50,48 Z M45,60 C48,60 48,61 50,61 C52,61 52,60 55,60 C55,62 52,64 50,64 C48,64 45,62 45,60 Z" />
              </svg>
            </div>

            <div className="text-center">
              <h1 className="text-3xl font-bold tracking-widest text-slate-100 uppercase">The Castle Awaits</h1>
              <p className="text-sm text-slate-400 italic mt-2">Enter your secret code to reveal your invitation.</p>
            </div>

            {/* Custom Interactive PIN code box */}
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

            <button type="submit" className="w-full bg-[#350114] hover:bg-[#4a021f] text-[#EC8A22] border border-[#e0660d]/40 p-4 rounded uppercase tracking-widest font-bold transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)]">
              Reveal Identity &gt;
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <h2 className="text-3xl text-center text-[#EC8A22] font-bold tracking-wider">WELCOME, {name.toUpperCase()}</h2>
            <p className="text-center text-slate-300 italic -mt-4">A feast of deceit & deception.</p>

            {/* The Feast Menu (Interactive Cards) */}
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
              disabled={attending === null}
              className="mt-2 bg-[#EC8A22] hover:bg-[#ff9c3a] disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 p-4 rounded uppercase tracking-widest font-bold transition-all shadow-[0_0_15px_rgba(236,138,34,0.3)]"
            >
              Seal My Fate
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
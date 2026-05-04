import Building3D from '@/components/Building3D';

export default function LoginPage() {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-white">
      {/* 3D Background */}
      <Building3D />

      {/* Login Overlay */}
      <div className="relative z-10 flex items-center justify-center w-full h-full pointer-events-none">
        <div className="bg-white/80 backdrop-blur-md p-8 md:p-12 rounded-2xl shadow-2xl border border-white/50 w-full max-w-md pointer-events-auto mx-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">ADWYA</h1>
            <p className="text-sm text-slate-500 font-medium">PharmaTech Hub</p>
          </div>

          <form className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Adresse Email
              </label>
              <input 
                type="email" 
                placeholder="nom@adwya.com.tn" 
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400 bg-white/90 transition-all"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Mot de passe
              </label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400 bg-white/90 transition-all"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-slate-300 text-slate-800 focus:ring-slate-800" />
                <span className="text-slate-600 font-medium">Se souvenir de moi</span>
              </label>
              <a href="#" className="text-slate-500 hover:text-slate-800 font-medium transition-colors">
                Mot de passe oublié ?
              </a>
            </div>

            <button 
              type="button" 
              className="w-full bg-slate-800 hover:bg-slate-900 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 shadow-md"
            >
              Se Connecter
            </button>
          </form>

          <div className="mt-8 text-center text-xs text-slate-400 font-medium">
            <p>Route de la Marsa, GP 9, Km 14</p>
            <p>2070 La Marsa, Tunis, Tunisie</p>
          </div>
        </div>
      </div>
    </div>
  );
}

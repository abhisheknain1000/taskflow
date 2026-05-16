  export default function HomePage() {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#0B1020] text-white px-6">
        
        <div className="text-center space-y-6 max-w-2xl">
          
          <div className="flex items-center justify-center gap-3">
            
            <div className="size-12 rounded-2xl bg-[#7C5CFF] shadow-lg shadow-[#7C5CFF]/30" />

            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight">
              TaskFlow
            </h1>
          </div>

          <p className="text-slate-400 text-lg sm:text-xl leading-relaxed">
            Modern task management platform built for
            productivity, collaboration, and speed.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            
            <a
              href="/auth/login"
              className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-[#7C5CFF] hover:bg-[#6D4EFF] transition-all duration-300 font-medium"
            >
              Get Started
            </a>

            <a
              href="/auth/signup"
              className="w-full sm:w-auto px-8 py-3 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300 font-medium"
            >
              Create Account
            </a>
          </div>
        </div>
      </main>
    );
  }
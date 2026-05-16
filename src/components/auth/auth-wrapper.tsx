import React from "react";

interface AuthWrapperProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export default function AuthWrapper({
  title,
  subtitle,
  children,
}: AuthWrapperProps) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      
      {/* LEFT SIDE */}
      <div className="hidden lg:flex flex-col justify-between p-12 border-r border-white/10 bg-gradient-to-br from-[#121A2B] to-[#0B1020]">
        
        <div>
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-[#7C5CFF]" />

            <h1 className="text-2xl font-bold tracking-tight">
              TaskFlow
            </h1>
          </div>
        </div>

        <div className="max-w-md space-y-6">
          <h2 className="text-5xl font-bold leading-tight">
            Manage tasks with clarity and speed.
          </h2>

          <p className="text-slate-400 text-lg leading-relaxed">
            A modern productivity platform built for high-performing teams.
          </p>
        </div>

        <div className="text-sm text-slate-500">
          © 2026 TaskFlow. All rights reserved.
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        
        <div className="w-full max-w-md space-y-8">
          
          <div className="space-y-2 text-center lg:text-left">
            <h1 className="text-4xl font-bold tracking-tight">
              {title}
            </h1>

            <p className="text-slate-400">
              {subtitle}
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 sm:p-8 shadow-2xl">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
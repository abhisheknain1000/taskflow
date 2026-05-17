"use client";

import { useAuthStore } from "@/store/auth-store";

export default function Topbar() {
  const user = useAuthStore((state) => state.user);

  return (
    <header
      className="
        shrink-0
        min-h-16 sm:min-h-20
        border-b border-white/10
        bg-[#0B1020]/80 backdrop-blur-xl
        px-4 sm:px-6 py-3 sm:py-0
        flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between
      "
    >
      <div className="min-w-0 flex-1">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white truncate">
          Welcome back 👋
        </h1>
        <p className="text-slate-400 text-sm mt-0.5 sm:mt-1 truncate">
          {user?.name}
        </p>
      </div>

      <div
        className="
          flex items-center gap-2 sm:gap-3
          rounded-2xl border border-white/10 bg-white/5
          px-3 py-2 sm:px-4 shrink-0 self-start sm:self-auto
        "
      >
        <div
          className="
            size-9 sm:size-10 rounded-full bg-[#7C5CFF]
            flex items-center justify-center font-bold text-sm shrink-0
          "
        >
          {user?.name?.charAt(0)}
        </div>

        <div className="hidden sm:block min-w-0">
          <p className="text-sm font-medium truncate">{user?.name}</p>
          <p className="text-xs text-slate-400 capitalize truncate">
            {user?.role}
          </p>
        </div>
      </div>
    </header>
  );
}

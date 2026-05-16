"use client";

import { useAuthStore } from "@/store/auth-store";

export default function Topbar() {

  const user =
    useAuthStore(
      (state) =>
        state.user
    );

  return (
    <header className="
      h-20
      border-b
      border-white/10
      bg-[#0B1020]/80
      backdrop-blur-xl
      px-6
      flex
      items-center
      justify-between
    ">
      <div>
        <h1 className="
          text-3xl
          font-bold
          text-white
        ">
          Welcome back 👋
        </h1>

        <p className="
          text-slate-400
          text-sm
          mt-1
        ">
          {user?.name}
        </p>
      </div>

      <div className="
        flex
        items-center
        gap-3
        rounded-2xl
        border
        border-white/10
        bg-white/5
        px-4
        py-2
      ">
        <div className="
          size-10
          rounded-full
          bg-[#7C5CFF]
          flex
          items-center
          justify-center
          font-bold
        ">
          {user?.name?.charAt(0)}
        </div>

        <div>
          <p className="text-sm font-medium">
            {user?.name}
          </p>

          <p className="
            text-xs
            text-slate-400
            capitalize
          ">
            {user?.role}
          </p>
        </div>
      </div>
    </header>
  );
}
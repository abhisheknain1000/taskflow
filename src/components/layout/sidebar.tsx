"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie"; // ✅ Added missing import
import {
  LayoutDashboard,
  CheckSquare,
  Archive,
  LogOut,
  FolderKanban,
} from "lucide-react";

import { toast } from "sonner";
import { useAuthStore } from "@/store/auth-store";

const links = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },

  {
    label: "Projects",
    href: "/dashboard/projects",
    icon: FolderKanban,
  },

  {
    label: "All Tasks",
    href: "/dashboard/tasks",
    icon: CheckSquare,
  },

  {
    label: "In Progress",
    href: "/dashboard/in-progress",
    icon: CheckSquare,
  },

  {
    label: "Completed",
    href: "/dashboard/completed",
    icon: Archive,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  // ✅ Extract logout correctly from store
  const logout = useAuthStore((state) => state.logout);

    const handleLogout = () => {
      try {
        // 1. Clear Zustand store state

        Cookies.remove("token", { path: "/" });   

        logout(); 

        localStorage.removeItem("auth-storage")   ;

        // 3. Notify user
        toast.success("Logged out successfully");

        // 4. Redirect to login
        router.push("/auth/login");
        
        // Optional: Refresh to ensure all states are wiped
        router.refresh(); 
      } catch (error) {
        toast.error("Logout failed");
        console.error(error);
      }
    };

  return (
    <aside className="hidden lg:flex w-72 border-r border-white/10 bg-[#121A2B] flex-col">
      
      <div className="h-20 border-b border-white/10 flex items-center px-8">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-2xl bg-[#7C5CFF]" />
          <h1 className="text-2xl font-bold text-white">
            TaskFlow
          </h1>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          const active =
            link.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname === link.href ||
                pathname.startsWith(`${link.href}/`);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                active
                  ? "bg-[#7C5CFF] text-white"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={20} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
}
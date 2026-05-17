"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
    shortLabel: "Home",
  },
  {
    label: "Projects",
    href: "/dashboard/projects",
    icon: FolderKanban,
    shortLabel: "Projects",
  },
  {
    label: "All Tasks",
    href: "/dashboard/tasks",
    icon: CheckSquare,
    shortLabel: "Tasks",
  },
  {
    label: "In Progress",
    href: "/dashboard/in-progress",
    icon: CheckSquare,
    shortLabel: "Active",
  },
  {
    label: "Completed",
    href: "/dashboard/completed",
    icon: Archive,
    shortLabel: "Done",
  },
];

function isLinkActive(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === "/dashboard";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLink({
  link,
  active,
  mobile = false,
}: {
  link: (typeof links)[number];
  active: boolean;
  mobile?: boolean;
}) {
  const Icon = link.icon;

  if (mobile) {
    return (
      <Link
        href={link.href}
        className={`
          flex flex-col items-center justify-center gap-0.5
          min-w-0 flex-1 px-0.5 py-1.5 rounded-xl
          text-[10px] font-medium leading-tight transition-colors
          ${active ? "text-[#7C5CFF]" : "text-slate-400"}
        `}
      >
        <span
          className={`flex items-center justify-center size-9 rounded-xl ${
            active ? "bg-[#7C5CFF]/20" : ""
          }`}
        >
          <Icon size={18} />
        </span>
        <span className="truncate w-full text-center">{link.shortLabel}</span>
      </Link>
    );
  }

  return (
    <Link
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
}

function LogoutButton({
  onClick,
  compact = false,
}: {
  onClick: () => void;
  compact?: boolean;
}) {
  if (compact) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label="Log out"
        className="
          flex flex-col items-center justify-center gap-0.5
          min-w-0 flex-1 px-0.5 py-1.5 rounded-xl
          text-[10px] font-medium text-red-400
          active:scale-95 transition-transform
        "
      >
        <span className="flex items-center justify-center size-9 rounded-xl bg-red-500/10">
          <LogOut size={18} />
        </span>
        <span className="truncate w-full text-center">Logout</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="
        w-full flex items-center gap-3 px-4 py-3 rounded-2xl
        text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all
      "
    >
      <LogOut size={20} />
      Logout
    </button>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    try {
      logout();
      toast.success("Logged out successfully");
      router.push("/auth/login");
      router.refresh();
    } catch (error) {
      toast.error("Logout failed");
      console.error(error);
    }
  };

  return (
    <>
      <aside className="hidden lg:flex w-72 border-r border-white/10 bg-[#121A2B] flex-col shrink-0">
        <SidebarHeader />

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {links.map((link) => (
            <NavLink
              key={link.href}
              link={link}
              active={isLinkActive(pathname, link.href)}
            />
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <LogoutButton onClick={handleLogout} />
        </div>
      </aside>

      <nav
        className="
          fixed bottom-0 left-0 right-0 z-50 lg:hidden
          border-t border-white/10 bg-[#121A2B]/95 backdrop-blur-xl
          pb-[env(safe-area-inset-bottom,0px)]
        "
        aria-label="Main navigation"
      >
        <div className="flex items-stretch gap-0.5 px-1 py-2">
          {links.map((link) => (
            <NavLink
              key={link.href}
              link={link}
              active={isLinkActive(pathname, link.href)}
              mobile
            />
          ))}
          <LogoutButton onClick={handleLogout} compact />
        </div>
      </nav>
    </>
  );
}

function SidebarHeader() {
  return (
    <div className="h-20 border-b border-white/10 flex items-center px-8 shrink-0">
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-2xl bg-[#7C5CFF] shrink-0" aria-hidden />
        <h1 className="text-2xl font-bold text-white">TaskFlow</h1>
      </div>
    </div>
  );
}

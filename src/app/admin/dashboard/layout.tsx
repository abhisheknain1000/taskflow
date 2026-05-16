import Sidebar from "@/components/layout/sidebar";

export default function AdminLayout({

  children,

}: {
  children: React.ReactNode;
}) {

  return (
    <div className="
      min-h-screen
      bg-[#0B1120]
      text-white
      flex
    ">

      <Sidebar />

      <main className="
        flex-1
        overflow-y-auto
      ">

        {children}

      </main>
    </div>
  );
}
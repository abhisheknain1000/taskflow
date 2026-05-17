import Sidebar from "@/components/layout/sidebar";

export default function DashboardLayout({

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
        min-w-0
        overflow-x-hidden
        overflow-y-auto
        pb-[calc(5.25rem+env(safe-area-inset-bottom,0px))]
        lg:pb-0
      ">

        {children}

      </main>
    </div>
  );
}
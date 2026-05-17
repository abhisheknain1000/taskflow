import { cardPadding } from "@/lib/responsive-classes";

interface StatsCardProps {
  title: string;
  value: string;
}

export default function StatsCard({ title, value }: StatsCardProps) {
  return (
    <div className={`rounded-3xl border border-white/10 bg-white/5 ${cardPadding}`}>
      <p className="text-slate-400 text-xs sm:text-sm">{title}</p>
      <h2 className="text-3xl sm:text-4xl font-bold mt-2 sm:mt-3">{value}</h2>
    </div>
  );
}

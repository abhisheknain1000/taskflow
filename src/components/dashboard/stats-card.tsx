  interface StatsCardProps {
      title: string;
      value: string;
    }
    
    export default function StatsCard({
      title,
      value,
    }: StatsCardProps) {
      return (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          
          <p className="text-slate-400 text-sm">
            {title}
          </p>
    
          <h2 className="text-4xl font-bold mt-3">
            {value}
          </h2>
        </div>
      );
    } 
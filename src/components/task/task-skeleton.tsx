export default function TaskSkeleton() {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 animate-pulse">
        
        <div className="h-6 w-40 bg-white/10 rounded mb-4" />
  
        <div className="h-4 w-full bg-white/10 rounded mb-2" />
  
        <div className="h-4 w-2/3 bg-white/10 rounded" />
  
        <div className="flex justify-between mt-6">
          
          <div className="h-8 w-20 bg-white/10 rounded-full" />
  
          <div className="h-4 w-24 bg-white/10 rounded" />
        </div>
      </div>
    );
  } 
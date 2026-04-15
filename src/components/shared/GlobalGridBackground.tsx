"use client";

export function GlobalGridBackground() {

  return (
    <>
      {/* Dark base background */}
      <div className="fixed inset-0 -z-50 bg-slate-950">
        
        {/* Gradient blob - top left purple */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-600/40 via-purple-600/20 to-transparent rounded-full blur-[120px] opacity-60" />
        
        {/* Gradient blob - top right blue */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-bl from-blue-600/35 via-purple-600/15 to-transparent rounded-full blur-[100px] opacity-50" />
        
        {/* Gradient blob - center purple */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-b from-purple-600/30 via-purple-600/10 to-transparent rounded-full blur-[140px] opacity-40" />
        
        {/* Gradient blob - bottom right cyan */}
        <div className="absolute -bottom-20 right-0 w-96 h-96 bg-gradient-to-tl from-cyan-600/25 via-blue-600/15 to-transparent rounded-full blur-[120px] opacity-40" />
        
        {/* Gradient blob - bottom left purple */}
        <div className="absolute bottom-0 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-600/30 via-purple-600/10 to-transparent rounded-full blur-[100px] opacity-50" />
        
        {/* Gradient blob - middle right accent */}
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-gradient-to-l from-purple-500/20 via-purple-600/10 to-transparent rounded-full blur-[120px] opacity-35" />
        
        {/* Vignette overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/0 via-slate-950/0 to-slate-950/50" />
        
        {/* Radial fade effect from center */}
        <div className="absolute inset-0" 
          style={{
            background: 'radial-gradient(ellipse at center, transparent 20%, rgba(2, 6, 23, 0.5) 100%)'
          }}
        />
      </div>
    </>
  );
}

import { Leaf } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center animate-pulse-glow">
          <Leaf className="w-7 h-7 text-white" />
        </div>
        <div className="absolute inset-0 rounded-2xl border-2 border-purple-500/30 animate-ping" />
      </div>
      <p className="text-white/30 text-sm animate-pulse">Loading...</p>
    </div>
  );
}
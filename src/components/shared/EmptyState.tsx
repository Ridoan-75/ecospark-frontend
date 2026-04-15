"use client";

import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type TEmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
};

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: TEmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 text-center",
        className
      )}
    >
      <div className="w-16 h-16 rounded-2xl glass-purple flex items-center justify-center mb-4">
        <Icon className="w-7 h-7 text-purple-400" />
      </div>
      <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
      {description && (
        <p className="text-white/40 text-sm max-w-sm leading-relaxed mb-6">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={onAction}
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-8 py-3 h-12 font-semibold rounded-xl shadow-[0_0_30px_rgba(147,51,234,0.4)] hover:shadow-[0_0_50px_rgba(147,51,234,0.7)] transition-all duration-300"
          >
            {actionLabel}
          </Button>
        </motion.div>
      )}
    </div>
  );
}
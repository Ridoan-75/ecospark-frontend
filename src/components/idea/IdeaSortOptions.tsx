"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUpDown } from "lucide-react";
import { IDEA_SORT_OPTIONS } from "@/constants";

type TProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function IdeaSortOptions({ value, onChange }: TProps) {
  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown className="w-4 h-4 text-white/30 shrink-0" />
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="input-glass h-10 rounded-xl w-44 text-sm">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent className="bg-dark-200 border-white/10 text-white">
          {IDEA_SORT_OPTIONS.map((opt) => (
            <SelectItem
              key={opt.value}
              value={opt.value}
              className="hover:bg-white/10 focus:bg-white/10 text-white/80"
            >
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
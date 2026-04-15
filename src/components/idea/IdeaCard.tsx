import Link from "next/link";
import Image from "next/image";
import { TIdea } from "@/types/idea.types";
import { ROUTES } from "@/constants/routes";
import { formatCurrency, truncateText } from "@/lib/utils";
import IdeaStatusBadge from "./IdeaStatusBadge";
import {
  ArrowUp,
  MessageSquare,
  Eye,
  Lock,
  Sparkles,
} from "lucide-react";

type TProps = {
  idea: TIdea;
  showStatus?: boolean;
};

export default function IdeaCard({ idea, showStatus = false }: TProps) {
  return (
    <Link href={ROUTES.IDEA_DETAILS(idea.id)}>
      <div className="glass glass-hover gradient-border rounded-2xl overflow-hidden h-full flex flex-col group cursor-pointer">

        {/* Image */}
        <div className="relative h-44 overflow-hidden shrink-0">
          {idea.images?.[0] ? (
            <Image
              src={idea.images[0]}
              alt={idea.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-purple-900/40 to-dark-400 flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-purple-400/30" />
            </div>
          )}
          <div className="absolute inset-0 bg-linear-to-t from-dark-400/90 via-dark-400/20 to-transparent" />

          {/* Top badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            <span className="rounded-full px-2.5 py-1 text-xs bg-violet-700 text-white border border-violet-700 shadow-sm shadow-violet-700/30">
              {idea.category.name}
            </span>
            {idea.isPaid && (
              <span className="rounded-full px-2.5 py-1 text-xs flex items-center gap-1 bg-red-600 text-white border border-red-600 shadow-sm shadow-red-600/30">
                <Lock className="w-2.5 h-2.5 text-white" />
                {formatCurrency(idea.price!)}
              </span>
            )}
          </div>

          {/* Status badge — dashboard এ দেখাবে */}
          {showStatus && (
            <div className="absolute top-3 right-3">
              <IdeaStatusBadge status={idea.status} />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">

          {/* Title */}
          <h3 className="text-white font-semibold text-sm leading-snug mb-2 group-hover:text-purple-300 transition-colors line-clamp-2">
            {idea.title}
          </h3>

          {/* Description */}
          <p className="text-white/40 text-xs leading-relaxed flex-1 mb-3 line-clamp-2">
            {truncateText(idea.description, 90)}
          </p>

          {/* Author */}
          <div className="flex items-center gap-2 mb-3">
            {idea.author?.profileImage ? (
              <div className="w-5 h-5 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src={idea.author.profileImage}
                  alt={idea.author.name}
                  width={20}
                  height={20}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-5 h-5 rounded-full bg-linear-to-br from-purple-600 to-purple-800 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                {idea.author?.name?.charAt(0).toUpperCase() || "A"}
              </div>
            )}
            <span className="text-white/35 text-xs truncate">
              {idea.author?.name || "Anonymous"}
            </span>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3 pt-3 border-t border-white/8">
            <div className="flex items-center gap-1 text-white/40 text-xs">
              <ArrowUp className="w-3 h-3 text-green-400" />
              <span>{idea._count?.votes ?? 0}</span>
            </div>
            <div className="flex items-center gap-1 text-white/40 text-xs">
              <MessageSquare className="w-3 h-3 text-blue-400" />
              <span>{idea._count?.comments ?? 0}</span>
            </div>
            <div className="flex items-center gap-1 text-white/40 text-xs ml-auto">
              <Eye className="w-3 h-3 text-purple-400" />
              <span>{idea.viewCount}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
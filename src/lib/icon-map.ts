import {
  Video,
  Wand2,
  Mic,
  Film,
  Sparkles,
  Megaphone,
  Share2,
  Building2,
  PlayCircle,
  Youtube,
  BookOpen,
  Brain,
  Zap,
  Award,
  DollarSign,
  Infinity as InfIcon,
  Cpu,
  Users,
  UserCheck,
  RefreshCw,
  type LucideIcon,
} from "lucide-react";

export const iconMap: Record<string, LucideIcon> = {
  Video,
  Wand2,
  Mic,
  Film,
  Sparkles,
  Megaphone,
  Share2,
  Building2,
  PlayCircle,
  Youtube,
  BookOpen,
  Brain,
  Zap,
  Award,
  DollarSign,
  Infinity: InfIcon,
  Cpu,
  Users,
  UserCheck,
  RefreshCw,
};

export function getIcon(name: string | undefined, fallback: LucideIcon = Sparkles): LucideIcon {
  if (!name) return fallback;
  return iconMap[name] ?? fallback;
}

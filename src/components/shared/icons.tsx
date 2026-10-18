import {
  ChartNoAxesColumnIncreasing,
  FileText,
  History,
  House,
  Settings,
  ShieldCheck,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";

const icons: Record<string, LucideIcon> = {
  home: House,
  spark: Sparkles,
  file: FileText,
  report: ChartNoAxesColumnIncreasing,
  people: Users,
  history: History,
  shield: ShieldCheck,
  settings: Settings,
};

export function NavIcon({ name }: { name: string }) {
  const Icon = icons[name] ?? FileText;
  return <Icon aria-hidden="true" />;
}

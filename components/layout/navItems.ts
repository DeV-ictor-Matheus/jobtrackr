import { Kanban, LayoutDashboard, Settings, type LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
  { label: "Candidaturas", href: "/board", icon: Kanban },
  { label: "Painel", href: "/dashboard", icon: LayoutDashboard },
  { label: "Configurações", href: "/settings", icon: Settings },
];

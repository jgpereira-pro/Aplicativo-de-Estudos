import { Home, BookOpen, User, Grid3x3 } from "lucide-react";

/**
 * Constantes de navegação compartilhadas
 * 
 * Centraliza definições de navegação para evitar duplicação
 */

export const navItems = [
  { id: "home", label: "Home", icon: Home },
  { id: "biblioteca", label: "Biblioteca", icon: BookOpen },
  { id: "tools", label: "Ferramentas", icon: Grid3x3 },
  { id: "perfil", label: "Perfil", icon: User }
] as const;

export type NavItemId = typeof navItems[number]['id'];

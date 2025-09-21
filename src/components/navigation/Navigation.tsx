// [AI]
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { usePWAContext } from "@/components/PWAProvider";
import {
  LayoutDashboard,
  TrendingUp,
  Database,
  Plus,
  Smartphone,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon?: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard className="w-4 h-4" />,
  },
  {
    href: "/analytics",
    label: "Analytics",
    icon: <TrendingUp className="w-4 h-4" />,
  },
  {
    href: "/data-management",
    label: "Data Management",
    icon: <Database className="w-4 h-4" />,
  },
  {
    href: "/income/new",
    label: "Add Income",
    icon: <Plus className="w-4 h-4" />,
  },
];

export default function Navigation() {
  const pathname = usePathname();
  const { isInstallable, installPWA } = usePWAContext();

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <nav
      role="navigation"
      aria-label="Main navigation"
      className="flex items-center gap-1 sm:gap-2"
    >
      {/* Navigation Pills */}
      <div className="flex items-center bg-white/30 dark:bg-slate-800/30 backdrop-blur-sm rounded-xl sm:rounded-2xl p-0.5 sm:p-1 border border-white/20 dark:border-slate-700/50 shadow-lg">
        {navItems.map((item) => {
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                group relative flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-300
                focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-0
                ${
                  active
                    ? "bg-gradient-primary text-white shadow-lg transform scale-105"
                    : "text-gray-600 dark:text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:shadow-md hover:scale-105"
                }
              `}
              aria-label={item.label}
              aria-current={active ? "page" : undefined}
            >
              {/* Icon with animation */}
              <div
                className={`transition-transform duration-300 ${
                  active ? "rotate-0" : "group-hover:rotate-6"
                } flex-shrink-0`}
              >
                {item.icon}
              </div>

              {/* Label - More responsive behavior */}
              <span className="hidden lg:inline font-medium">{item.label}</span>
              <span className="hidden sm:inline lg:hidden font-medium">
                {item.label.length > 8 ? item.label.split(" ")[0] : item.label}
              </span>

              {/* Glow effect for active item */}
              {active && (
                <>
                  <div className="absolute inset-0 rounded-lg sm:rounded-xl bg-gradient-primary opacity-20 blur-md"></div>
                  <div className="absolute -inset-0.5 rounded-lg sm:rounded-xl bg-gradient-primary opacity-10 blur-lg"></div>
                </>
              )}
            </Link>
          );
        })}
      </div>

      {/* PWA Install Button - More mobile friendly */}
      {isInstallable && (
        <button
          onClick={installPWA}
          className="group flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-800/50 rounded-lg sm:rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/40 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-lg hover:scale-105 transition-all duration-300 backdrop-blur-sm flex-shrink-0"
          title="Install Progressive Web App"
        >
          <Smartphone className="w-4 h-4 transition-transform duration-300 group-hover:scale-110 flex-shrink-0" />
          <span className="hidden md:inline">Install App</span>
          <span className="md:hidden hidden sm:inline">Install</span>
        </button>
      )}
    </nav>
  );
}
// [/AI]

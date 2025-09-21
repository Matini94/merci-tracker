// [AI]
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

const pathLabels: Record<string, string> = {
  "": "Home",
  dashboard: "Dashboard",
  income: "Income",
  new: "Add New",
};

export default function Breadcrumbs() {
  const pathname = usePathname();

  // Don't show breadcrumbs on home page
  if (pathname === "/") {
    return null;
  }

  const pathSegments = pathname.split("/").filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [];

  // Always include home
  breadcrumbs.push({ label: "Home", href: "/" });

  // Build breadcrumb trail
  let currentPath = "";
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const label =
      pathLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
    const isLast = index === pathSegments.length - 1;

    breadcrumbs.push({
      label,
      href: isLast ? undefined : currentPath,
    });
  });

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center space-x-1 text-sm text-gray-500 mb-4"
    >
      <ol className="flex items-center space-x-1">
        {breadcrumbs.map((crumb, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRight
                className="w-4 h-4 mx-2 text-gray-400"
                aria-hidden="true"
              />
            )}

            {crumb.href ? (
              <Link
                href={crumb.href}
                className="text-gray-500 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded"
              >
                {crumb.label}
              </Link>
            ) : (
              <span
                className="text-blue-600 font-semibold bg-blue-50 px-2 py-1 rounded-md"
                aria-current="page"
              >
                {crumb.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
// [/AI]

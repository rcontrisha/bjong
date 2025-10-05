import React, { useState } from "react";
import { Link, router } from "@inertiajs/react";
import {
  LayoutDashboard,
  Table2,
  FileBarChart,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";

export default function PosLayout({ auth, children, rightSidebar }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    {
      name: "Dashboard",
      href: route("pos.dashboard"),
      match: "pos.dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      name: "Monitor Meja",
      href: route("pos.tables.page"),
      match: "pos.tables.page",
      icon: <Table2 className="w-5 h-5" />,
    },
    {
      name: "Laporan Shift",
      href: route("pos.reporting-shift.index"),
      match: "pos.reporting-shift.index",
      icon: <FileBarChart className="w-5 h-5" />,
    },
  ];

  return (
    <div className="h-screen w-screen flex bg-gray-900 text-white overflow-hidden">
      {/* Sidebar kiri */}
      <aside
        className={`${
          isCollapsed ? "w-16" : "w-64"
        } bg-gray-800 flex flex-col p-4 flex-shrink-0 transition-all duration-300`}
      >
        {/* Header (Logo + Toggle) */}
        <div className="mb-6">
          {isCollapsed ? (
            <div className="flex items-center justify-center">
              <button
                onClick={() => setIsCollapsed(false)}
                className="p-2 text-gray-400 hover:text-white"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src="/images/logo.png"
                  alt="Bjongngopi Logo"
                  className="w-8 h-8 object-contain"
                />
                <h2 className="text-xl font-bold text-red-500">Bjongngopi</h2>
              </div>
              <button
                onClick={() => setIsCollapsed(true)}
                className="p-2 text-gray-400 hover:text-white"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="space-y-2 flex-1">
          {navItems.map((item) => {
            const isActive = route().current(item.match);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                  isCollapsed ? "justify-center" : "gap-3"
                } ${
                  isActive
                    ? "bg-yellow-400 text-black font-semibold"
                    : "hover:bg-gray-700 text-gray-300"
                }`}
              >
                <div className="flex items-center justify-center w-6 h-6">
                  {item.icon}
                </div>
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Logout Shift */}
        <div className="border-t border-gray-700 pt-4 mt-4">
          <button
            onClick={(e) => {
              e.preventDefault();
              router.post(route("pos.logout"));
            }}
            className="w-full flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 p-2 rounded-lg font-semibold"
          >
            <LogOut className="w-4 h-4" />
            {!isCollapsed && "Logout Shift"}
          </button>
        </div>
      </aside>

      {/* Konten tengah + sidebar kanan */}
      <main className="flex flex-1 overflow-hidden">
        {/* Konten utama */}
        <div className="flex-1 min-w-0 overflow-y-auto p-6 bg-gray-900">
          {children}
        </div>

        {/* Sidebar kanan */}
        {rightSidebar && (
          <aside className="flex-none w-[28rem] bg-gray-800 border-l border-gray-700 flex flex-col">
            {rightSidebar}
          </aside>
        )}
      </main>
    </div>
  );
}

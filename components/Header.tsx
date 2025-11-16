"use client";

import { Plus, LogOut } from "lucide-react";
import { useAuth } from "@/lib/authContext";
import { useRouter } from "next/navigation";

interface HeaderProps {
  onAddClick: () => void;
}

export function Header({ onAddClick }: HeaderProps) {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/auth/login");
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Title */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">📋 Pratyah</h1>
            <p className="text-xs text-gray-500 hidden sm:block">Focus on what matters</p>
          </div>

          {/* Center - User Info */}
          {user && !isLoading && (
            <div className="text-sm text-gray-600 hidden md:block">
              {user.email}
            </div>
          )}

          {/* Right - Add Task and Logout Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onAddClick}
              className="
                inline-flex items-center gap-2 px-4 py-2
                bg-blue-600 text-white rounded-lg font-medium
                hover:bg-blue-700 transition
                shadow-sm hover:shadow-md
              "
            >
              <Plus size={20} />
              <span className="hidden sm:inline">Add Task</span>
            </button>

            {user && !isLoading && (
              <button
                onClick={handleLogout}
                className="
                  inline-flex items-center gap-2 px-4 py-2
                  text-gray-700 hover:bg-gray-100 rounded-lg font-medium
                  transition
                "
                title="Logout"
              >
                <LogOut size={20} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

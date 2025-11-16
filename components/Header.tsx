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
    <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo/Title */}
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Pratyah</h1>
          <p className="text-xs text-gray-500 font-medium mt-0.5">Task Management</p>
        </div>

        {/* Right - User Info, Add Task and Logout Buttons */}
        <div className="flex items-center gap-6">
          {user && !isLoading && (
            <div className="text-sm text-gray-600 font-medium hidden sm:block">
              {user.email}
            </div>
          )}

          <div className="flex items-center gap-3">
            <button
              onClick={onAddClick}
              className="
                inline-flex items-center gap-2 px-5 py-2.5
                bg-gray-900 text-white rounded-lg font-semibold text-sm
                hover:bg-gray-800 transition duration-200
                active:scale-95
              "
            >
              <Plus size={18} strokeWidth={2.5} />
              <span className="hidden sm:inline">Add Task</span>
            </button>

            {user && !isLoading && (
              <button
                onClick={handleLogout}
                className="
                  inline-flex items-center justify-center
                  p-2 text-gray-600 hover:text-gray-900
                  hover:bg-gray-100 rounded-lg transition duration-200
                "
                title="Logout"
              >
                <LogOut size={18} strokeWidth={2} />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

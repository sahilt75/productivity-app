"use client";

import { Plus } from "lucide-react";

interface HeaderProps {
  onAddClick: () => void;
}

export function Header({ onAddClick }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Title */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">📋 Pratyah</h1>
            <p className="text-xs text-gray-500 hidden sm:block">Focus on what matters</p>
          </div>

          {/* Add Task Button */}
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
        </div>
      </div>
    </header>
  );
}

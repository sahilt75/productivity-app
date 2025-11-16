"use client";

import { useState } from "react";
import { Category, CATEGORIES } from "@/lib/types";
import { X } from "lucide-react";

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, category: Category, isToday: boolean) => void;
  isLoading?: boolean;
}

export function AddTaskModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: AddTaskModalProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Category>("ESSENTIALS");
  const [isToday, setIsToday] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit(title, category, isToday);
    setTitle("");
    setCategory("ESSENTIALS");
    setIsToday(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-96 max-w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Create Task</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
            disabled={isLoading}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Task Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
              disabled={isLoading}
              autoFocus
            />
          </div>

          {/* Category Select */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
              disabled={isLoading}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Today Toggle */}
          <div className="flex items-center gap-3 py-2">
            <input
              type="checkbox"
              id="isToday"
              checked={isToday}
              onChange={(e) => setIsToday(e.target.checked)}
              className="w-4 h-4 cursor-pointer accent-gray-900 rounded"
              disabled={isLoading}
            />
            <label htmlFor="isToday" className="text-sm font-medium text-gray-700 cursor-pointer">
              Schedule for today
            </label>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold transition duration-200"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 text-white bg-gray-900 hover:bg-gray-800 rounded-lg font-semibold transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || !title.trim()}
            >
              {isLoading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

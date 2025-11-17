"use client";

import { Task, getCategoryColor, getCategoryLabel } from "@/lib/types";
import { Trash2, Edit2 } from "lucide-react";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string, completed: boolean) => void;
  onDragStart?: (task: Task) => void;
}

export function TaskCard({
  task,
  onEdit,
  onDelete,
  onToggleComplete,
  onDragStart,
}: TaskCardProps) {
  return (
    <div
      className="group py-3 px-2 border-b border-dashed border-gray-200 hover:bg-gray-50 transition-colors duration-200 cursor-grab active:cursor-grabbing"
      draggable
      onDragStart={() => onDragStart?.(task)}
    >
      <div className="flex items-center gap-3">
        {/* Checkbox - Modern, visible, clean */}
        <input
          type="checkbox"
          checked={task.isCompleted}
          onChange={(e) => onToggleComplete(task.id, e.target.checked)}
          className="flex-shrink-0 w-4 h-4 cursor-pointer rounded border-2 border-gray-300 checked:bg-blue-600 checked:border-blue-600 transition-colors"
        />

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p
            className={`text-sm font-400 line-height-1.4 break-words transition-all ${
              task.isCompleted
                ? "line-through text-gray-400 opacity-45"
                : "text-gray-700"
            }`}
          >
            {task.title}
          </p>
        </div>

        {/* Category Chip - Pastel colors */}
        <div className="flex-shrink-0">
          <span className={`inline-block font-medium ${getCategoryColor(
            task.category as any
          )}`}>
            {getCategoryLabel(task.category as any)}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-md transition duration-200"
            title="Edit task"
            aria-label="Edit task"
          >
            <Edit2 size={14} strokeWidth={2} />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition duration-200"
            title="Delete task"
            aria-label="Delete task"
          >
            <Trash2 size={14} strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}

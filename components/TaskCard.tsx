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
      className={`
        p-4 rounded-lg border-2 transition-all
        ${
          task.isCompleted
            ? "bg-gray-100 border-gray-200 opacity-60"
            : "bg-white border-gray-200 hover:border-gray-300"
        }
        cursor-grab active:cursor-grabbing
      `}
      draggable
      onDragStart={() => onDragStart?.(task)}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={task.isCompleted}
          onChange={(e) => onToggleComplete(task.id, e.target.checked)}
          className="mt-1 w-5 h-5 cursor-pointer accent-blue-600"
        />

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3
            className={`
              text-sm font-medium break-words
              ${task.isCompleted ? "line-through text-gray-400" : "text-gray-900"}
            `}
          >
            {task.title}
          </h3>

          {/* Category Label */}
          <div className="mt-2">
            <span
              className={`
                inline-block px-2.5 py-0.5 rounded-full text-xs font-medium
                ${getCategoryColor(task.category as any)}
              `}
            >
              {getCategoryLabel(task.category as any)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition"
            title="Edit task"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition"
            title="Delete task"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

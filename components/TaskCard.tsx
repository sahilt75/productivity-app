"use client";

import { Task, getCategoryColor, getCategoryLabel } from "@/lib/types";
import { Trash2, Edit2, GripVertical } from "lucide-react";

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
        group p-4 rounded-xl border transition-all duration-200
        ${
          task.isCompleted
            ? "bg-gray-50 border-gray-100"
            : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm"
        }
        cursor-grab active:cursor-grabbing
      `}
      draggable
      onDragStart={() => onDragStart?.(task)}
    >
      <div className="flex items-start gap-3">
        {/* Drag Handle */}
        <div className="pt-1 text-gray-300 group-hover:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
          <GripVertical size={16} strokeWidth={2} />
        </div>

        {/* Checkbox */}
        <input
          type="checkbox"
          checked={task.isCompleted}
          onChange={(e) => onToggleComplete(task.id, e.target.checked)}
          className="mt-1 w-5 h-5 cursor-pointer accent-gray-900 rounded"
        />

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3
            className={`
              text-sm font-medium break-words transition-all
              ${task.isCompleted ? "line-through text-gray-400" : "text-gray-900"}
            `}
          >
            {task.title}
          </h3>

          {/* Category Label */}
          <div className="mt-2.5">
            <span
              className={`
                inline-block px-2 py-1 rounded-full text-xs font-semibold
                ${getCategoryColor(task.category as any)}
              `}
            >
              {getCategoryLabel(task.category as any)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-1.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition duration-200"
            title="Edit task"
          >
            <Edit2 size={16} strokeWidth={2} />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition duration-200"
            title="Delete task"
          >
            <Trash2 size={16} strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}

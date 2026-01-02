"use client";

import { useRef, useState } from "react";
import { Task, getCategoryColor, getCategoryLabel } from "@/lib/types";
import { Trash2, Edit2 } from "lucide-react";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string, completed: boolean) => void;
  onDragStart?: (task: Task) => void;
  onTouchDrop?: (x: number, y: number) => void;
}

export function TaskCard({
  task,
  onEdit,
  onDelete,
  onToggleComplete,
  onDragStart,
  onTouchDrop,
}: TaskCardProps) {
  const touchTimer = useRef<number | null>(null);
  const startPos = useRef<{ x: number; y: number } | null>(null);
  const [isTouchDragging, setIsTouchDragging] = useState(false);

  const clearTouch = () => {
    if (touchTimer.current) {
      window.clearTimeout(touchTimer.current);
      touchTimer.current = null;
    }
    startPos.current = null;
    setIsTouchDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    startPos.current = { x: t.clientX, y: t.clientY };

    // Start a short long-press timer to initiate drag (avoid accidental scroll)
    touchTimer.current = window.setTimeout(() => {
      setIsTouchDragging(true);
      onDragStart?.(task);
    }, 180);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!startPos.current) return;
    const t = e.touches[0];
    const dx = Math.abs(t.clientX - startPos.current.x);
    const dy = Math.abs(t.clientY - startPos.current.y);

    // If the user moves finger before long-press threshold, cancel drag start
    if (!isTouchDragging && (dx > 10 || dy > 10)) {
      clearTouch();
      return;
    }

    // While dragging, prevent the page from scrolling
    if (isTouchDragging) {
      e.preventDefault();
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (isTouchDragging && onTouchDrop) {
      // Use the last changed touch or the first touch point
      const touch = e.changedTouches[0] || e.touches[0];
      onTouchDrop(touch.clientX, touch.clientY);
    }
    clearTouch();
  };
  return (
    <div
      className="group py-3 px-2 border-b border-dashed border-gray-200 hover:bg-gray-50 transition-colors duration-200 cursor-grab active:cursor-grabbing"
      draggable
      onDragStart={() => onDragStart?.(task)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
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

        {/* Action Buttons - visible on mobile, hover-only on larger screens */}
        <div className="flex gap-2 flex-shrink-0 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(task)}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-md transition duration-200"
            title="Edit task"
            aria-label="Edit task"
          >
            <Edit2 size={16} strokeWidth={2} />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition duration-200"
            title="Delete task"
            aria-label="Delete task"
          >
            <Trash2 size={16} strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}

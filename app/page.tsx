"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { TaskCard } from "@/components/TaskCard";
import { AddTaskModal } from "@/components/AddTaskModal";
import { EditTaskModal } from "@/components/EditTaskModal";
import { useToast } from "@/lib/toast";
import { useAuth } from "@/lib/authContext";
import { useGlobalLoader } from "@/lib/useGlobalLoader";
import { Task, Category } from "@/lib/types";

export default function Home() {
  const router = useRouter();
  const { addToast } = useToast();
  const { show: showLoader, hide: hideLoader } = useGlobalLoader();
  const { user, isLoading: authLoading } = useAuth();
  const [todayTasks, setTodayTasks] = useState<Task[]>([]);
  const [everythingElseTasks, setEverythingElseTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, authLoading, router]);

  // Fetch tasks on mount and when user changes
  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/tasks");
      if (res.status === 401) {
        router.push("/auth/login");
        return;
      }
      if (!res.ok) throw new Error("Failed to fetch tasks");
      const data = await res.json();
      setTodayTasks(data.today || []);
      setEverythingElseTasks(data.everythingElse || []);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      addToast("Failed to load tasks", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTask = async (
    title: string,
    category: Category,
    isToday: boolean
  ) => {
    try {
      showLoader();
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, category, isToday }),
      });

      if (!res.ok) throw new Error("Failed to create task");
      const newTask: Task = await res.json();
      if (isToday) {
        setTodayTasks([newTask, ...todayTasks]);
      } else {
        setEverythingElseTasks([newTask, ...everythingElseTasks]);
      }
      setIsModalOpen(false);
      addToast("Task created!", "success");
    } catch (error) {
      console.error("Failed to create task:", error);
      addToast("Failed to create task", "error");
    } finally {
      hideLoader();
    }
  };

  const handleToggleComplete = async (id: string, completed: boolean) => {
    try {
      showLoader();
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isCompleted: completed }),
      });

      if (!res.ok) throw new Error("Failed to update task");
      const updated: Task = await res.json();
      updateTaskInState(id, updated);
      addToast(completed ? "Task completed! 🎉" : "Task reopened", "success");
    } catch (error) {
      console.error("Failed to toggle task:", error);
      addToast("Failed to update task", "error");
    } finally {
      hideLoader();
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (
    id: string,
    title: string,
    category: Category
  ) => {
    try {
      showLoader();
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, category }),
      });

      if (!res.ok) throw new Error("Failed to update task");
      const updated: Task = await res.json();
      updateTaskInState(id, updated);
      setIsEditModalOpen(false);
      addToast("Task updated!", "success");
    } catch (error) {
      console.error("Failed to update task:", error);
      addToast("Failed to update task", "error");
    } finally {
      hideLoader();
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!confirm("Delete this task?")) return;

    try {
      showLoader();
      const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete task");
      setTodayTasks(todayTasks.filter((t) => t.id !== id));
      setEverythingElseTasks(
        everythingElseTasks.filter((t) => t.id !== id)
      );
      addToast("Task deleted", "success");
    } catch (error) {
      console.error("Failed to delete task:", error);
      addToast("Failed to delete task", "error");
    } finally {
      hideLoader();
    }
  };

  const updateTaskInState = (id: string, updated: Task) => {
    const inToday = todayTasks.some((t) => t.id === id);
    if (inToday) {
      // Remove the task and re-add it, moving completed tasks to bottom
      const filtered = todayTasks.filter((t) => t.id !== id);
      if (updated.isCompleted) {
        setTodayTasks([...filtered, updated]);
      } else {
        setTodayTasks([updated, ...filtered]);
      }
    } else {
      // Remove the task and re-add it, moving completed tasks to bottom
      const filtered = everythingElseTasks.filter((t) => t.id !== id);
      if (updated.isCompleted) {
        setEverythingElseTasks([...filtered, updated]);
      } else {
        setEverythingElseTasks([updated, ...filtered]);
      }
    }
  };

  // Drag and Drop Handlers
  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropOnToday = async () => {
    if (!draggedTask || draggedTask.isToday) return;

    try {
      const res = await fetch(`/api/tasks/${draggedTask.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isToday: true }),
      });

      if (!res.ok) throw new Error("Failed to move task");
      const updated: Task = await res.json();
      setEverythingElseTasks(
        everythingElseTasks.filter((t) => t.id !== draggedTask.id)
      );
      setTodayTasks([updated, ...todayTasks]);
      addToast("Task moved to Today ✨", "success");
    } catch (error) {
      console.error("Failed to move task to today:", error);
      addToast("Failed to move task", "error");
    } finally {
      setDraggedTask(null);
    }
  };

  const handleDropOnEverythingElse = async () => {
    if (!draggedTask || !draggedTask.isToday) return;

    try {
      const res = await fetch(`/api/tasks/${draggedTask.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isToday: false }),
      });

      if (!res.ok) throw new Error("Failed to move task");
      const updated: Task = await res.json();
      setTodayTasks(todayTasks.filter((t) => t.id !== draggedTask.id));
      setEverythingElseTasks([updated, ...everythingElseTasks]);
      addToast("Task moved to backlog 📋", "success");
    } catch (error) {
      console.error("Failed to move task to everything else:", error);
      addToast("Failed to move task", "error");
    } finally {
      setDraggedTask(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFCFE]">
      <Header onAddClick={() => setIsModalOpen(true)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {authLoading ? (
          <div className="text-center py-20">
            <p className="text-gray-600 font-medium">Loading...</p>
          </div>
        ) : !user ? (
          <div className="text-center py-20">
            <p className="text-gray-600 font-medium">Redirecting to login...</p>
          </div>
        ) : isLoading ? (
          <div className="text-center py-20">
            <p className="text-gray-600 font-medium">Loading tasks...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6 lg:gap-8">
            {/* Today Column (Primary - Pure White) */}
            <div
              className="relative rounded-2xl border border-blue-100 bg-white shadow-[0_8px_30px_rgba(59,130,246,0.10)] p-8 min-h-96 transition-all hover:shadow-[0_10px_40px_rgba(59,130,246,0.12)] hover:-translate-y-0.5"
              onDragOver={handleDragOver}
              onDrop={handleDropOnToday}
            >
              <div className="absolute left-0 top-0 h-full w-1 bg-blue-400 rounded-l-2xl"></div>
              <h2 className="text-xl font-semibold tracking-tight text-gray-800 mb-1">
                Today
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                {todayTasks.length} {todayTasks.length === 1 ? 'task' : 'tasks'}
              </p>

              {todayTasks.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400 text-sm font-medium">
                    All clear for today
                  </p>
                </div>
              ) : (
                <div className="space-y-0">
                  {todayTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onEdit={handleEditTask}
                      onDelete={handleDeleteTask}
                      onToggleComplete={handleToggleComplete}
                      onDragStart={handleDragStart}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Everything Else Column (Secondary - Subtle White) */}
            <div
              className="rounded-2xl border border-gray-100 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-8 min-h-96 transition-all lg:sticky lg:top-24 hover:shadow-[0_6px_25px_rgba(0,0,0,0.05)]"
              onDragOver={handleDragOver}
              onDrop={handleDropOnEverythingElse}
            >
              <h2 className="text-xl font-semibold tracking-tight text-gray-800 mb-1">
                Everything Else
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                {everythingElseTasks.length} {everythingElseTasks.length === 1 ? 'task' : 'tasks'}
              </p>

              {everythingElseTasks.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400 text-sm font-medium">
                    Nothing here yet
                  </p>
                </div>
              ) : (
                <div className="space-y-0">
                  {everythingElseTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onEdit={handleEditTask}
                      onDelete={handleDeleteTask}
                      onToggleComplete={handleToggleComplete}
                      onDragStart={handleDragStart}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddTask}
        isLoading={isMutating}
      />

      <EditTaskModal
        task={editingTask}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleSaveEdit}
        isLoading={isMutating}
      />
    </div>
  );
}

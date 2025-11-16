"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { TaskCard } from "@/components/TaskCard";
import { AddTaskModal } from "@/components/AddTaskModal";
import { EditTaskModal } from "@/components/EditTaskModal";
import { useToast } from "@/lib/toast";
import { useAuth } from "@/lib/authContext";
import { Task, Category } from "@/lib/types";

export default function Home() {
  const router = useRouter();
  const { addToast } = useToast();
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
      setIsMutating(true);
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
      setIsMutating(false);
    }
  };

  const handleToggleComplete = async (id: string, completed: boolean) => {
    try {
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
      setIsMutating(true);
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
      setIsMutating(false);
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!confirm("Delete this task?")) return;

    try {
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
    }
  };

  const updateTaskInState = (id: string, updated: Task) => {
    const inToday = todayTasks.some((t) => t.id === id);
    if (inToday) {
      setTodayTasks(todayTasks.map((t) => (t.id === id ? updated : t)));
    } else {
      setEverythingElseTasks(
        everythingElseTasks.map((t) => (t.id === id ? updated : t))
      );
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
    <div className="min-h-screen bg-white">
      <Header onAddClick={() => setIsModalOpen(true)} />

      <main className="max-w-6xl mx-auto px-6 py-12">
        {authLoading ? (
          <div className="text-center py-20">
            <p className="text-gray-500 font-medium">Loading...</p>
          </div>
        ) : !user ? (
          <div className="text-center py-20">
            <p className="text-gray-500 font-medium">Redirecting to login...</p>
          </div>
        ) : isLoading ? (
          <div className="text-center py-20">
            <p className="text-gray-500 font-medium">Loading tasks...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Today Column (2/3 width on lg) */}
            <div className="lg:col-span-2">
              <div
                className="rounded-2xl border border-gray-200 p-8 min-h-96 transition-all"
                onDragOver={handleDragOver}
                onDrop={handleDropOnToday}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Today
                </h2>
                <p className="text-sm text-gray-500 mb-6 font-medium">
                  {todayTasks.length} {todayTasks.length === 1 ? 'task' : 'tasks'}
                </p>

                {todayTasks.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-400 text-sm font-medium">
                      All clear for today
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
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
            </div>

            {/* Everything Else Column (1/3 width on lg) */}
            <div>
              <div
                className="rounded-2xl border border-gray-200 p-8 sticky top-24 min-h-96 transition-all"
                onDragOver={handleDragOver}
                onDrop={handleDropOnEverythingElse}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Backlog
                </h2>
                <p className="text-sm text-gray-500 mb-6 font-medium">
                  {everythingElseTasks.length} {everythingElseTasks.length === 1 ? 'task' : 'tasks'}
                </p>

                {everythingElseTasks.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-400 text-sm font-medium">
                      Nothing in backlog
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
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

export interface Task {
  id: string;
  title: string;
  category: string;
  isToday: boolean;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type Category = "FAMILY" | "HEALTH" | "CAREER" | "ESSENTIALS";

export const CATEGORIES: { value: Category; label: string; color: string }[] = [
  { value: "FAMILY", label: "Family", color: "px-3 py-1 text-xs rounded-lg bg-blue-100 text-blue-600 border border-blue-200" },
  { value: "HEALTH", label: "Health", color: "px-3 py-1 text-xs rounded-lg bg-green-100 text-green-600 border border-green-200" },
  { value: "CAREER", label: "Career", color: "px-3 py-1 text-xs rounded-lg bg-purple-100 text-purple-600 border border-purple-200" },
  {
    value: "ESSENTIALS",
    label: "Essentials",
    color: "px-3 py-1 text-xs rounded-lg bg-orange-100 text-orange-600 border border-orange-200",
  },
];

export const getCategoryColor = (category: Category): string => {
  return CATEGORIES.find((cat) => cat.value === category)?.color || "";
};

export const getCategoryLabel = (category: Category): string => {
  return CATEGORIES.find((cat) => cat.value === category)?.label || category;
};

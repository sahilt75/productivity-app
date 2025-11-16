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
  { value: "FAMILY", label: "Family", color: "bg-blue-100 text-blue-800" },
  { value: "HEALTH", label: "Health", color: "bg-green-100 text-green-800" },
  { value: "CAREER", label: "Career", color: "bg-purple-100 text-purple-800" },
  {
    value: "ESSENTIALS",
    label: "Essentials",
    color: "bg-orange-100 text-orange-800",
  },
];

export const getCategoryColor = (category: Category): string => {
  return CATEGORIES.find((cat) => cat.value === category)?.color || "";
};

export const getCategoryLabel = (category: Category): string => {
  return CATEGORIES.find((cat) => cat.value === category)?.label || category;
};

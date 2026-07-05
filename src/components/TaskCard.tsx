"use client";

import { useState } from "react";
import { updateTaskStatus, deleteTask } from "@/lib/actions";

type Task = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  dueDate: string | null;
  creatorId: string;
  assignee: { id: string; name: string } | null;
  creator: { id: string; name: string };
};

const statusColors: Record<string, string> = {
  TODO: "bg-gray-100 text-gray-700",
  IN_PROGRESS: "bg-blue-100 text-blue-700",
  DONE: "bg-green-100 text-green-700",
};

const priorityColors: Record<string, string> = {
  LOW: "bg-slate-100 text-slate-600",
  MEDIUM: "bg-yellow-100 text-yellow-700",
  HIGH: "bg-red-100 text-red-700",
};

const statusLabels: Record<string, string> = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
};

export default function TaskCard({
  task,
  onEdit,
}: {
  task: Task;
  onEdit: (task: Task) => void;
}) {
  const [isUpdating, setIsUpdating] = useState(false);

  async function handleStatusChange(newStatus: string) {
    setIsUpdating(true);
    await updateTaskStatus(task.id, newStatus);
    setIsUpdating(false);
  }

  async function handleDelete() {
    if (!confirm("Delete this task?")) return;
    setIsUpdating(true);
    await deleteTask(task.id);
  }

  const isOverdue =
    task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "DONE";

  return (
    <div
      className={`bg-white rounded-lg border p-4 transition-opacity ${
        isUpdating ? "opacity-50" : ""
      } ${isOverdue ? "border-red-300" : "border-gray-200"}`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-medium text-gray-900 text-sm leading-tight">
          {task.title}
        </h3>
        <div className="flex gap-1 shrink-0">
          <button
            onClick={() => onEdit(task)}
            className="text-gray-400 hover:text-gray-600 text-xs p-1"
            title="Edit"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="text-gray-400 hover:text-red-500 text-xs p-1"
            title="Delete"
          >
            Del
          </button>
        </div>
      </div>

      {task.description && (
        <p className="text-xs text-gray-500 mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="flex flex-wrap gap-2 mb-3">
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            statusColors[task.status]
          }`}
        >
          {statusLabels[task.status]}
        </span>
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            priorityColors[task.priority]
          }`}
        >
          {task.priority}
        </span>
      </div>

      {task.dueDate && (
        <p
          className={`text-xs mb-2 ${
            isOverdue ? "text-red-500 font-medium" : "text-gray-400"
          }`}
        >
          Due: {new Date(task.dueDate).toLocaleDateString()}
        </p>
      )}

      {task.assignee && (
        <p className="text-xs text-gray-400">
          Assigned to: {task.assignee.name}
        </p>
      )}

      <div className="mt-3 pt-3 border-t border-gray-100">
        <select
          value={task.status}
          onChange={(e) => handleStatusChange(e.target.value)}
          disabled={isUpdating}
          className="text-xs border border-gray-200 rounded px-2 py-1 w-full bg-white text-gray-700"
        >
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
        </select>
      </div>
    </div>
  );
}

"use client";

import { useRef, useState } from "react";
import { createTask, updateTask } from "@/lib/actions";

type User = { id: string; name: string };

type TaskData = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  dueDate: string | null;
  assignee: { id: string; name: string } | null;
} | null;

export default function TaskForm({
  users,
  editingTask,
  onClose,
}: {
  users: User[];
  editingTask: TaskData;
  onClose: () => void;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);

  const isEditing = !!editingTask;

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    try {
      if (isEditing) {
        await updateTask(formData);
      } else {
        await createTask(formData);
      }
      onClose();
    } catch {
      alert("Something went wrong");
    }
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {isEditing ? "Edit Task" : "New Task"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              &times;
            </button>
          </div>

          <form ref={formRef} action={handleSubmit} className="space-y-4">
            {isEditing && (
              <input type="hidden" name="id" value={editingTask.id} />
            )}

            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Title *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                defaultValue={editingTask?.title || ""}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                defaultValue={editingTask?.description || ""}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="priority"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Priority
                </label>
                <select
                  id="priority"
                  name="priority"
                  defaultValue={editingTask?.priority || "MEDIUM"}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>

              {isEditing && (
                <div>
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    defaultValue={editingTask?.status || "TODO"}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                  >
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="DONE">Done</option>
                  </select>
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="dueDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Due Date
              </label>
              <input
                id="dueDate"
                name="dueDate"
                type="date"
                defaultValue={
                  editingTask?.dueDate
                    ? new Date(editingTask.dueDate).toISOString().split("T")[0]
                    : ""
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="assigneeId"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Assign To
              </label>
              <select
                id="assigneeId"
                name="assigneeId"
                defaultValue={editingTask?.assignee?.id || ""}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
              >
                <option value="">Unassigned</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading
                  ? "Saving..."
                  : isEditing
                  ? "Update Task"
                  : "Create Task"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

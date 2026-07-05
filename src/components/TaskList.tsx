"use client";

import { useState } from "react";
import TaskCard from "./TaskCard";
import TaskForm from "./TaskForm";

type User = { id: string; name: string };

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

export default function TaskList({
  tasks,
  users,
}: {
  tasks: Task[];
  users: User[];
}) {
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  function handleEdit(task: Task) {
    setEditingTask(task);
    setShowForm(true);
  }

  function handleClose() {
    setShowForm(false);
    setEditingTask(null);
  }

  return (
    <>
      <button
        onClick={() => {
          setEditingTask(null);
          setShowForm(true);
        }}
        className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors"
      >
        + New Task
      </button>

      {tasks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No tasks found.</p>
          <p className="text-sm text-gray-400 mt-1">
            Create a task to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onEdit={handleEdit} />
          ))}
        </div>
      )}

      {showForm && (
        <TaskForm
          users={users}
          editingTask={editingTask}
          onClose={handleClose}
        />
      )}
    </>
  );
}

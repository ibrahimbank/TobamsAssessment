import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import TaskList from "@/components/TaskList";
import TaskFilters from "@/components/TaskFilters";

type SearchParams = Promise<{
  status?: string;
  priority?: string;
  search?: string;
}>;

async function getTasks(filters: {
  status?: string;
  priority?: string;
  search?: string;
}) {
  const where: Record<string, unknown> = {};

  if (filters.status) where.status = filters.status;
  if (filters.priority) where.priority = filters.priority;
  if (filters.search) {
    where.title = { contains: filters.search };
  }

  return prisma.task.findMany({
    where,
    include: {
      creator: { select: { id: true, name: true } },
      assignee: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

async function getUsers() {
  return prisma.user.findMany({
    select: { id: true, name: true },
  });
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const session = await auth();
  const sp = await searchParams;

  const [tasks, users] = await Promise.all([getTasks(sp), getUsers()]);

  // Serialize dates to strings for client components
  const serializedTasks = tasks.map((task) => ({
    ...task,
    dueDate: task.dueDate ? task.dueDate.toISOString() : null,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
  }));

  const todoCount = tasks.filter((t) => t.status === "TODO").length;
  const inProgressCount = tasks.filter(
    (t) => t.status === "IN_PROGRESS"
  ).length;
  const doneCount = tasks.filter((t) => t.status === "DONE").length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome, {session?.user?.name}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage your tasks and stay productive.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">To Do</p>
          <p className="text-2xl font-bold text-gray-900">{todoCount}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">In Progress</p>
          <p className="text-2xl font-bold text-blue-600">{inProgressCount}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Done</p>
          <p className="text-2xl font-bold text-green-600">{doneCount}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <Suspense fallback={null}>
          <TaskFilters />
        </Suspense>
      </div>

      {/* Task List */}
      <TaskList tasks={serializedTasks} users={users} />
    </div>
  );
}

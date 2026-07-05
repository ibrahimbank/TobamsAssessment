"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export default function TaskFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const status = searchParams.get("status") || "";
  const priority = searchParams.get("priority") || "";
  const search = searchParams.get("search") || "";

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`/dashboard?${params.toString()}`);
    },
    [router, searchParams]
  );

  function clearFilters() {
    router.push("/dashboard");
  }

  const hasFilters = status || priority || search;

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <input
        type="text"
        placeholder="Search tasks..."
        defaultValue={search}
        onChange={(e) => updateParams("search", e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:w-64"
      />

      <select
        value={status}
        onChange={(e) => updateParams("status", e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Statuses</option>
        <option value="TODO">To Do</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="DONE">Done</option>
      </select>

      <select
        value={priority}
        onChange={(e) => updateParams("priority", e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Priorities</option>
        <option value="LOW">Low</option>
        <option value="MEDIUM">Medium</option>
        <option value="HIGH">High</option>
      </select>

      {hasFilters && (
        <button
          onClick={clearFilters}
          className="text-sm text-gray-500 hover:text-gray-700 px-3 py-2"
        >
          Clear
        </button>
      )}
    </div>
  );
}

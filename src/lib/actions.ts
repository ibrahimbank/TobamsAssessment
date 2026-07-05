"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function createTask(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const description = (formData.get("description") as string) || null;
  const priority = (formData.get("priority") as string) || "MEDIUM";
  const assigneeId = (formData.get("assigneeId") as string) || null;
  const dueDate = formData.get("dueDate") as string;

  if (!title?.trim()) throw new Error("Title is required");

  await prisma.task.create({
    data: {
      title: title.trim(),
      description,
      priority,
      status: "TODO",
      creatorId: session.user.id,
      assigneeId: assigneeId || null,
      dueDate: dueDate ? new Date(dueDate) : null,
    },
  });

  revalidatePath("/dashboard");
}

export async function updateTask(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const description = (formData.get("description") as string) || null;
  const status = formData.get("status") as string;
  const priority = formData.get("priority") as string;
  const assigneeId = (formData.get("assigneeId") as string) || null;
  const dueDate = formData.get("dueDate") as string;

  if (!id || !title?.trim()) throw new Error("Task ID and title are required");

  await prisma.task.update({
    where: { id },
    data: {
      title: title.trim(),
      description,
      status,
      priority,
      assigneeId: assigneeId || null,
      dueDate: dueDate ? new Date(dueDate) : null,
    },
  });

  revalidatePath("/dashboard");
}

export async function updateTaskStatus(taskId: string, status: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.task.update({
    where: { id: taskId },
    data: { status },
  });

  revalidatePath("/dashboard");
}

export async function deleteTask(taskId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.task.delete({
    where: { id: taskId },
  });

  revalidatePath("/dashboard");
}

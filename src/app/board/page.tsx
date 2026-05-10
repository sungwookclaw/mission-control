"use client";

import { TaskBoard } from "@/components/TaskBoard";
import { useTasks } from "@/hooks/useTasks";

export default function BoardPage() {
  const { tasks, addTask, moveTask, deleteTask } = useTasks();

  return (
    <TaskBoard
      tasks={tasks}
      onMove={moveTask}
      onAdd={addTask}
      onDelete={deleteTask}
    />
  );
}

import { create } from "zustand";
import { Task } from "@/types/task";

interface TaskStore {
  tasks: Task[];
  loading: boolean;
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (updatedTask: Partial<Task> & { _id: string }) => void;
  removeTask: (id: string) => void;
  setLoading: (loading: boolean) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  loading: false,

  // Using shorthand for (tasks) => set({ tasks: tasks })
  setTasks: (tasks) => set({ tasks }),

  addTask: (task) =>
    set((state) => ({
      tasks: [task, ...state.tasks], // Adds new task to the top
    })),

  updateTask: (updatedTask) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task._id === updatedTask._id 
          ? { ...task, ...updatedTask } 
          : task
      ),
    })),

  removeTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task._id !== id),
    })),

  setLoading: (loading) => set({ loading }),
}));
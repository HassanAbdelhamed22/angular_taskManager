export interface Task {
  id: string;
  title: string;
  description: string;
  priority: string;
  dueDate: string;
  category: string;
  tags: string;
  isDone: boolean;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

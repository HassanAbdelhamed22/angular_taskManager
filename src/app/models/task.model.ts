export interface Task {
  id: string;
  userId: string;
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

export interface PaginatedResponse<T> {
  first: number;
  prev: number | null;
  next: number | null;
  last: number;
  pages: number;
  items: number;
  data: T[];
}

export interface TaskQueryParams {
  _page?: number;
  _limit?: number;
  _sort?: string;
  _order?: string;
  title_like?: string;
  priority?: string;
  category?: string;
  isDone?: boolean | string;
  [key: string]: any;
}

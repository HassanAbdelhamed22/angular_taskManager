import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getTasks() {
    const userId = this.authService.getCurrentUserId();
    return this.http.get<Task[]>(`${this.apiUrl}/tasks?userId=${userId}`);
  }

  createTask(task: Task) {
    task.userId = this.authService.getCurrentUserId() as string;
    return this.http.post<Task>(`${this.apiUrl}/tasks`, task);
  }

  updateTask(taskId: string, changes: Partial<Task>) {
    return this.http.patch<Task>(`${this.apiUrl}/tasks/${taskId}`, changes);
  }

  deleteTask(id: string) {
    return this.http.delete<Task>(`${this.apiUrl}/tasks/${id}`);
  }
}

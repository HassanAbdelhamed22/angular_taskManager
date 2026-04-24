import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { PaginatedResponse, Task, TaskQueryParams } from '../models/task.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getTasks(queryParams?: TaskQueryParams): Observable<PaginatedResponse<Task> | Task[]> {
    const userId = this.authService.getCurrentUserId();
    let params = new HttpParams().set('userId', userId as string);

    if (queryParams) {
      Object.keys(queryParams).forEach((key) => {
        if (queryParams[key] !== undefined && queryParams[key] !== null && queryParams[key] !== '') {
          params = params.set(key, queryParams[key]);
        }
      });
    }

    return this.http.get<Task[]>(`${this.apiUrl}/tasks`, { params, observe: 'response' }).pipe(
      map((res: HttpResponse<Task[]>) => {
        const totalCount = Number(res.headers.get('X-Total-Count') || 0);
        const data = res.body || [];
        
        // If we are paginating, return the wrapper expected by the component
        if (queryParams?._page && queryParams?._limit) {
          return {
            data,
            items: totalCount,
            pages: Math.ceil(totalCount / queryParams._limit),
            first: 1,
            last: Math.ceil(totalCount / queryParams._limit),
            prev: queryParams._page > 1 ? queryParams._page - 1 : null,
            next: queryParams._page < Math.ceil(totalCount / queryParams._limit) ? queryParams._page + 1 : null
          } as PaginatedResponse<Task>;
        }
        
        return data;
      })
    );
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

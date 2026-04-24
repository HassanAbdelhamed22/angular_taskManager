import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { TaskInputComponent } from '../../components/task-input/task-input.component';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-add-task',
  imports: [FormsModule, TaskInputComponent],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.css',
})
export class AddTaskComponent {
  taskData: Task = {
    id: '',
    userId: '',
    title: '',
    description: '',
    priority: 'Medium',
    dueDate: '',
    category: 'Personal',
    tags: '',
    isDone: false,
  };

  constructor(
    private router: Router, 
    private taskService: TaskService,
    private toastService: ToastService
  ) {}

  handleSubmit(newTask: Task) {
    if (!newTask.title.trim()) {
      this.toastService.showToast('Please enter a task title', 'warning');
      return;
    }

    this.taskService.createTask(newTask).subscribe({
      next: () => {
        this.toastService.showToast('Task created successfully', 'success');
        this.router.navigate(['/tasks']);
      },
      error: (error) => {
        console.error('Error creating task:', error);
        this.toastService.showToast('Failed to create task', 'error');
      }
    });
  }

  getCategoryIcon(category: string): string {
    switch (category) {
      case 'Work': return 'fas fa-briefcase';
      case 'Personal': return 'fas fa-user';
      case 'Study': return 'fas fa-book';
      default: return 'fas fa-folder';
    }
  }
}

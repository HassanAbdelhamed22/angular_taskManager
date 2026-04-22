import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Task, Toast } from './models/task.model';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  showHeader = true;

  isModalOpen = false;

  taskFormData!: Task;

  toasts: Toast[] = [];

  deletedTaskId = '';

  incomingTask!: Task;

  // Delete confirmation modal
  isDeleteModalOpen = false;
  taskToDeleteId = '';
  taskToDeleteName = '';

  showToast(message: string, type: 'success' | 'error' | 'warning' | 'info') {
    const toast: Toast = {
      id: uuidv4(),
      message,
      type,
    };

    this.toasts.push(toast);

    setTimeout(() => {
      this.toasts = this.toasts.filter((t) => t.id !== toast.id);
    }, 3000);
  }

  openModal() {
    this.taskFormData = {
      id: '',
      userId: '',
      title: '',
      description: '',
      priority: 'Low',
      dueDate: '',
      category: 'Personal',
      tags: '',
      isDone: false,
    };

    this.isModalOpen = true;
  }

  openEditModal(task: Task) {
    this.incomingTask = task;

    if (this.incomingTask) {
      this.taskFormData = { ...this.incomingTask };
      this.isModalOpen = true;
    }
  }

  closeModal() {
    this.isModalOpen = false;
  }

  addTask(taskToSave: Task) {
    if (!taskToSave.id) {
      taskToSave.id = uuidv4();
      this.showToast('Task added successfully', 'success');
    } else {
      this.showToast('Task updated successfully', 'success');
    }

    this.incomingTask = { ...taskToSave };
    this.isModalOpen = false;
  }

  deleteTaskFn(task: Task) {
    this.taskToDeleteId = task.id;
    this.taskToDeleteName = task.title;
    this.isDeleteModalOpen = true;
  }

  confirmDelete() {
    this.deletedTaskId = this.taskToDeleteId;
    this.isDeleteModalOpen = false;
  }

  cancelDelete() {
    this.isDeleteModalOpen = false;
  }

  onStatusChanged(taskId: string) {
    this.showToast('Task status changed successfully', 'success');
  }
}

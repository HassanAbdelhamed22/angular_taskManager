import { Component } from '@angular/core';
import { HeaderComponent } from './components/header/header';
import { TaskListComponent } from './components/taskList/taskList';
import { FooterComponent } from './components/footer/footer';
import { TaskInputComponent } from './components/taskInput/taskInput';
import { HomeComponent } from './components/home/home';
import { Task, Toast } from './types';
import { v4 as uuidv4 } from 'uuid';
import { Toasts } from './components/toasts/toasts';

@Component({
  selector: 'app-root',
  imports: [
    HeaderComponent,
    HomeComponent,
    TaskInputComponent,
    TaskListComponent,
    FooterComponent,
    Toasts,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  tasks: Task[] = [];

  isModalOpen = false;

  taskToEdit!: Task;

  toasts: Toast[] = [];

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
    this.taskToEdit = {
      id: '',
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

  openEditModal(taskId: string) {
    const task = this.tasks.find((task) => task.id === taskId);

    if (task) {
      this.taskToEdit = { ...task };
      this.isModalOpen = true;
    }
  }

  closeModal() {
    this.isModalOpen = false;
  }

  addTask(taskToSave: Task) {
    const existingIndex = this.tasks.findIndex((t) => t.id === taskToSave.id);

    if (existingIndex !== -1) {
      this.tasks[existingIndex] = taskToSave;
      this.showToast('Task updated successfully', 'success');
    } else {
      this.tasks.push(taskToSave);
      this.showToast('Task added successfully', 'success');
    }

    this.isModalOpen = false;
  }

  deleteTaskFn(taskId: string) {
    this.tasks = this.tasks.filter((task) => task.id !== taskId);
    this.showToast('Task deleted successfully', 'success');
  }

  onStatusChanged(taskId: string) {
    this.showToast('Task status changed successfully', 'success');
  }
}

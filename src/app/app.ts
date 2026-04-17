import { Component } from '@angular/core';
import { HeaderComponent } from './components/header/header';
import { TaskListComponent } from './components/taskList/taskList';
import { FooterComponent } from './components/footer/footer';
import { TaskInputComponent } from './components/taskInput/taskInput';
import { HomeComponent } from './components/home/home';
import { ConfirmModalComponent } from './components/confirmModal/confirmModal';
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
    ConfirmModalComponent,
    Toasts,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private STORAGE_KEY = 'task_manager_tasks';

  tasks: Task[] = [];

  constructor() {
    this.loadTasks();
  }

  private loadTasks() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        this.tasks = JSON.parse(saved);
      } catch {
        this.tasks = [];
      }
    }
  }

  private saveTasks() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.tasks));
  }

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

    this.saveTasks();
    this.isModalOpen = false;
  }

  // Delete confirmation modal
  isDeleteModalOpen = false;
  taskToDeleteId = '';
  taskToDeleteName = '';

  deleteTaskFn(taskId: string) {
    const task = this.tasks.find((t) => t.id === taskId);
    this.taskToDeleteId = taskId;
    this.taskToDeleteName = task ? task.title : 'this task';
    this.isDeleteModalOpen = true;
  }

  confirmDelete() {
    this.tasks = this.tasks.filter((t) => t.id !== this.taskToDeleteId);
    this.saveTasks();
    this.isDeleteModalOpen = false;
    this.showToast('Task deleted successfully', 'success');
  }

  cancelDelete() {
    this.isDeleteModalOpen = false;
  }

  onStatusChanged(taskId: string) {
    this.saveTasks();
    this.showToast('Task status changed successfully', 'success');
  }
}

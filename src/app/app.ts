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
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';

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
    LoginComponent,
    RegisterComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
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

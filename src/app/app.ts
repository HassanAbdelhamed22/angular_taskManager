import { Component } from '@angular/core';
import { HeaderComponent } from './components/header/header';
import { TaskListComponent } from './components/taskList/taskList';
import { FooterComponent } from './components/footer/footer';
import { TaskInputComponent } from './components/taskInput/taskInput';
import { HomeComponent } from './components/home/home';
import { Task } from './types';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, HomeComponent, TaskInputComponent, TaskListComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  tasks: Task[] = [];

  isModalOpen = false;

  taskToEdit!: Task;

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
    } else {
      this.tasks.push(taskToSave);
    }

    this.isModalOpen = false;
  }

  deleteTaskFn(taskId: string) {
    this.tasks = this.tasks.filter((task) => task.id !== taskId);
    alert(`Task ${taskId} deleted`);
  }

  onStatusChanged(taskId: string) {
    alert(`Task ${taskId} status changed`);
  }
}

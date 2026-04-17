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

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  addTask(task: Task) {
    this.tasks.push(task);
  }

  onStatusChanged(taskId: string) {
    alert(`Task ${taskId} status changed`);
  }
}

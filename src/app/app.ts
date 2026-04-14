import { Component, signal } from '@angular/core';
import { HeaderComponent } from './components/header/header';
import { TaskListComponent } from './components/taskList/taskList';
import { FooterComponent } from './components/footer/footer';
import { TaskInputComponent } from './components/taskInput/taskInput';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, TaskInputComponent, TaskListComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('task-manager');
}

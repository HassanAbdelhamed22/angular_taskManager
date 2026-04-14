import { Component } from '@angular/core';
import { TaskCardComponent } from '../taskCard/taskCard';

@Component({
  selector: 'app-task-list',
  imports: [TaskCardComponent],
  templateUrl: './taskList.html',
  styleUrls: ['./taskList.css'],
})
export class TaskListComponent {}

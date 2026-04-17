import { Component, Input } from '@angular/core';
import { Task } from '../../types';

@Component({
  selector: 'app-task-card',
  templateUrl: './taskCard.html',
  styleUrls: ['./taskCard.css'],
})
export class TaskCardComponent {
  @Input() task!: Task;
}

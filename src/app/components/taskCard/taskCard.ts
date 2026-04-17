import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '../../types';

@Component({
  selector: 'app-task-card',
  templateUrl: './taskCard.html',
  styleUrls: ['./taskCard.css'],
})
export class TaskCardComponent {
  @Input() task!: Task;

  @Output() statusChanged = new EventEmitter<string>();

  toggleDone() {
    this.task.isDone = !this.task.isDone;
    this.statusChanged.emit(this.task.id);
  }
}

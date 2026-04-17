import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../types';

@Component({
  selector: 'app-task-card',
  imports: [CommonModule],
  templateUrl: './taskCard.html',
  styleUrls: ['./taskCard.css'],
})
export class TaskCardComponent {
  @Input() task!: Task;

  @Output() statusChanged = new EventEmitter<string>();

  @Output() deleteTask = new EventEmitter<string>();

  @Output() editTask = new EventEmitter<string>();

  toggleDone() {
    this.task.isDone = !this.task.isDone;
    this.statusChanged.emit(this.task.id);
  }

  deleteTaskFn() {
    this.deleteTask.emit(this.task.id);
  }

  editTaskFn() {
    this.editTask.emit(this.task.id);
  }

  getTags() {
    return this.task.tags.split(',').map((tag) => tag.trim());
  }
}

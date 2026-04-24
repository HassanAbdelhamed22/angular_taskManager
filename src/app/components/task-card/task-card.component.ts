import { Component, EventEmitter, Input, Output, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-card',
  imports: [CommonModule],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.css',
})
export class TaskCardComponent implements OnDestroy {
  @Input() task!: Task;

  @Output() statusChanged = new EventEmitter<string>();

  @Output() deleteTask = new EventEmitter<string>();

  @Output() editTask = new EventEmitter<string>();

  @Output() notifyDestroy = new EventEmitter<string>();

  ngOnDestroy() {
    this.notifyDestroy.emit(`Task "${this.task.title}" deleted`);
  }

  toggleDone() {
    this.statusChanged.emit(this.task.id);
  }

  deleteTaskFn() {
    this.deleteTask.emit(this.task.id);
  }

  editTaskFn() {
    this.editTask.emit(this.task.id);
  }

  getTags() {
    if (!this.task.tags) return [];
    return this.task.tags.split(',').map((tag) => tag.trim()).filter(t => t !== '');
  }

  isOverdue() {
    if (!this.task.dueDate || this.task.isDone) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(this.task.dueDate);
    return dueDate < today;
  }

  getFormattedDate() {
    if (!this.task.dueDate) return 'No due date';
    const date = new Date(this.task.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (this.isOverdue()) return 'Overdue';
    
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }
}

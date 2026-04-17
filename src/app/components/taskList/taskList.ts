import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskCardComponent } from '../taskCard/taskCard';
import { TabsComponent } from '../tabs/tabs';
import { Task } from '../../types';

@Component({
  selector: 'app-task-list',
  imports: [TaskCardComponent, TabsComponent, CommonModule],
  templateUrl: './taskList.html',
  styleUrls: ['./taskList.css'],
})
export class TaskListComponent {
  @Input() tasks: Task[] = [];

  @Output() statusChanged = new EventEmitter<string>();

  @Output() openModal = new EventEmitter<void>();

  @Output() deleteTask = new EventEmitter<string>();

  @Output() editTask = new EventEmitter<string>();

  filter: 'all' | 'not_done' | 'done' = 'all';

  getFilteredTasks() {
    return this.tasks.filter((task) => {
      if (this.filter === 'all') {
        return true;
      }
      if (this.filter === 'not_done') {
        return !task.isDone;
      }
      if (this.filter === 'done') {
        return task.isDone;
      }
      return true;
    });
  }

  setFilter(newFilter: 'all' | 'not_done' | 'done') {
    this.filter = newFilter;
  }

  onStatusChanged(taskId: string) {
    this.statusChanged.emit(taskId);
  }

  openModalFn() {
    this.openModal.emit();
  }

  deleteTaskFn(taskId: string) {
    this.deleteTask.emit(taskId);
  }

  editTaskFn(taskId: string) {
    this.editTask.emit(taskId);
  }

  trackByFn(index: number, task: Task) {
    return task.id;
  }

  getNotDoneCount(): number {
    return this.tasks.filter((t) => !t.isDone).length;
  }

  getDoneCount(): number {
    return this.tasks.filter((t) => t.isDone).length;
  }
}

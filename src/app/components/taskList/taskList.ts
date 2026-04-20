import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
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
export class TaskListComponent implements OnInit, OnChanges {
  @Input() incomingTask!: Task;

  @Input() deletedTaskId: string = '';

  @Output() statusChanged = new EventEmitter<string>();

  @Output() openModal = new EventEmitter<void>();

  @Output() deleteTask = new EventEmitter<Task>();

  @Output() editTask = new EventEmitter<Task>();

  @Output() taskDestroyedAlert = new EventEmitter<string>();

  filter: 'all' | 'not_done' | 'done' = 'all';

  private STORAGE_KEY = 'task_manager_tasks';

  tasks: Task[] = [];

  private loadTasks() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        this.tasks = JSON.parse(saved);
      } catch {
        this.tasks = [];
      }
    }
  }

  private saveTasks() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.tasks));
  }

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
    const task = this.tasks.find((t) => t.id === taskId);

    if (task) {
      task.isDone = !task.isDone;
      this.saveTasks();
    }
    this.statusChanged.emit(taskId);
  }

  openModalFn() {
    this.openModal.emit();
  }

  deleteTaskFn(task: Task) {
    this.deleteTask.emit(task);
  }

  editTaskFn(task: Task) {
    this.editTask.emit(task);
  }

  onTaskDestroyed(message: string) {
    this.taskDestroyedAlert.emit(message);
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

  ngOnInit(): void {
    this.loadTasks();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['incomingTask'] && changes['incomingTask'].currentValue) {
      const newTask = changes['incomingTask'].currentValue;

      if (newTask.id) {
        const existingIndex = this.tasks.findIndex((t) => t.id === newTask.id);

        if (existingIndex !== -1) {
          this.tasks[existingIndex] = newTask;
        } else {
          this.tasks.push(newTask);
        }

        this.saveTasks();
      }
    }

    if (changes['deletedTaskId'] && changes['deletedTaskId'].currentValue) {
      this.tasks = this.tasks.filter((t) => t.id !== changes['deletedTaskId'].currentValue);
      this.saveTasks();
    }
  }
}

import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskCardComponent } from '../../components/task-card/task-card.component';
import { TabsComponent } from '../../components/tabs/tabs.component';
import { Task } from '../../models/task.model';
import { TaskInputComponent } from '../../components/task-input/task-input.component';

@Component({
  selector: 'app-task-list',
  imports: [TaskCardComponent, TabsComponent, CommonModule, TaskInputComponent],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css',
})
export class TaskListComponent implements OnInit, OnChanges {
  @Input() incomingTask!: Task;
  @Input() deletedTaskId: string = '';

  @Output() statusChanged = new EventEmitter<string>();
  @Output() taskDestroyedAlert = new EventEmitter<string>();

  filter: 'all' | 'not_done' | 'done' = 'all';
  private STORAGE_KEY = 'task_manager_tasks';

  tasks: Task[] = [];

  // Modal State
  isModalOpen = false;
  taskFormData: Task | null = null;

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
      if (this.filter === 'all') return true;
      if (this.filter === 'not_done') return !task.isDone;
      if (this.filter === 'done') return task.isDone;
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
    this.taskFormData = null;
    this.isModalOpen = true;
  }

  editTaskFn(task: Task) {
    this.taskFormData = { ...task };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.taskFormData = null;
  }

  onTaskSaved(task: Task) {
    const existingIndex = this.tasks.findIndex((t) => t.id === task.id);
    if (existingIndex !== -1) {
      this.tasks[existingIndex] = task;
    } else {
      this.tasks.push(task);
    }
    this.saveTasks();
    this.isModalOpen = false;
  }

  deleteTaskFn(task: Task) {
    this.tasks = this.tasks.filter((t) => t.id !== task.id);
    this.saveTasks();
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
    if (changes['deletedTaskId'] && changes['deletedTaskId'].currentValue) {
      this.tasks = this.tasks.filter((t) => t.id !== changes['deletedTaskId'].currentValue);
      this.saveTasks();
    }
  }
}

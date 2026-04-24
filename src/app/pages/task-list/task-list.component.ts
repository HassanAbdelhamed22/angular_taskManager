import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  signal,
  computed
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskCardComponent } from '../../components/task-card/task-card.component';
import { TabsComponent } from '../../components/tabs/tabs.component';
import { Task, TaskQueryParams, PaginatedResponse } from '../../models/task.model';
import { TaskInputComponent } from '../../components/task-input/task-input.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { TaskService } from '../../services/task.service';
import { ToastService } from '../../services/toast.service';
import { ConfirmDialogService } from '../../services/confirm-dialog.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [TaskCardComponent, TabsComponent, CommonModule, FormsModule, TaskInputComponent, PaginationComponent],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css',
})
export class TaskListComponent implements OnInit, OnChanges {
  @Input() incomingTask!: Task;
  @Input() deletedTaskId: string = '';

  @Output() statusChanged = new EventEmitter<string>();
  @Output() taskDestroyedAlert = new EventEmitter<string>();

  // State using Signals
  tasks = signal<Task[]>([]);
  filterStatus = signal<'all' | 'not_done' | 'done'>('all');
  
  // Pagination & Filters
  currentPage = signal(1);
  perPage = signal(5);
  totalItems = signal(0);
  totalPages = signal(0);
  searchQuery = signal('');
  filterPriority = signal('');
  sortBy = signal('dueDate_asc');

  // We fetch counts globally so tabs look correct
  allCount = signal(0);
  notDoneCount = signal(0);
  doneCount = signal(0);

  // Modal State
  isModalOpen = false;
  taskFormData: Task | null = null;

  constructor(
    private taskService: TaskService,
    private toastService: ToastService,
    private confirmDialogService: ConfirmDialogService
  ) {}

  ngOnInit(): void {
    this.loadGlobalCounts();
    this.loadTasks();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['incomingTask'] && changes['incomingTask'].currentValue) || (changes['deletedTaskId'] && changes['deletedTaskId'].currentValue)) {
      this.loadGlobalCounts();
      this.loadTasks();
    }
  }

  private loadGlobalCounts() {
    this.taskService.getTasks({ _page: 1, _limit: 1 }).subscribe(res => this.allCount.set(Array.isArray(res) ? res.length : (res as any).items));
    this.taskService.getTasks({ _page: 1, _limit: 1, isDone: false }).subscribe(res => this.notDoneCount.set(Array.isArray(res) ? res.length : (res as any).items));
    this.taskService.getTasks({ _page: 1, _limit: 1, isDone: true }).subscribe(res => this.doneCount.set(Array.isArray(res) ? res.length : (res as any).items));
  }

  private loadTasks() {
    const sortVal = this.sortBy().split('_');
    const params: TaskQueryParams = {
      _page: this.currentPage(),
      _limit: this.perPage(),
      _sort: sortVal[0],
      _order: sortVal[1]
    };

    if (this.searchQuery()) params.title_like = this.searchQuery();
    if (this.filterPriority()) params.priority = this.filterPriority();
    
    const status = this.filterStatus();
    if (status === 'done') params.isDone = true;
    else if (status === 'not_done') params.isDone = false;
    else {
      // For 'all', we don't send isDone to get both
    }

    this.taskService.getTasks(params).subscribe({
      next: (res) => {
        if ('data' in res) {
          this.tasks.set(res.data);
          this.totalItems.set(res.items);
          this.totalPages.set(res.pages);
        } else {
          // fallback
          this.tasks.set(res as Task[]);
          this.totalItems.set((res as Task[]).length);
          this.totalPages.set(1);
        }
      },
      error: (err) => {
        console.error('Failed to load tasks', err);
        this.toastService.showToast('Failed to load tasks', 'error');
      }
    });
  }

  setFilter(newFilter: 'all' | 'not_done' | 'done') {
    this.filterStatus.set(newFilter);
    this.currentPage.set(1);
    this.loadTasks();
  }

  onSearchChange() {
    this.currentPage.set(1);
    this.loadTasks();
  }

  onFilterPriorityChange() {
    this.currentPage.set(1);
    this.loadTasks();
  }

  onSortChange() {
    this.currentPage.set(1);
    this.loadTasks();
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.loadTasks();
    }
  }

  getPageArray() {
    return Array(this.totalPages()).fill(0).map((x, i) => i + 1);
  }

  onStatusChanged(taskId: string) {
    const task = this.tasks().find((t) => t.id === taskId);
    if (task) {
      const newStatus = !task.isDone;
      this.taskService.updateTask(taskId, { isDone: newStatus }).subscribe({
        next: () => {
          this.toastService.showToast(`Task marked as ${newStatus ? 'completed' : 'pending'}`, 'success');
          this.statusChanged.emit(taskId);
          this.loadGlobalCounts();
          this.loadTasks();
        },
        error: (err) => {
          console.error('Failed to update task status', err);
          this.toastService.showToast('Failed to update task', 'error');
        }
      });
    }
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
    const isEdit = !!this.taskFormData;
    
    if (isEdit) {
      this.taskService.updateTask(task.id, task).subscribe({
        next: () => {
          this.isModalOpen = false;
          this.taskFormData = null;
          this.toastService.showToast('Task updated successfully', 'success');
          this.loadGlobalCounts();
          this.loadTasks();
        },
        error: (err) => {
          console.error('Failed to update task', err);
          this.toastService.showToast('Failed to update task', 'error');
        }
      });
    } else {
      this.taskService.createTask(task).subscribe({
        next: () => {
          this.isModalOpen = false;
          this.toastService.showToast('Task created successfully', 'success');
          this.loadGlobalCounts();
          this.loadTasks();
        },
        error: (err) => {
          console.error('Failed to create task', err);
          this.toastService.showToast('Failed to create task', 'error');
        }
      });
    }
  }

  async deleteTaskFn(task: Task) {
    const confirmed = await this.confirmDialogService.confirm({
      title: 'Delete Task',
      message: `Are you sure you want to delete "${task.title}"? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel'
    });

    if (confirmed) {
      this.taskService.deleteTask(task.id).subscribe({
        next: () => {
          this.taskDestroyedAlert.emit(`Task "${task.title}" was deleted.`);
          this.toastService.showToast('Task deleted successfully', 'success');
          this.loadGlobalCounts();
          this.loadTasks();
        },
        error: (err) => {
          console.error('Failed to delete task', err);
          this.toastService.showToast('Failed to delete task', 'error');
        }
      });
    }
  }

  onTaskDestroyed(message: string) {
    this.taskDestroyedAlert.emit(message);
  }

  trackByFn(index: number, task: Task) {
    return task.id;
  }
}

import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  signal,
  computed,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskCardComponent } from '../../components/task-card/task-card.component';
import { TabsComponent } from '../../components/tabs/tabs.component';
import { Task, TaskQueryParams } from '../../models/task.model';
import { TaskInputComponent } from '../../components/task-input/task-input.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { TaskService } from '../../services/task.service';
import { ToastService } from '../../services/toast.service';
import { ConfirmDialogService } from '../../services/confirm-dialog.service';
import { CustomSelectComponent, SelectOption } from '../../components/custom-select/custom-select.component';

@Component({
  selector: 'app-task-list',
  imports: [
    TaskCardComponent,
    TabsComponent,
    CommonModule,
    FormsModule,
    TaskInputComponent,
    PaginationComponent,
    CustomSelectComponent,
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css',
})
export class TaskListComponent implements OnInit, OnChanges {
  @Input() incomingTask!: Task;
  @Input() deletedTaskId: string = '';

  @Output() statusChanged = new EventEmitter<string>();
  @Output() taskDestroyedAlert = new EventEmitter<string>();
  
  todayDate: string = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // State using Signals
  tasks = signal<Task[]>([]);
  filterStatus = signal<'all' | 'not_done' | 'done'>('all');

  // Pagination & Filters
  currentPage = signal(1);
  perPage = signal(5);
  totalItems = signal(0);
  searchQuery = signal('');
  filterPriority = signal('');
  sortBy = signal('dueDate_asc');
  refreshTrigger = signal(0);

  priorityOptions: SelectOption[] = [
    { label: 'All Priorities', value: '' },
    { label: 'High Priority', value: 'High', icon: 'fas fa-circle text-danger' },
    { label: 'Medium Priority', value: 'Medium', icon: 'fas fa-circle text-warning' },
    { label: 'Low Priority', value: 'Low', icon: 'fas fa-circle text-success' },
  ];

  sortOptions: SelectOption[] = [
    { label: 'Soonest Due', value: 'dueDate_asc' },
    { label: 'Latest Due', value: 'dueDate_desc' },
    { label: 'Name (A-Z)', value: 'title_asc' },
    { label: 'Name (Z-A)', value: 'title_desc' },
  ];

  totalPages = computed(() => Math.ceil(this.totalItems() / this.perPage()));

  queryParams = computed(() => {
    this.refreshTrigger(); // Force re-fetch on trigger change
    const sortVal = this.sortBy().split('_');

    const params: TaskQueryParams = {
      _page: this.currentPage(),
      _limit: this.perPage(),
      _sort: sortVal[0],
      _order: sortVal[1],
    };

    if (this.searchQuery()) params.title_like = this.searchQuery();
    if (this.filterPriority()) params.priority = this.filterPriority();

    const status = this.filterStatus();
    if (status === 'done') params.isDone = true;
    else if (status === 'not_done') params.isDone = false;

    return params;
  });

  allCount = signal(0);
  notDoneCount = signal(0);
  doneCount = signal(0);

  isModalOpen = false;
  taskFormData: Task | null = null;

  constructor(
    private taskService: TaskService,
    private toastService: ToastService,
    private confirmDialogService: ConfirmDialogService,
  ) {
    effect(() => {
      const params = this.queryParams();

      this.taskService.getTasks(params).subscribe({
        next: (res) => {
          if ('data' in res) {
            this.tasks.set(res.data);
            this.totalItems.set(res.items);
          } else {
            this.tasks.set(res as Task[]);
            this.totalItems.set((res as Task[]).length);
          }
        },
        error: (err) => {
          console.error('Failed to load tasks', err);
          this.toastService.showToast('Failed to load tasks', 'error');
        },
      });
    });
  }

  ngOnInit(): void {
    this.loadGlobalCounts();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      (changes['incomingTask'] && changes['incomingTask'].currentValue) ||
      (changes['deletedTaskId'] && changes['deletedTaskId'].currentValue)
    ) {
      this.loadGlobalCounts();
      this.currentPage.update((v) => v);
    }
  }

  private loadGlobalCounts() {
    this.taskService
      .getTasks({ _page: 1, _limit: 1 })
      .subscribe((res) => this.allCount.set(Array.isArray(res) ? res.length : (res as any).items));
    this.taskService
      .getTasks({ _page: 1, _limit: 1, isDone: false })
      .subscribe((res) =>
        this.notDoneCount.set(Array.isArray(res) ? res.length : (res as any).items),
      );
    this.taskService
      .getTasks({ _page: 1, _limit: 1, isDone: true })
      .subscribe((res) => this.doneCount.set(Array.isArray(res) ? res.length : (res as any).items));
  }

  setFilter(newFilter: 'all' | 'not_done' | 'done') {
    this.filterStatus.set(newFilter);
    this.currentPage.set(1);
  }

  onSearchChange() {
    this.currentPage.set(1);
  }

  onFilterPriorityChange() {
    this.currentPage.set(1);
  }

  onSortChange() {
    this.currentPage.set(1);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  getPageArray() {
    return Array(this.totalPages())
      .fill(0)
      .map((x, i) => i + 1);
  }

  onStatusChanged(taskId: string) {
    const task = this.tasks().find((t) => t.id === taskId);
    if (task) {
      const newStatus = !task.isDone;
      
      // Optimistic update: Update local state immediately
      this.tasks.update(currentTasks => 
        currentTasks.map(t => t.id === taskId ? { ...t, isDone: newStatus } : t)
      );

      this.taskService.updateTask(taskId, { isDone: newStatus }).subscribe({
        next: () => {
          this.toastService.showToast(
            `Task marked as ${newStatus ? 'completed' : 'pending'}`,
            'success',
          );
          this.statusChanged.emit(taskId);
          this.loadGlobalCounts();
          
          // If we are filtering by status, we need to refresh to potentially remove the task from view
          if (this.filterStatus() !== 'all') {
            this.currentPage.update((v) => v);
          }
        },
        error: (err) => {
          // Revert optimistic update on error
          this.tasks.update(currentTasks => 
            currentTasks.map(t => t.id === taskId ? { ...t, isDone: !newStatus } : t)
          );
          console.error('Failed to update task status', err);
          this.toastService.showToast('Failed to update task', 'error');
        },
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
          this.refreshTrigger.update(n => n + 1);
        },
        error: (err) => {
          console.error('Failed to update task', err);
          this.toastService.showToast('Failed to update task', 'error');
        },
      });
    } else {
      this.taskService.createTask(task).subscribe({
        next: () => {
          this.isModalOpen = false;
          this.toastService.showToast('Task created successfully', 'success');
          this.loadGlobalCounts();
          this.refreshTrigger.update(n => n + 1);
        },
        error: (err) => {
          console.error('Failed to create task', err);
          this.toastService.showToast('Failed to create task', 'error');
        },
      });
    }
  }

  async deleteTaskFn(task: Task) {
    const confirmed = await this.confirmDialogService.confirm({
      title: 'Delete Task',
      message: `Are you sure you want to delete "${task.title}"? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
    });

    if (confirmed) {
      this.taskService.deleteTask(task.id).subscribe({
        next: () => {
          this.toastService.showToast('Task deleted successfully', 'success');
          this.taskDestroyedAlert.emit(task.id);
          this.loadGlobalCounts();
          this.refreshTrigger.update(n => n + 1);
        },
        error: (err) => {
          console.error('Failed to delete task', err);
          this.toastService.showToast('Failed to delete task', 'error');
        },
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

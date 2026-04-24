import { Component, OnInit, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CarouselComponent } from '../../components/carousel/carousel.component';
import { TaskCardComponent } from '../../components/task-card/task-card.component';
import { TaskInputComponent } from '../../components/task-input/task-input.component';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { ConfirmDialogService } from '../../services/confirm-dialog.service';

@Component({
  selector: 'app-home',
  imports: [CarouselComponent, TaskCardComponent, TaskInputComponent, CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  username = computed(() => this.authService.currentUser()?.username || 'Guest');

  greeting = computed(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  });

  totalTasks = signal<number>(0);
  completedTasks = signal<number>(0);
  urgentTasks = signal<Task[]>([]);

  // Computed Stats
  pendingTasks = computed(() => this.totalTasks() - this.completedTasks());
  completionPercentage = computed(() =>
    this.totalTasks() ? Math.round((this.completedTasks() / this.totalTasks()) * 100) : 0,
  );

  // Modal State
  isModalOpen = false;
  taskFormData: Task | null = null;

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private toastService: ToastService,
    private confirmDialogService: ConfirmDialogService,
  ) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    // Fetch total tasks
    this.taskService.getTasks({ _page: 1, _limit: 1 }).subscribe({
      next: (res) => {
        this.totalTasks.set(Array.isArray(res) ? res.length : (res as any).items);
      },
    });

    // Fetch completed tasks
    this.taskService.getTasks({ _page: 1, _limit: 1, isDone: true }).subscribe({
      next: (res) => {
        this.completedTasks.set(Array.isArray(res) ? res.length : (res as any).items);
      },
    });

    // Fetch urgent tasks
    this.taskService
      .getTasks({
        _page: 1,
        _limit: 3,
        priority: 'High',
        isDone: false,
        _sort: 'dueDate',
        _order: 'desc',
      })
      .subscribe({
        next: (res) => {
          if (Array.isArray(res)) {
            this.urgentTasks.set(res.slice(0, 3));
          } else {
            this.urgentTasks.set((res as any).data);
          }
        },
      });
  }

  // Dashboard Interactivity Methods
  onStatusChanged(taskId: string) {
    const task = this.urgentTasks().find((t) => t.id === taskId);
    if (task) {
      const newStatus = !task.isDone;

      // Optimistic update
      this.urgentTasks.update((tasks) =>
        tasks.map((t) => (t.id === taskId ? { ...t, isDone: newStatus } : t)),
      );

      this.taskService.updateTask(taskId, { isDone: newStatus }).subscribe({
        next: () => {
          this.toastService.showToast(
            `Task marked as ${newStatus ? 'completed' : 'pending'}`,
            'success',
          );
          this.loadDashboardData();
        },
        error: (err) => {
          // Revert optimistic update
          this.urgentTasks.update((tasks) =>
            tasks.map((t) => (t.id === taskId ? { ...t, isDone: !newStatus } : t)),
          );
          console.error('Failed to update task status', err);
          this.toastService.showToast('Failed to update task', 'error');
        },
      });
    }
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
    if (task.id) {
      this.taskService.updateTask(task.id, task).subscribe({
        next: () => {
          this.isModalOpen = false;
          this.toastService.showToast('Task updated successfully', 'success');
          this.loadDashboardData();
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
          this.loadDashboardData();
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
          this.loadDashboardData();
        },
        error: (err) => {
          console.error('Failed to delete task', err);
          this.toastService.showToast('Failed to delete task', 'error');
        },
      });
    }
  }
}

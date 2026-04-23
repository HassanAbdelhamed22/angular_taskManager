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
  standalone: true,
  imports: [CarouselComponent, TaskCardComponent, TaskInputComponent, CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  username = signal<string>('Guest');
  tasks = signal<Task[]>([]);

  // Computed Stats
  totalTasks = computed(() => this.tasks().length);
  completedTasks = computed(() => this.tasks().filter((t) => t.isDone).length);
  pendingTasks = computed(() => this.totalTasks() - this.completedTasks());
  completionPercentage = computed(() => this.totalTasks() ? Math.round((this.completedTasks() / this.totalTasks()) * 100) : 0);
  urgentTasks = computed(() => this.tasks().filter(t => !t.isDone && t.priority === 'High').slice(0, 3));

  // Modal State
  isModalOpen = false;
  taskFormData: Task | null = null;

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private toastService: ToastService,
    private confirmDialogService: ConfirmDialogService
  ) {}

  ngOnInit() {
    const storedName = this.authService.getUserName();
    if (storedName) {
      this.username.set(storedName);
    }
    
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getTasks().subscribe({
      next: (fetchedTasks) => {
        this.tasks.set(fetchedTasks);
      },
      error: (err) => console.error('Failed to load tasks', err)
    });
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  }

  // Dashboard Interactivity Methods
  onStatusChanged(taskId: string) {
    const currentTasks = this.tasks();
    const task = currentTasks.find((t) => t.id === taskId);
    
    if (task) {
      const newStatus = !task.isDone;
      this.taskService.updateTask(taskId, { isDone: newStatus }).subscribe({
        next: () => {
          this.tasks.update(tasks => tasks.map(t => t.id === taskId ? { ...t, isDone: newStatus } : t));
          this.toastService.showToast(`Task marked as ${newStatus ? 'completed' : 'pending'}`, 'success');
        },
        error: (err) => {
          console.error('Failed to update task status', err);
          this.toastService.showToast('Failed to update task', 'error');
        }
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
    const currentTasks = this.tasks();
    const existingTask = currentTasks.find((t) => t.id === task.id);
    
    if (existingTask) {
      this.taskService.updateTask(task.id, task).subscribe({
        next: () => {
          this.tasks.update(tasks => tasks.map(t => t.id === task.id ? task : t));
          this.isModalOpen = false;
          this.toastService.showToast('Task updated successfully', 'success');
        },
        error: (err) => {
          console.error('Failed to update task', err);
          this.toastService.showToast('Failed to update task', 'error');
        }
      });
    } else {
      this.taskService.createTask(task).subscribe({
        next: (createdTask) => {
          this.tasks.update(tasks => [...tasks, createdTask]);
          this.isModalOpen = false;
          this.toastService.showToast('Task created successfully', 'success');
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
          this.tasks.update(tasks => tasks.filter(t => t.id !== task.id));
          this.toastService.showToast('Task deleted successfully', 'success');
        },
        error: (err) => {
          console.error('Failed to delete task', err);
          this.toastService.showToast('Failed to delete task', 'error');
        }
      });
    }
  }
}

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
import { TaskCardComponent } from '../../components/task-card/task-card.component';
import { TabsComponent } from '../../components/tabs/tabs.component';
import { Task } from '../../models/task.model';
import { TaskInputComponent } from '../../components/task-input/task-input.component';
import { TaskService } from '../../services/task.service';
import { ToastService } from '../../services/toast.service';
import { ConfirmDialogService } from '../../services/confirm-dialog.service';

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

  // State using Signals
  tasks = signal<Task[]>([]);
  filter = signal<'all' | 'not_done' | 'done'>('all');

  // Computed Values
  filteredTasks = computed(() => {
    const currentTasks = this.tasks();
    const currentFilter = this.filter();
    
    if (currentFilter === 'all') return currentTasks;
    if (currentFilter === 'not_done') return currentTasks.filter(t => !t.isDone);
    if (currentFilter === 'done') return currentTasks.filter(t => t.isDone);
    return currentTasks;
  });

  notDoneCount = computed(() => this.tasks().filter(t => !t.isDone).length);
  doneCount = computed(() => this.tasks().filter(t => t.isDone).length);

  // Modal State
  isModalOpen = false;
  taskFormData: Task | null = null;

  constructor(
    private taskService: TaskService,
    private toastService: ToastService,
    private confirmDialogService: ConfirmDialogService
  ) {}

  private loadTasks() {
    this.taskService.getTasks().subscribe({
      next: (fetchedTasks) => {
        this.tasks.set(fetchedTasks);
      },
      error: (err) => {
        console.error('Failed to load tasks', err);
        this.toastService.showToast('Failed to load tasks', 'error');
      }
    });
  }

  setFilter(newFilter: 'all' | 'not_done' | 'done') {
    this.filter.set(newFilter);
  }

  onStatusChanged(taskId: string) {
    const currentTasks = this.tasks();
    const task = currentTasks.find((t) => t.id === taskId);
    
    if (task) {
      const newStatus = !task.isDone;
      this.taskService.updateTask(taskId, { isDone: newStatus }).subscribe({
        next: () => {
          // Update the signal immutably
          this.tasks.update(tasks => 
            tasks.map(t => t.id === taskId ? { ...t, isDone: newStatus } : t)
          );
          this.statusChanged.emit(taskId);
          this.toastService.showToast(`Task marked as ${newStatus ? 'completed' : 'pending'}`, 'success');
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
    const currentTasks = this.tasks();
    const existingTask = currentTasks.find((t) => t.id === task.id);
    
    if (existingTask) {
      this.taskService.updateTask(task.id, task).subscribe({
        next: () => {
          this.tasks.update(tasks => 
            tasks.map(t => t.id === task.id ? task : t)
          );
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
          // Add to signal immutably
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
          this.taskDestroyedAlert.emit(`Task "${task.title}" was deleted.`);
          this.toastService.showToast('Task deleted successfully', 'success');
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

  ngOnInit(): void {
    this.loadTasks();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['incomingTask'] && changes['incomingTask'].currentValue) {
      this.loadTasks();
    }
    
    if (changes['deletedTaskId'] && changes['deletedTaskId'].currentValue) {
      this.tasks.update(tasks => tasks.filter(t => t.id !== changes['deletedTaskId'].currentValue));
    }
  }
}

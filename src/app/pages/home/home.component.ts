import { Component, OnInit, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CarouselComponent } from '../../components/carousel/carousel.component';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CarouselComponent, CommonModule, RouterLink],
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

  constructor(
    private taskService: TaskService,
    private authService: AuthService
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
}

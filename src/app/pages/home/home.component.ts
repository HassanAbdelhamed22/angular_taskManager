import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CarouselComponent } from '../../components/carousel/carousel.component';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CarouselComponent, CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  username: string = '';
  totalTasks: number = 0;
  completedTasks: number = 0;
  pendingTasks: number = 0;

  private STORAGE_KEY = 'task_manager_tasks';

  ngOnInit() {
    this.username = localStorage.getItem('username') || 'Guest';
    this.calculateStats();
  }

  calculateStats() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      const tasks: Task[] = JSON.parse(saved);
      this.totalTasks = tasks.length;
      this.completedTasks = tasks.filter((t) => t.isDone).length;
      this.pendingTasks = this.totalTasks - this.completedTasks;
    }
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  }
}

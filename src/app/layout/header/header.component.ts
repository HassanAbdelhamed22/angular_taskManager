import { UpperCasePipe } from '@angular/common';
import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { Router } from '@angular/router';

import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, UpperCasePipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit, OnDestroy {
  username = signal<string | null>('');
  secondsElapsed = signal<number>(0);
  private intervalId: any;

  formattedTime = computed(() => {
    const totalSeconds = this.secondsElapsed();
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const paddedMinutes = minutes.toString().padStart(2, '0');
    const paddedSeconds = seconds.toString().padStart(2, '0');

    if (hours > 0) {
      const paddedHours = hours.toString().padStart(2, '0');
      return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
    }

    if (minutes > 0) {
      return `${paddedMinutes}:${paddedSeconds}`;
    }

    return `${paddedSeconds}`;
  });

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.username.set(this.authService.getUserName());

    this.intervalId = setInterval(() => {
      this.secondsElapsed.update(s => s + 1);
    }, 1000);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  ngOnDestroy() {
    console.log('Header destroyed! Clearing interval...');
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}

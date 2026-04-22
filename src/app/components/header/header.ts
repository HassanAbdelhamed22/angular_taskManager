import { UpperCasePipe } from '@angular/common';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, UpperCasePipe],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  username: string | null = '';
  secondsElapsed = 0;
  private intervalId: any;

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {}

  ngOnInit() {
    this.username = localStorage.getItem('username');

    this.intervalId = setInterval(() => {
      this.secondsElapsed++;
      this.cdr.detectChanges();
    }, 1000);
  }

  get formattedTime(): string {
    const hours = Math.floor(this.secondsElapsed / 3600);
    const minutes = Math.floor((this.secondsElapsed % 3600) / 60);
    const seconds = this.secondsElapsed % 60;

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
  }

  logout() {
    localStorage.removeItem('username');
    this.router.navigate(['/login']);
  }

  ngOnDestroy() {
    console.log('Header destroyed! Clearing interval...');
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}

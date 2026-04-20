import { Component, OnInit, OnDestroy, NgZone, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  secondsElapsed = 0;
  private intervalId: any;

  constructor(
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    // this.ngZone.runOutsideAngular(() => {
    //   this.intervalId = setInterval(() => {
    //     this.secondsElapsed++;
    //     console.log('Timer: ' + this.secondsElapsed);
    //     this.cdr.detectChanges();
    //   }, 1000);
    // });

    this.intervalId = setInterval(() => {
      this.secondsElapsed++;
      console.log('Timer: ' + this.secondsElapsed);
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

  ngOnDestroy() {
    console.log('Header destroyed! Clearing interval...');
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css',
})
export class CarouselComponent implements OnInit, OnDestroy {
  slides = [
    {
      image: 'productivity-bg.png',
      title: 'Master Your Day',
      subtitle: 'Organize tasks efficiently and boost your daily productivity with our intuitive tools.',
    },
    {
      image: 'focus-bg.png',
      title: 'Maintain Deep Focus',
      subtitle: 'Eliminate distractions and focus on what truly matters to achieve your long-term goals.',
    },
    {
      image: 'workspace-bg.png',
      title: 'Your Digital Workspace',
      subtitle: 'A clean, modern space designed to help you stay ahead of your schedule.',
    },
  ];

  currentIndex = 0;
  private intervalId: any;

  ngOnInit() {
    this.startAutoPlay();
  }

  ngOnDestroy() {
    this.stopAutoPlay();
  }

  startAutoPlay() {
    this.intervalId = setInterval(() => {
      this.next();
    }, 5000);
  }

  stopAutoPlay() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
  }

  goTo(index: number) {
    this.currentIndex = index;
    this.stopAutoPlay();
    this.startAutoPlay();
  }
}

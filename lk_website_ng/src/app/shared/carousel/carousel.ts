import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carousel.html',
  styleUrl: './carousel.scss'
})
export class Carousel implements OnInit, OnDestroy {
  images = [
    '/lk_img_1.jpg',
    '/lk_img_2.jpg',
    '/lk_img_3.jpg',
    '/lk_img_4.jpg',
    '/lk_img_5.jpg',
  ];
  current = 0;
  private intervalId: any;

  ngOnInit() {
    this.intervalId = setInterval(() => {
      this.next();
    }, 3000); // Change image every 3 seconds
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  prev() {
    this.current = (this.current - 1 + this.images.length) % this.images.length;
  }

  next() {
    this.current = (this.current + 1) % this.images.length;
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carousel.html',
  styleUrl: './carousel.scss'
})
export class Carousel {
  images = [
    '/lk_img_1.jpg',
    '/lk_img_2.jpg',
    '/lk_img_3.jpg',
    '/lk_img_4.jpg',
    '/lk_img_5.jpg',
  ];
  current = 0;

  prev() {
    this.current = (this.current - 1 + this.images.length) % this.images.length;
  }

  next() {
    this.current = (this.current + 1) % this.images.length;
  }
}

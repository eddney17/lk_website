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
    '/lk_prod_14.jpg',
    '/lk_prod_2.jpg',
    '/lk_prod_3.jpg',
    '/lk_prod_4.jpg',
    '/lk_prod_5.jpg',
    '/lk_prod_6.jpg',
    '/lk_prod_7.jpg',
    '/lk_prod_8.jpg',
    '/lk_prod_9.jpg',
    '/lk_prod_10.jpg',
    '/lk_prod_11.jpg',
    '/lk_prod_13.jpg',
    '/lk_prod_15.jpg',
    '/lk_prod_16.jpg',
    '/lk_prod_17.jpg',
    '/lk_prod_18.jpg',
    '/lk_prod_20.jpg',
    '/lk_prod_21.jpg'
  ];
  current = 1; // Start at 1 for seamless effect
  private intervalId: any;
  private _noTransition = false;

  get displayImages() {
    // Duplicate first and last for seamless effect
    return [
      this.images[this.images.length - 1],
      ...this.images,
      this.images[0]
    ];
  }
  get trackTransform() {
    return `translateX(-${this.current * 100}%)`;
  }
  get transition() {
    return this._noTransition ? 'none' : 'transform 0.5s ease';
  }

  ngOnInit() {
    this.intervalId = setInterval(() => {
      this.next();
    }, 5000);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  prev() {
    if (this.current === 0) {
      this._noTransition = true;
      this.current = this.images.length;
      setTimeout(() => {
        this._noTransition = false;
        this.current--;
      });

      this.intervalId = setInterval(() => {
        this.next();
      }, 5000);

      
    } else {
      this.current--;
    }
  }

  next() {
    if (this.current === this.images.length + 1) {
      this._noTransition = true;
      this.current = 1;
      setTimeout(() => {
        this._noTransition = false;
        this.current++;
      });
    } else {
      this.current++;
    }
  }

  onTransitionEnd() {
    // No-op, but required for Angular to recognize the event
  }
}

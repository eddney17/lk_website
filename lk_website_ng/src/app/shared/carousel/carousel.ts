import { Component, OnInit, OnDestroy, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

interface CarouselSlide {
  src: string;
  alt: string;
}

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carousel.html',
  styleUrl: './carousel.scss',
})
export class Carousel implements OnInit, OnDestroy {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  slides: CarouselSlide[] = [
    { src: '/lk_prod_14.jpg', alt: 'Laser-engraved personalized wooden gift' },
    { src: '/lk_prod_2.jpg', alt: 'Custom engraved keepsake from LK Engraving Studio' },
    { src: '/lk_prod_3.jpg', alt: 'Personalized engraved souvenir' },
    { src: '/lk_prod_4.jpg', alt: 'Handcrafted laser-engraved product' },
    { src: '/lk_prod_5.jpg', alt: 'Custom engraved wooden item' },
    { src: '/lk_prod_6.jpg', alt: 'Personalized gift with laser engraving' },
    { src: '/lk_prod_7.jpg', alt: 'Engraved keepsake for special occasions' },
    { src: '/lk_prod_8.jpg', alt: 'Custom laser-engraved wood product' },
    { src: '/lk_prod_9.jpg', alt: 'Personalized engraved giveaway item' },
    { src: '/lk_prod_10.jpg', alt: 'Laser-engraved gift from LK Studio' },
    { src: '/lk_prod_11.jpg', alt: 'Custom engraved souvenir product' },
    { src: '/lk_prod_13.jpg', alt: 'Personalized wooden engraved piece' },
    { src: '/lk_prod_15.jpg', alt: 'Handcrafted engraved gift item' },
    { src: '/lk_prod_16.jpg', alt: 'Custom keepsake with laser engraving' },
    { src: '/lk_prod_17.jpg', alt: 'Personalized engraved product display' },
    { src: '/lk_prod_18.jpg', alt: 'Laser-engraved wooden gift set' },
    { src: '/lk_prod_20.jpg', alt: 'Custom engraved Philippines-made gift' },
    { src: '/lk_prod_21.jpg', alt: 'Personalized engraved souvenir collection' },
  ];
  current = 1; // Start at 1 for seamless effect
  private intervalId: ReturnType<typeof setInterval> | undefined;
  private _noTransition = false;

  get displaySlides(): CarouselSlide[] {
    return [
      this.slides[this.slides.length - 1],
      ...this.slides,
      this.slides[0],
    ];
  }

  get trackTransform() {
    return `translateX(-${this.current * 100}%)`;
  }

  get transition() {
    return this._noTransition ? 'none' : 'transform 0.5s ease';
  }

  ngOnInit() {
    if (!this.isBrowser) {
      return;
    }
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
      this.current = this.slides.length;
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
    if (this.current === this.slides.length + 1) {
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

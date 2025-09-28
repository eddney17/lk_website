import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonials.html',
  styleUrl: './testimonials.scss'
})
export class Testimonials {
  testimonials = [
    {      
      image: '/lk_item_keychain.png',
      alt: 'personalized_keychain',
      username: 'imeegarcia400',
      text: 'Quality materials, handy, and cute! More than what I expected, so happy for my purchase. Seller is very accomodating, looking forward for my next order. Thank you seller!'
    },    
    {
      image: '/lk_item_keychain.png',
      alt: 'personalized_keychain',
      username: 'periwinkle_10k',
      text: 'The seller is kind and easy to transact with. The quality of the product is good,'
    },
     {,
    {
      image: '/lk_item_keychain.png',
      alt: 'personalized_keychain',
      username: 'jarrencalma',
      text: 'The items are highly recommended, and the seller was responsive and approachable. The quality was good beyond my expectiations. The price was worth it.'
    },
     {
      image: '/lk_item_keychain.png',
      alt: 'personalized_keychain',
      username: 'eliebs',
      text: 'This is my go to shop whenver I need personalized gifts and home/school essentials. Their items are made with quality materials plus they do clean and precise engraving! Not to mention the fast delivery of items. For this tumbler, I ordered it morning of June 6. It arrived around 1pm of June 8. Definitely 5 stars!!'
    },
    {
      image: '/lk_item_keychain.png',
      alt: 'personalized_keychain',
      username: 'dianaquilang',
      text: 'What you see is more than what you get! The items exceeded my expetations - They look even better in person. The seller is very responsive, accomodating, and made the whole transaction smooth and hassle-free. Super bait ni seller. Delivery was fast, and everything was well-packaged.'
    },
    // Add more testimonials as needed
  ];
  current = 0;

  prev() {
    this.current = (this.current - 1 + this.testimonials.length) % this.testimonials.length;
  }

  next() {
    this.current = (this.current + 1) % this.testimonials.length;
  }
}

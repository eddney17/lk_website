import { Component } from '@angular/core';
import { Carousel } from '../shared/carousel/carousel';

@Component({
  selector: 'app-aboutus',
  standalone: true,
  imports: [Carousel],
  templateUrl: './aboutus.html',
  styleUrl: './aboutus.scss'
})
export class AboutUs {}

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Testimonials } from '../shared/testimonials/testimonials';

@Component({
  selector: 'app-homepage',
  imports: [RouterLink, Testimonials],
  templateUrl: './homepage.html',
  styleUrl: './homepage.scss'
})
export class Homepage {

}

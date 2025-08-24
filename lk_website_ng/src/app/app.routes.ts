import { Routes } from '@angular/router';
import { Homepage } from './homepage/homepage';
import { AboutUs } from './aboutus/aboutus';
import { ContactUs } from './contactus/contactus';

export const routes: Routes = [
    { path: '', component: Homepage },
    { path: 'about', component: AboutUs },
    { path: 'contact', component: ContactUs }
];

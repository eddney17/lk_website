import { Routes } from '@angular/router';
import { Homepage } from './homepage/homepage';
import { AboutUs } from './aboutus/aboutus';
import { ContactUs } from './contactus/contactus';
import { SeoData } from './core/seo.types';

const homeDescription =
  'Personalized laser-engraved gifts, souvenirs, and keepsakes from LK Engraving Studio in the Philippines. Custom wooden keychains, bamboo utensils, and more.';

export const routes: Routes = [
  {
    path: '',
    component: Homepage,
    data: {
      seo: {
        title: 'LK Engraving Studio | Personalized Engraved Gifts & Keepsakes',
        description: homeDescription,
        path: '/',
        structuredData: true,
      } satisfies SeoData,
    },
  },
  {
    path: 'about',
    component: AboutUs,
    data: {
      seo: {
        title: 'About Us | LK Engraving Studio',
        description:
          'Learn about LK Engraving Studio — our mission, values, and craftsmanship. Based in the Philippines, we create personalized engraved gifts that turn moments into memories.',
        path: '/about',
      } satisfies SeoData,
    },
  },
  {
    path: 'contact',
    component: ContactUs,
    data: {
      seo: {
        title: 'Contact Us | LK Engraving Studio',
        description:
          'Get in touch with LK Engraving Studio for custom engraving inquiries, bulk orders, and personalized gift requests. Email us or send a message online.',
        path: '/contact',
        structuredData: true,
      } satisfies SeoData,
    },
  },
  {
    path: 'customize-item',
    loadComponent: () =>
      import('./customize-item/customize-item').then((m) => m.CustomizeItem),
    data: {
      seo: {
        title: 'Customize Your Item | LK Engraving Studio',
        description:
          'Design your personalized engraved keepsake online. Choose a product, add text, pick a font, and preview your custom design before ordering.',
        path: '/customize-item',
        noIndex: true,
      } satisfies SeoData,
    },
  },
];

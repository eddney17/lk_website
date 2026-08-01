import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Navbar } from './navigation/navbar/navbar';
import { Footer } from './footer/footer';
import { SeoService } from './core/seo.service';
import { SeoData } from './core/seo.types';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        map(() => this.leafRoute(this.activatedRoute)),
        map((route) => route.snapshot.data['seo'] as SeoData | undefined),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((seo) => {
        if (seo) {
          this.seo.update(seo);
        }
      });
  }

  private leafRoute(route: ActivatedRoute): ActivatedRoute {
    let current = route;
    while (current.firstChild) {
      current = current.firstChild;
    }
    return current;
  }
}

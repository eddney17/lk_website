import { Injectable, inject, DOCUMENT } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { environment } from '../../environments/environment';
import { SeoData } from './seo.types';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);

  update(seo: SeoData): void {
    const pageTitle = seo.title;
    const description = seo.description;
    const url = this.absoluteUrl(seo.path);
    const image = this.absoluteUrl(seo.ogImage ?? environment.defaultOgImage);
    const ogType = seo.ogType ?? 'website';

    this.title.setTitle(pageTitle);

    this.setMetaName('description', description);
    this.setMetaName('robots', seo.noIndex ? 'noindex, nofollow' : 'index, follow');

    this.setMetaProperty('og:title', pageTitle);
    this.setMetaProperty('og:description', description);
    this.setMetaProperty('og:url', url);
    this.setMetaProperty('og:type', ogType);
    this.setMetaProperty('og:image', image);
    this.setMetaProperty('og:site_name', environment.siteName);

    this.setMetaName('twitter:card', 'summary_large_image');
    this.setMetaName('twitter:title', pageTitle);
    this.setMetaName('twitter:description', description);
    this.setMetaName('twitter:image', image);

    this.setCanonical(url);

    if (seo.structuredData) {
      this.setJsonLd(this.buildLocalBusinessSchema(description));
    } else {
      this.removeJsonLd();
    }
  }

  private absoluteUrl(path: string): string {
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    const base = environment.siteUrl.replace(/\/$/, '');
    const normalized = path.startsWith('/') ? path : `/${path}`;
    return `${base}${normalized === '/' ? '' : normalized}` || base;
  }

  private setMetaName(name: string, content: string): void {
    if (this.meta.getTag(`name="${name}"`)) {
      this.meta.updateTag({ name, content });
    } else {
      this.meta.addTag({ name, content });
    }
  }

  private setMetaProperty(property: string, content: string): void {
    if (this.meta.getTag(`property="${property}"`)) {
      this.meta.updateTag({ property, content });
    } else {
      this.meta.addTag({ property, content });
    }
  }

  private setCanonical(url: string): void {
    let link = this.document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  private buildLocalBusinessSchema(description: string): Record<string, unknown> {
    return {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: environment.siteName,
      email: environment.contactEmail,
      url: environment.siteUrl,
      description,
      areaServed: 'PH',
      sameAs: [environment.shopUrl],
      image: this.absoluteUrl(environment.defaultOgImage),
    };
  }

  private setJsonLd(data: Record<string, unknown>): void {
    this.removeJsonLd();
    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'seo-json-ld';
    script.text = JSON.stringify(data);
    this.document.head.appendChild(script);
  }

  private removeJsonLd(): void {
    this.document.getElementById('seo-json-ld')?.remove();
  }
}

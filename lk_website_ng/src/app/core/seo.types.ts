export interface SeoData {
  title: string;
  description: string;
  path: string;
  /** When true, sets robots to noindex, nofollow */
  noIndex?: boolean;
  /** Inject LocalBusiness JSON-LD (homepage / contact) */
  structuredData?: boolean;
  ogImage?: string;
  ogType?: string;
}

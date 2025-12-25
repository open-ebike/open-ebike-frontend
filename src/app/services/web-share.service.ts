import { inject, Injectable } from '@angular/core';
import { Meta } from '@angular/platform-browser';

/**
 * Handles call of web share API
 */
@Injectable({
  providedIn: 'root',
})
export class WebShareService {
  //
  // Injections
  //

  /** Meta */
  meta = inject(Meta);

  /**
   * Triggers sharing of content
   */
  share(title: string, description: string, imageUrl: string) {
    this.updateSocialTags(title, description, imageUrl);

    if (navigator.share) {
      navigator
        .share({
          title: title,
          text: description,
        })
        .then(() => console.log('Shared successfully'))
        .catch((error) => console.log('Error sharing:', error));
    }
  }

  updateSocialTags(title: string, desc: string, img: string) {
    // Open Graph (Facebook, LinkedIn, etc)
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: desc });
    this.meta.updateTag({ property: 'og:image', content: img });
    this.meta.updateTag({ property: 'og:url', content: window.location.href });

    // Twitter Card
    this.meta.updateTag({
      name: 'twitter:card',
      content: 'summary_large_image',
    });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: desc });
    this.meta.updateTag({ name: 'twitter:image', content: img });
  }
}

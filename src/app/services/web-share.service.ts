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
   * @param title title
   * @param description description
   * @param url URL
   * @param imageUrl image URL
   */
  async share(
    title: string,
    description: string,
    url: string,
    imageUrl: string,
  ) {
    this.updateSocialTags(title, description, imageUrl);

    if (navigator.share) {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], 'achievement.png', { type: blob.type });

      const shareData: ShareData = {
        title: title,
        text: description,
        url: url,
        files: [file],
      };

      if (navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.share({
          title: title,
          text: description,
          url: url,
        } as ShareData);
      }
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

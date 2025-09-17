import { Pipe, PipeTransform } from '@angular/core';

/**
 * Transforms a number to contain a thousands-separator
 */
@Pipe({
  name: 'thousandsSeparator',
  standalone: true,
})
export class ThousandsSeparatorPipe implements PipeTransform {
  /** Thin space */
  thinSpace = ' ';

  /**
   * Transforms a number to contain a thousands-separator
   * @param value input value
   */
  transform(value: any): string {
    return value
      ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, this.thinSpace)
      : '';
  }
}

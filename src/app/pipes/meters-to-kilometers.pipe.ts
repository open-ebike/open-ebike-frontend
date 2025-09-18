import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'metersToKilometers',
  standalone: true,
})
export class MetersToKilometersPipe implements PipeTransform {
  transform(value: number, ...args: unknown[]): unknown {
    return Math.round((value / 1_000 + Number.EPSILON) * 100) / 100;
  }
}

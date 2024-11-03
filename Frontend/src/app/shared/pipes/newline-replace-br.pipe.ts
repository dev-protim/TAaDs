import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'newlineReplaceBr',
  standalone: true
})
export class NewlineReplaceBrPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string {
    return value ? value.replace(/\n/g, '<br/>') : "";
  }

}

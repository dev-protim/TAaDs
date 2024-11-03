import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeDiff',
  standalone: true
})
export class TimeDiffPipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): any {
    let modifiedDate = Date.parse(value);
    let nowDate: any = new Date();
    let seconds = Math.floor((nowDate - modifiedDate) / 1000);
    let text: string = "";

    var interval = seconds / 31536000;

    if (interval > 1) {
      if (Math.floor(interval) === 1) text = " year";
      else text = " years";
      return Math.floor(interval) + text;
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      if (Math.floor(interval) === 1) text = " month";
      else text = " months";
      return Math.floor(interval) + text;
    }
    interval = seconds / 86400;
    if (interval > 1) {
      if (Math.floor(interval) === 1) text = " day";
      else text = " days";
      return Math.floor(interval) + text;
    }
    interval = seconds / 3600;
    if (interval > 1) {
      if (Math.floor(interval) === 1) text = " hour";
      else text = " hours";
      return Math.floor(interval) + text;
    }
    interval = seconds / 60;
    if (interval > 1) {
      if (Math.floor(interval) === 1) text = " minute";
      else text = " minutes";
      return Math.floor(interval) + text;
    }
    if (Math.floor(interval) === 1) text = " second";
    else text = " seconds";
    return Math.floor(seconds) + text;
  }

}

import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CustomDateService } from './customdate.service';

// tslint:disable: use-pipe-transform-interface
@Pipe({
  name: 'customDate',
  // pure: false
})
export class CustomDatePipe extends CustomDateService implements PipeTransform{
  transform(value: any, args?: any): any {
    return super.transformDate(value);
  }
}

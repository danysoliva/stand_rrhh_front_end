import { ChangeDetectorRef, Injectable, Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CustomDateService {
  constructor(
    private date: DatePipe,
    private _ref: ChangeDetectorRef
  ) {}

  transformDate(value: any, args?: any) {
    this._ref.detectChanges();
    const dateMonth = this.date.transform(value, 'MMMM');
    const dateYear = this.date.transform(value, 'yyyy');
    const dateDay = this.date.transform(value, 'dd');
    const dateTranslated = `${dateDay} ${dateMonth} ${dateYear}`;
    return dateTranslated;
  }

  transformDatetime(value: any, args?: any) {
    this._ref.detectChanges();
    const dateMonth = this.date.transform(value, 'MMMM');
    const dateYear = this.date.transform(value, 'yyyy');
    const dateDay = this.date.transform(value, 'dd');
    const dateHourAndMinutes = this.date.transform(value, 'hh:mm aa');
    const dateTranslated = `${dateDay} ${dateMonth} ${dateYear} ${dateHourAndMinutes}`;
    return dateTranslated;
  }
}

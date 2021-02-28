import { COMMA, ENTER, SPACE } from '@angular/cdk/keycodes';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'app-select-chip',
  templateUrl: './select-chip.component.html'
})
export class SelectChipComponent {

  public readonly addElAction = [COMMA, ENTER, SPACE];

  @Input()
  public addedEls: string[] = [];

  @Output()
  public els: EventEmitter<string[]> = new EventEmitter<string[]>();

  @Input()
  public label: string;

  @Input()
  public placeholder: string;

  @Input()
  public data: string[];

  @Input()
  public canAddData: boolean = false;

  @ViewChild("elInput")
  public elInput: ElementRef<HTMLInputElement>;

  public filterEls(value: string): string[] {
    value = value?.toLowerCase();
    return this.data?.filter(el => !this.addedEls.includes(el) && el?.toLowerCase()?.includes(value)) ?? [];
  }

  public addEl(event: MatAutocompleteSelectedEvent | MatChipInputEvent) {
    const value = event instanceof MatAutocompleteSelectedEvent ? event.option.viewValue : event.value;

    if ((this.data.includes(value.toLowerCase()) || this.canAddData) && !this.addedEls.includes(value.toLowerCase()) && value.trim().length > 0) {
      this.addedEls.push(value.toLowerCase());
      this.data.splice(this.data.indexOf(value.toLowerCase()), 1);
      this.sendEls();
    }
    this.elInput.nativeElement.value = '';
  }

  public removeEl(event: string) {
    this.addedEls.splice(this.addedEls.indexOf(event), 1);
    this.data.push(event);
    this.sendEls();
  }

  private sendEls() {
    this.els.emit(this.addedEls);
  }
}

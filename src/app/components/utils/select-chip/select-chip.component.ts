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

  @ViewChild("elInput")
  public elInput: ElementRef<HTMLInputElement>;

  public filterEls(value: string): string[] {
    return this.data.filter(el => el.toLowerCase().includes(value.toLowerCase()));
  }

  public addEl(event: MatAutocompleteSelectedEvent | MatChipInputEvent) {
    const value = event instanceof MatAutocompleteSelectedEvent ? event.option.viewValue : event.value;

    if (this.data.includes(value) && !this.addedEls.includes(value)) {
      this.addedEls.push(value);
      this.data.splice(this.data.indexOf(value), 1);
    }
    this.elInput.nativeElement.value = '';
    this.sendEls();
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

import { COMMA, ENTER, SPACE } from '@angular/cdk/keycodes';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'app-select-chip',
  templateUrl: './select-chip.component.html'
})
export class SelectChipComponent {

  public allUsers: string[] = ['thpr60710', 'moba56512', 'gebu32132'];
  public readonly addUserAction = [COMMA, ENTER, SPACE];
  public addedUsers: string[] = [];

  @Output()
  public users: EventEmitter<string[]> = new EventEmitter<string[]>();

  @ViewChild("userInput")
  public userInput: ElementRef<HTMLInputElement>;

  public filterUsers(value: string): string[] {
    return this.allUsers.filter(user => user.toLowerCase().includes(value.toLowerCase()));
  }

  public addUser(event: MatAutocompleteSelectedEvent | MatChipInputEvent) {
    const value = event instanceof MatAutocompleteSelectedEvent ? event.option.viewValue : event.value;

    if (this.allUsers.includes(value) && !this.addedUsers.includes(value)) {
      this.addedUsers.push(value);
      this.allUsers.splice(this.allUsers.indexOf(value), 1);
    }
    this.userInput.nativeElement.value = '';
    this.sendUsers();
  }

  public removeUser(event: string) {
    this.addedUsers.splice(this.addedUsers.indexOf(event), 1);
    this.allUsers.push(event);
    this.sendUsers();
  }

  private sendUsers() {
    this.users.emit(this.addedUsers);
  }
}

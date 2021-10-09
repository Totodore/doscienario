import { SocketService } from '../../../../services/sockets/socket.service';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/api/project.model';
import { ApiService } from 'src/app/services/api.service';
import { ProgressService } from 'src/app/services/progress.service';
import { ProjectService } from 'src/app/services/project.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { setImmediate } from 'src/app/utils/helpers';

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.scss']
})
export class UserAddComponent implements OnInit {

  constructor(
    public readonly project: ProjectService,
    public readonly api: ApiService,
    public readonly progress: ProgressService,
    public readonly socket: SocketService,
    public readonly snackbar: SnackbarService
  ) { }

  public title: string = "Options";
  public show: boolean = true;

  public allUsers: User[];
  private me: User;

  async ngOnInit(): Promise<void> {
    try {
      setImmediate(() => this.progress.show());
      this.me = JSON.parse(localStorage.getItem("me"));
      this.allUsers = await this.api.get<User[]>("user/all");
      setImmediate(() => this.progress.hide());
    } catch (e) {
      console.error(e);
      this.snackbar.snack("Impossible de récupérer certaines données");
      this.progress.hide();
    }
  }

  public setUsers(userNames: string[]) {
    const newUsers: User[] = []; //Co
    for (const userName of userNames) {
      newUsers.push(this.allUsers.find(el => el.name == userName));
    }
    newUsers.push(this.me);
    if (this.me.id != this.project.owner.id)
      newUsers.push(this.project.owner);
    console.log("Set user", newUsers);
    this.socket.updateUserProject(newUsers);
  }

  public get userNames(): string[] {
    return this.allUsers.map(el => el.name).filter(el => !this.selectedUserNames.includes(el));
  }
  public get selectedUserNames(): string[] {
    return this.project.projectUsers.filter(el => el.id != this.me.id && el.id != this.project.owner.id).map(el => el.name);
  }


}

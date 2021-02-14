import { Component, OnInit } from '@angular/core';
import { ProjectUserRes } from 'src/app/models/api/project.model';
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
    public readonly snackbar: SnackbarService
  ) { }

  public title: string = "Options";
  public show: boolean = true;

  public allUsers: ProjectUserRes[];
  private me: ProjectUserRes;

  async ngOnInit(): Promise<void> {
    try {
      setImmediate(() => this.progress.show());
      this.me = JSON.parse(localStorage.getItem("me"));
      this.allUsers = await this.api.get<ProjectUserRes[]>("user/all");
      setImmediate(() => this.progress.hide());
    } catch (e) {
      console.error(e);
      this.snackbar.snack("Impossible de récupérer certaines données");
      this.progress.hide();
    }
  }

  public setUsers(userNames: string[]) {
    const addedUsers: ProjectUserRes[] = [];
    for (const userName of userNames) {
      addedUsers.push(this.allUsers.find(el => el.name == userName));
    }
    addedUsers.push(this.me);
    console.log(addedUsers);
    this.project.projectUsers = addedUsers;
  }

  public get userNames(): string[] {
    return this.allUsers.map(el => el.name);
  }
  public get selectedUserNames(): string[] {
    return this.project.projectUsers.filter(el => el.id != this.me.id).map(el => el.name);
  }


}

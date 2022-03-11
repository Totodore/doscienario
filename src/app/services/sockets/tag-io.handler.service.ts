import { SocketService } from 'src/app/services/sockets/socket.service';
import { Injectable } from '@angular/core';
import { EventHandler, registerHandler } from 'src/app/decorators/subscribe-event.decorator';
import { Tag } from 'src/app/models/api/tag.model';
import { Flags } from 'src/app/models/sockets/flags.enum';
import { ColorTagIn, RenameTagIn } from 'src/app/models/sockets/in/tag.in';
import { ProjectService } from '../project.service';

@Injectable({
  providedIn: 'root'
})
export class TagIoHandler {

  constructor(
    private readonly project: ProjectService,
    private readonly socket: SocketService,
  ) {
    registerHandler(this, this.socket);
  }

  @EventHandler(Flags.CREATE_TAG)
  onCreateTag(tag: Tag) {
    const projectTag = this.project.tags.find(el => el.title == tag.title);
    if (projectTag && projectTag.id == null)
      this.project.updateProjectTag(tag);
    else this.project.addProjectTag(tag);
  }

  @EventHandler(Flags.COLOR_TAG)
  onColorTag(packet: ColorTagIn) {
    const newTag = this.project.tags.find(el => el.title === packet.title);
    newTag.color = packet.color;
    this.project.updateProjectTag(new Tag(packet.title), newTag);
  }

  @EventHandler(Flags.RENAME_TAG)
  titleTag(packet: RenameTagIn) {
    const newTag = this.project.tags.find(el => el.title === packet.title);
    newTag.title = packet.title;
    this.project.updateProjectTag(new Tag(packet.title), newTag);
  }

  @EventHandler(Flags.REMOVE_TAG)
  onRemoveTag(title: string) {
    this.project.removeProjectTag(title);
  }
}

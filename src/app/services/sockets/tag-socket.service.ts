import { Injectable } from '@angular/core';
import { EventHandler } from 'src/app/decorators/subscribe-event.decorator';
import { Flags } from 'src/app/models/sockets/flags.enum';
import { Tag, UpdateTagColorReq, UpdateTagNameReq } from 'src/app/models/sockets/tag-sock.model';
import { ProjectService } from '../project.service';

@Injectable({
  providedIn: 'root'
})
export class TagSocketService {

  constructor(
    private readonly project: ProjectService,
  ) { }

  @EventHandler(Flags.CREATE_TAG)
  onCreateTag(tag: Tag) {
    const projectTag = this.project.tags.find(el => el.title == tag.title);
    if (projectTag && projectTag.id == null)
      this.project.updateProjectTag(tag);
    else this.project.addProjectTag(tag);
  }

  @EventHandler(Flags.COLOR_TAG)
  onColorTag(packet: UpdateTagColorReq) {
    const newTag = this.project.tags.find(el => el.title === packet.title);
    newTag.color = packet.color;
    this.project.updateProjectTag(new Tag(packet.title), newTag);
  }

  @EventHandler(Flags.RENAME_TAG)
  titleTag(packet: UpdateTagNameReq) {
    const newTag = this.project.tags.find(el => el.title === packet.title);
    newTag.title = packet.title;
    this.project.updateProjectTag(new Tag(packet.title), newTag);
  }

  @EventHandler(Flags.REMOVE_TAG)
  onRemoveTag(title: string) {
    this.project.removeProjectTag(title);
  }
}

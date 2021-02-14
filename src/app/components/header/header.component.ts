import { ApiService } from './../../services/api.service';
import { ProgressService } from './../../services/progress.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(
    public readonly progress: ProgressService,
    public readonly api: ApiService
  ) { }

  ngOnInit(): void {
  }

}

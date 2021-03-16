import { Component, Input, OnInit } from '@angular/core';
@Component({
  selector: 'app-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss']
})
export class NodeComponent implements OnInit {

  @Input() root: boolean = false;

  constructor() { }

  ngOnInit() {
  }

}

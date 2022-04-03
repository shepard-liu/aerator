import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  encapsulation: ViewEncapsulation.None //* 需要调整Tabs的内部样式。
})
export class MainComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}

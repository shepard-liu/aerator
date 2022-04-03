/**
 * 主内容面板
 * @author shepard
 */

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  encapsulation: ViewEncapsulation.None //* 需要调整Tabs的内部样式。
})
export class MainComponent implements OnInit {

  selectedTabIndex: number = null;

  constructor() {
    this.selectedTabIndex = Number(localStorage.getItem('lastVisitedTabIdx') || '0');
  }

  ngOnInit(): void {
  }

  handleTabChange(index: number) {
    localStorage.setItem('lastVisitedTabIdx', index.toString());
    this.selectedTabIndex = index;
  }

}

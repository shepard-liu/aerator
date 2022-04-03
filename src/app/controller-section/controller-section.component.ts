/**
 * 增氧机控制面板区域。只是提供一个带有样式的title
 * @author shepard
 */
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-controller-section',
  templateUrl: './controller-section.component.html',
  styleUrls: ['./controller-section.component.scss']
})
export class ControllerSectionComponent implements OnInit {

  @Input('title')
  sectionTitle: string = 'Section';

  constructor() { }

  ngOnInit(): void {

  }

}

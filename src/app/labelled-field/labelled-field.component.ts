/**
 * 带标签的容器组件
 * material自带的mat-field不适合增氧机控制项的样式，故自行实现一个
 * @author shepard
 */
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-labelled-field',
  templateUrl: './labelled-field.component.html',
  styleUrls: ['./labelled-field.component.scss']
})
export class LabelledFieldComponent implements OnInit {

  @Input('label')
  label: string;
  type: 'inline' | 'multi-line' = 'multi-line';

  constructor() { }

  ngOnInit(): void {
  }

}

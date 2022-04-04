/**
 * 时间策略组件
 * @author shepard
 */

import { Component, OnInit } from '@angular/core';
import { AeratorService } from '../aerator.service';
import { AeratorCtrlTimeParams, AeratorRemovableTimeParamNames } from '../types';

interface TimeRange {
  start: string;
  end: string;
}

@Component({
  selector: 'app-time-strategy',
  templateUrl: './time-strategy.component.html',
  styleUrls: ['./time-strategy.component.scss']
})
export class TimeStrategyComponent implements OnInit {

  // 时间参数
  activeTimeParams: (TimeRange & { ratio: number })[] = Array(4).fill({ start: '', end: '', ratio: null });
  // 断网时间参数
  offlineActiveTimeRanges: TimeRange[] = Array(4).fill({ start: '', end: '' });
  // 断网同步时间
  offlineSyncTime: string = null;
  // 控制器同步更新时间
  controllerSyncTime: string = null;


  constructor(private aeratorService: AeratorService) {

    // 订阅增氧机id改变
    aeratorService.subscribeAeratorIdChange((currentId, ctrlParams) => {
      const { activeTimeParams, offlineActiveTimeRanges } = this;

      //! 服务端传来的时间为0怎么处理？
      for (const i of [0, 1, 2, 3]) {
        activeTimeParams[i] = {
          start: minute2TimeStr((ctrlParams as any)[`time${i + 1}_s`]),
          end: minute2TimeStr((ctrlParams as any)[`time${i + 1}_e`]),
          ratio: Number((ctrlParams as any)[`time${i + 1}_r`]),
        };
        offlineActiveTimeRanges[i] = {
          start: minute2TimeStr((ctrlParams as any)[`brk_time${i + 1}_s`]),
          end: minute2TimeStr((ctrlParams as any)[`brk_time${i + 1}_e`]),
        }
      }

      this.offlineSyncTime = ctrlParams.last_updated_controltime_time;
      this.controllerSyncTime = ctrlParams.controller_eff_time;
    });
  }

  ngOnInit(): void {
  }

  //* 处理所有时间输入框改变事件
  async handleTimeInputChange(which: string, ev: Event) {
    await this.aeratorService.updateAeratorCtrlParam(which as (keyof AeratorCtrlTimeParams), timeStr2minute((ev.target as HTMLInputElement).value));
  }

  //* 处理所有时间比例输入框改变事件
  async handleTimeRatioInputChange(which: string, ev: Event) {
    await this.aeratorService.updateAeratorCtrlParam(which as (keyof AeratorCtrlTimeParams), Number((ev.target as HTMLInputElement).value));
  }

  //* 处理所有重置按钮点击事件
  async handleRemoveTimeField(paramName: string, fieldIdx: number, isOfflineParam: boolean) {
    await this.aeratorService.removeAeratorTimeParam(paramName as AeratorRemovableTimeParamNames);
    // 清空组件相应属性项
    if (isOfflineParam) this.offlineActiveTimeRanges[fieldIdx] = { start: '', end: '' };
    else this.activeTimeParams[fieldIdx] = { start: '', end: '', ratio: null };
  }

  async handleUpdateOfflineSetting() {
    this.offlineSyncTime = (await this.aeratorService.updateOfflineTimeParamSetting()).result.time;
  }
}

function timeStr2minute(str: string) {
  return Number(str[0] + str[1]) * 60 + Number(str[3] + str[4]);
}

function minute2TimeStr(value: number) {
  const h = Math.floor(value / 60);
  const m = value - h * 60;
  return (h < 10 ? '0' + h : h) + ':' + (m < 10 ? '0' + m : m);
}
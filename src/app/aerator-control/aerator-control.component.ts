import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';
import { MatSelectChange } from '@angular/material/select';
import { AeratorService } from '../aerator.service';
import { AeratorLeadTimeJudgementValue, AeratorManualMode, AeratorUpdatableCtrlParamNames } from '../types';
import { debounce } from '../utils/debounce&throttle';

// 将参数输入框名称映射到增氧机参数.
type ParamInputId = 'avgThres' | 'minThres' | 'lowValueRatio';
const paramInputId2ParamName: Record<ParamInputId, AeratorUpdatableCtrlParamNames> = {
  avgThres: 'no_fishing_intensity',
  minThres: 'strong_activity_val',
  lowValueRatio: 'strong_activity_ratio',
};


@Component({
  selector: 'app-aerator-control',
  templateUrl: './aerator-control.component.html',
  styleUrls: ['./aerator-control.component.scss'],
  encapsulation: ViewEncapsulation.None,  // 关闭CSS Modules
})
export class AeratorControlComponent implements OnInit {

  private static inputDebounceTimeMs: number = 1000;

  // 启动自动控制
  autoControlActive: boolean = null;
  // 当前电源控制模式
  powerManualControlMode: AeratorManualMode = null;

  // 前置时间判定选择
  leadTimeJudgement: AeratorLeadTimeJudgementValue = null;
  // 平均值阈值
  avgThres: number = null;
  // 最小值阈值
  minThres: number = null;
  // 低值比例
  lowValueRatio: number = null;

  //* 构造函数
  constructor(private aeratorService: AeratorService) {

    // 订阅增氧机id改变
    aeratorService.subscribeAeratorIdChange((currentId, ctrlParams) => {
      const {
        enabled,
        control_type,
        manual_mode,
        no_fishing_intensity,
        strong_activity_val,
        strong_activity_ratio
      } = ctrlParams;

      this.autoControlActive = enabled === 1;
      this.powerManualControlMode = manual_mode;
      this.leadTimeJudgement = control_type;
      this.avgThres = no_fishing_intensity;
      this.minThres = strong_activity_val;
      this.lowValueRatio = strong_activity_ratio;
    });

    // 初始化输入防抖函数表
    const paramInputs: ParamInputId[] = ['avgThres', 'lowValueRatio', 'minThres'];
    paramInputs.forEach((inputId) => {
      this.inputDebouncedFuncMap.set(inputId, debounce((value: number) => {
        aeratorService.updateAeratorCtrlParam(paramInputId2ParamName[inputId], value)
          .catch(console.log);
      }, AeratorControlComponent.inputDebounceTimeMs));
    });
  }

  ngOnInit(): void {
  }

  async handleAutoControlActiveChange() {
    this.autoControlActive = !this.autoControlActive;
    await this.aeratorService.updateAeratorCtrlParam('enabled', this.autoControlActive ? 1 : 0);
  }

  handlePowerManualControlModeChange(ev: MatRadioChange) {
    this.powerManualControlMode = ev.value;
    this.aeratorService.updateAeratorCtrlParam('manual_mode', ev.value);
  }

  handleLeadTimeJudgementSelectionChange(ev: MatSelectChange) {
    this.leadTimeJudgement = ev.value;
    this.aeratorService.updateAeratorCtrlParam('control_type', ev.value);
  }

  private inputDebouncedFuncMap: Map<ParamInputId, (value: number) => void> = new Map();
  handleInputValueChange(which: ParamInputId, ev: Event) {
    // TODO：校验输入参数数据格式
    const value = this[which] = Number((ev.target as HTMLInputElement).value);
    this.inputDebouncedFuncMap.get(which)(value);
  }

}

/**
 * 水质监测面板
 * @author shepard
 */

import { Component, OnInit, } from '@angular/core';
import { number } from 'echarts';
import { AeratorService } from '../aerator.service';
import { AeratorStatusName } from '../types';
import { dolChartOption, pHChartOption, waterTemperChartOption } from '../utils/chartOptions';

import echarts, { MyEchartsOption } from '../utils/echartsInit';

// 类型定义
type ChartId = 'dolChart' | 'pHChart' | 'waterTemperChart';

interface WaterQualityChart {
  chartId: ChartId;
  statusId: AeratorStatusName;
  options: MyEchartsOption;
  instance: echarts.ECharts;
  prevMaxId: number;
  maxStatusPoints: number;
}

@Component({
  selector: 'app-water-quality',
  templateUrl: './water-quality.component.html',
  styleUrls: ['./water-quality.component.scss']
})
export class WaterQualityComponent implements OnInit {

  private static readonly reqRateMs: number = 2000; // 请求频率
  private static readonly prevMinutes: number = 3;  // 显示先前的状态分钟数

  isChartsInitialized: boolean = false;

  // 图表信息
  private waterQualityCharts: WaterQualityChart[] = [];

  ngOnInit() {
  }

  // *构造函数
  private updateInterval: any = null;
  constructor(private aeratorService: AeratorService) {
    // 订阅当前增氧机Id改变
    aeratorService.subscribeAeratorIdChange((aerator) => {
      if (this.updateInterval) clearInterval(this.updateInterval);
      this.initCharts();
      this.updateCharts();
      // 定时请求更新一次溶氧量
      this.updateInterval = setInterval(this.updateCharts.bind(this), WaterQualityComponent.reqRateMs);
    });
  }

  private initCharts() {
    // 清除所有数据
    this.waterQualityCharts.forEach((chart) => {
      (chart.options.series as any)[0].data = [];
      chart.instance?.dispose();
    });

    this.waterQualityCharts = [{
      chartId: 'dolChart',
      instance: null,
      statusId: 'dol',
      options: dolChartOption,
      prevMaxId: null,
      maxStatusPoints: null,
    }, {
      chartId: 'pHChart',
      instance: null,
      statusId: 'pH',
      options: pHChartOption,
      prevMaxId: null,
      maxStatusPoints: null,
    }, {
      chartId: 'waterTemperChart',
      instance: null,
      statusId: 'water-temper',
      options: waterTemperChartOption,
      prevMaxId: null,
      maxStatusPoints: null,
    }];

    this.isChartsInitialized = false;
  }

  //* 更新所有图表
  private async updateCharts() {
    const { aeratorService, waterQualityCharts, isChartsInitialized } = this;

    // 如果图表未创建实例，则创建所有监控图表实例
    waterQualityCharts.forEach((chart) => {
      if (!isChartsInitialized) {
        const mountingPoint = document.getElementById(chart.chartId);
        if (mountingPoint) {
          chart.instance = echarts.init(mountingPoint);
          this.isChartsInitialized = true;
        }
      }
    });

    // 尺寸校正
    waterQualityCharts.forEach((chart) => {
      if (!chart.instance) return false;

      chart.instance.resize({
        width: 'auto',
        height: 'auto'
      });
      return true;
    });

    // 更新所有图表
    for (const chart of waterQualityCharts) {
      if (!chart.instance) break;

      const dataArray = (chart.options.series as any)[0].data as [[Date, number]];

      // 超过最大点数则清除首部点
      if (chart.maxStatusPoints && dataArray.length >= chart.maxStatusPoints)
        dataArray.splice(0, dataArray.length - chart.maxStatusPoints);

      // 请求状态点更新
      const { points, prevMaxId } = await aeratorService.getStatus(
        chart.statusId,
        WaterQualityComponent.prevMinutes,
        chart.prevMaxId);

      // 将首次请求得到的状态点数作为最大状态点数
      if (!chart.maxStatusPoints) chart.maxStatusPoints = points.length;

      // 记录此前最大的状态点id
      chart.prevMaxId = prevMaxId;

      for (const pt of points || [])
        dataArray.push([new Date(pt.x), pt.y]);

      chart.instance.setOption(chart.options);
    }
  }

}

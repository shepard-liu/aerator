import { Component, OnInit, } from '@angular/core';
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
}

@Component({
  selector: 'app-water-quality',
  templateUrl: './water-quality.component.html',
  styleUrls: ['./water-quality.component.scss']
})
export class WaterQualityComponent implements OnInit {

  private static readonly maxPoints: number = 100; // 最多显示的点数
  private static readonly reqRateMs: number = 2000; // 请求频率

  isChartsInitialized: boolean = false;

  // 图表信息
  private readonly waterQualityCharts: WaterQualityChart[] = [{
    chartId: 'dolChart',
    instance: null,
    statusId: 'dol',
    options: dolChartOption,
  }, {
    chartId: 'pHChart',
    instance: null,
    statusId: 'pH',
    options: pHChartOption,
  }, {
    chartId: 'waterTemperChart',
    instance: null,
    statusId: 'water-temper',
    options: waterTemperChartOption,
  }];

  ngOnInit() {

  }

  // *构造函数
  constructor(private aeratorService: AeratorService) {
    this.updateCharts();
    // 定时请求更新一次溶氧量
    setInterval(this.updateCharts.bind(this), WaterQualityComponent.reqRateMs);
  }

  private async updateCharts() {
    const { aeratorService, waterQualityCharts, isChartsInitialized } = this;

    // 如果图表未初始化，则初始化所有监控图表
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
      if (dataArray.length >= WaterQualityComponent.maxPoints)
        dataArray.splice(0, dataArray.length - WaterQualityComponent.maxPoints);

      dataArray.push([new Date(), await aeratorService.getStatus(chart.statusId)]);
      chart.instance.setOption(chart.options);
    }
  }

}

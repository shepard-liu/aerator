/**
 * 图表配置文件
 * @author shepard
 */

import echarts, { MyEchartsOption } from './echartsInit';

// 溶氧量图表配置
export const dolChartOption: MyEchartsOption = {
    xAxis: {
        type: 'time',
        name: '时间',
        axisLabel: {
            rotate: 30,
            fontSize: 10
        },
    },
    yAxis: {
        type: 'value',
        name: '溶氧量\n(mg/L)'
    },
    tooltip: {
        trigger: 'axis',
    },
    series: [{
        type: 'line',
        areaStyle: {
            opacity: 0.8,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                    offset: 0,
                    color: 'rgb(0, 221, 255)'
                },
                {
                    offset: 1,
                    color: 'rgb(77, 119, 255)'
                }
            ])
        },
        data: [
        ]
    }],
}



// 溶氧量图表配置
export const pHChartOption: MyEchartsOption = {
    xAxis: {
        type: 'time',
        name: '时间',
        axisLabel: {
            rotate: 30,
            fontSize: 10
        }
    },
    yAxis: {
        type: 'value',
        name: 'pH值'
    },
    tooltip: {
        trigger: 'axis',
    },
    series: [{
        type: 'line',
        areaStyle: {
            opacity: 0.8,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                    offset: 0,
                    color: 'rgb(255, 191, 0)'
                },
                {
                    offset: 1,
                    color: 'rgb(224, 62, 76)'
                }
            ])
        },
        data: [
        ]
    }],
}


// 溶氧量图表配置
export const waterTemperChartOption: MyEchartsOption = {
    xAxis: {
        type: 'time',
        name: '时间',
        axisLabel: {
            rotate: 30,
            fontSize: 10
        }
    },
    yAxis: {
        type: 'value',
        name: '水温(°C)'
    },
    tooltip: {
        trigger: 'axis',
    },
    series: [{
        type: 'line',
        areaStyle: {
            opacity: 0.8,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                    offset: 0,
                    color: 'rgb(255, 129, 24)'
                },
                {
                    offset: 1,
                    color: 'rgb(56, 188, 255)'
                }
            ])
        },
        data: [
        ]
    }],
}
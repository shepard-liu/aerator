/**
 * Echarts按需导入
 * @author shepard
 */

import * as echarts from 'echarts/core';
import { LineChart, LineSeriesOption } from 'echarts/charts';
import {
    TitleComponent,
    TitleComponentOption,
    TooltipComponent,
    TooltipComponentOption,
    DatasetComponent,
    DatasetComponentOption,
    GridComponent,
    GridComponentOption,

} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

// Echarts Options
export type MyEchartsOption = echarts.ComposeOption<
    | LineSeriesOption
    | TooltipComponentOption
    | TitleComponentOption
    | DatasetComponentOption
    | GridComponentOption
>;

echarts.use([
    LineChart,
    TitleComponent,
    TooltipComponent,
    DatasetComponent,
    CanvasRenderer,
    GridComponent
]);

export default echarts;
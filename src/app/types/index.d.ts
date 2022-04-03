/**
 * 类型定义文件
 * 这里许多地方应该使用枚举类型（赶时间，算了。）
 * @author shepard
 */

import { ResponseGetCtrlParams } from "./httpTypes";

export interface User {
    username: string,
    password: string,
}

export interface Aerator {
    id: string,
}

// 增氧机状态
export type AeratorStatusName = 'dol' | 'pH' | 'water-temper';

export interface AeratorCtrlTimeParams {

    brk_time1_e: number;
    brk_time1_s: number;
    brk_time2_e: number;
    brk_time2_s: number;
    brk_time3_e: number;
    brk_time3_s: number;
    brk_time4_e: number;
    brk_time4_s: number;

    time1_e: number;
    time1_r: number;
    time1_s: number;
    time2_e: number;
    time2_r: number;
    time2_s: number;
    time3_e: number;
    time3_r: number;
    time3_s: number;
    time4_e: number;
    time4_r: number;
    time4_s: number;
}

export interface AeratorCtrlParams extends AeratorCtrlTimeParams {
    control_type: AeratorLeadTimeJudgementValue;
    controller_eff_time: string;
    enabled: 0 | 1;
    feeder_cycle_time: number;
    feeder_min_time: number;
    feeder_reset_time: number;
    feeder_test_try: number;
    last_updated_controltime_time: string;
    manual_mode: AeratorManualMode;
    model_time_control: number;
    no_fishing_intensity: number;
    strong_activity_ratio: number;
    strong_activity_val: number;
}

export type AeratorUpdatableCtrlParamNames = Exclude<keyof AeratorCtrlParams, 'controller_eff_time' | 'last_updated_controltime_time'>;

export type AeratorLeadTimeJudgementValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type AeratorManualMode = 0 | 1 | 2;

export type AeratorRemovableTimeParamNames = 'time1' | 'time2' | 'time3' | 'time4' | 'brk_time1' | 'brk_time2' | 'brk_time3' | 'brk_time4';
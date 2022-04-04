/**
 * 异步请求体、响应体类型定义文件
 * @author shepard
 */

import { AeratorCtrlParams, AeratorGroup, AeratorLeadTimeJudgementValue, AeratorManualMode } from ".";

export interface RequestUser {
    email: string,
    password: string,
    isaerator: 1 | 0,
}

export interface ResponseUser {
    success: 1 | 0,
    result: {
        usr_id: number,
        uid: string,
        isAdmin: "0" | "1",
        tel: string,
        company: string,
        contacts: string
    },
    default_iot: string
}

export interface RequestGetDefaultIotId {
    isaerator: 1 | 0;
}

export interface ResponseGetDefaultIotId {
    code: number;
    result: {
        default_iot_id: string;
    }
}

export interface RequestGetCtrlParams {
    unique_iot_id: string;
}


export interface ResponseGetCtrlParams {
    code: number;
    result: AeratorCtrlParams;
}

export interface RequestUpdateCtrlParam {
    unique_iot_id: string;
    fname: string;
    fvalue: number;
}

export interface ResponseUpdateCtrlParam {
    code: number,
    message: string;
}

export interface RequestUpdateLastFreeTime {
    unique_iot_id: string;
}

export interface ResponseUpdateLastFreeTime {
    code: number;
    result: {
        time: string;
    }
}

export interface RequestRemoveTimeParam {
    unique_iot_id: string;
    fname: string;
}

export interface ResponseRemoveTimeParam {
    code: number;
    result: {
        flag: true;
    }
}

export interface RequestGetAvailableDevices {
    isaerator: 1 | 0
}

export interface ResponseGetAvailableDevices {
    code: number;
    result: {
        list: AeratorGroup[]
    }
}


export interface RequestGetStatus {
    unique_iot_id: string,
    fname: string,
    prev_minutes: number,
    prev_max_id: number,
}

export interface ResponseGetStatus {
    code: number;
    max_id: number;
    result: {
        pts: { id: number, x: number, y: number }[];
        status: number;
    };
    type: number
}
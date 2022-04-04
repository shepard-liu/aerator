/**
 * 异步请求Utility
 * @author shepard
 */

import { environment } from "src/environments/environment";
import { AeratorCtrlParams, AeratorRemovableTimeParamNames, AeratorStatusName, AeratorUpdatableCtrlParamNames } from "../types";
import { RequestUser, ResponseUser, RequestGetCtrlParams, ResponseGetCtrlParams, RequestUpdateCtrlParam, ResponseUpdateCtrlParam, RequestUpdateLastFreeTime, RequestRemoveTimeParam, ResponseRemoveTimeParam, ResponseUpdateLastFreeTime, RequestGetDefaultIotId, ResponseGetDefaultIotId, RequestGetAvailableDevices, ResponseGetAvailableDevices, RequestGetStatus, ResponseGetStatus } from "../types/httpTypes";

/**
 * 发送请求（Async）
 * @param fname 函数名
 * @param fparam 函数参数
 * @returns Promise<Response> 响应
 */
export async function sendRequestAsync(fname: string, fparam: Object, sendCredentials?: boolean) {
    const fparamWithCredentials = {
        ...fparam,
        ...(sendCredentials === false ? null : JSON.parse(localStorage.getItem('credentials')))
    };

    return await fetch(
        environment.production
            ? './fishsystem/getData.jsp'
            : 'http://47.93.237.6:8080/fishsystem/getData.jsp', {

        method: "POST",
        headers: { "Content-Type": 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            fname,
            fparam: JSON.stringify(fparamWithCredentials)
        }),
    });
}

/**
 * 发送请求（Async, JSON响应），包装sendRequestAsync函数并返回解析JSON得到的对象
 * @param fname 函数名
 * @param fparam 函数参数
 * @returns Promise<ResponseBodyType> JSON解析得到的对象
 */
export async function sendRequestAsyncJson<RequestBodyType, ResponseBodyType>(fname: string, fparam: RequestBodyType, sendCredentials?: boolean) {
    return (await sendRequestAsync(fname, fparam, sendCredentials)).json() as Promise<ResponseBodyType>;
}

/**
 * 发送登陆请求（Async）。将清除本地存储中的用户凭证
 * @param username 用户名
 * @param password 密码
 * @returns 登陆响应结果
 */
export async function sendLoginRequestAsync(username: string, password: string): Promise<{ isLoggedIn: boolean, default_iot: string }> {
    localStorage.removeItem('credentials');

    const res = await sendRequestAsyncJson<RequestUser, ResponseUser>(
        'getuserinfo', {
        email: username,
        password,
        isaerator: 1
    }, false);

    if (res.success !== 1)
        return { isLoggedIn: false, default_iot: null };

    // 将用户凭证保存
    localStorage.setItem('credentials', JSON.stringify({ uid: res.result.usr_id, s_id: res.result.uid }));

    return { isLoggedIn: true, default_iot: res.default_iot };
}

/**
 * 请求当前用户默认的iot设备
 * @returns 默认的iot设备id
 */
export async function sendGetDefaultIotRequestAsync() {
    return (await sendRequestAsyncJson<RequestGetDefaultIotId, ResponseGetDefaultIotId>(
        'getdefaultiot', {
        isaerator: 1
    })).result.default_iot_id;
}

/**
 * 请求当前用户可用的设备列表
 * @returns 
 */
export async function sendGetAvailableDevicesRequestAsync() {
    return (await sendRequestAsyncJson<RequestGetAvailableDevices, ResponseGetAvailableDevices>(
        'getpool', {
        isaerator: 1
    })).result.list;
}

/**
 * 请求增氧机水质监测状态
 * @param iotId 增氧机id
 * @param statusName 状态名
 * @param prevMinutes 先前的分钟数
 * @param prevMaxId 先前最大的状态点id
 * @returns 
 */
export async function sendGetStatusRequestAsync(iotId: string, statusName: AeratorStatusName, prevMinutes: number, prevMaxId: number) {
    let fname = '';
    switch (statusName) {
        case 'dol': fname = 'do'; break;
        case 'pH': fname = 'ph'; break;
        case 'water-temper': fname = 'temp'; break;
        default:
            throw new Error('Unknown status name');
    }

    const res = await sendRequestAsyncJson<RequestGetStatus, ResponseGetStatus>(
        'getpond_water_quality', {
        fname,
        unique_iot_id: iotId,
        prev_max_id: prevMaxId,
        prev_minutes: prevMinutes
    });

    return {
        points: res.result.pts,
        prevMaxId: res.max_id,
        status: res.result.status
    }
}

/**
 * 请求iotId对应的增氧机设备当前控制参数
 * @param iotId 增氧机id
 * @returns 增氧机控制参数
 */
export async function sendGetCtrlParamsRequestAsync(iotId: string): Promise<ResponseGetCtrlParams> {
    return await sendRequestAsyncJson<RequestGetCtrlParams, ResponseGetCtrlParams>(
        'getparameters_iot', {
        unique_iot_id: iotId
    });
}

/**
 * 请求参数更新
 * @param iotId 增氧机id
 * @param param 增氧机参数名
 * @param value 增氧机参数值
 * @returns 
 */
export async function sendUpdateCtrlParamsRequestAsync<T extends AeratorUpdatableCtrlParamNames>(
    iotId: string,
    param: T,
    value: AeratorCtrlParams[T]) {

    let fname: string = null;

    switch (param) {
        case 'control_type':
        case 'enabled':
        case 'manual_mode':
        case 'strong_activity_ratio':
        case 'no_fishing_intensity':
        case 'strong_activity_val':
        case 'time1_e':
        case 'time2_e':
        case 'time3_e':
        case 'time4_e':
        case 'time1_r':
        case 'time2_r':
        case 'time3_r':
        case 'time4_r':
        case 'time1_s':
        case 'time2_s':
        case 'time3_s':
        case 'time4_s':
            fname = 'updateparams';
            break;

        case 'brk_time1_e':
        case 'brk_time2_e':
        case 'brk_time3_e':
        case 'brk_time4_e':
        case 'brk_time1_s':
        case 'brk_time2_s':
        case 'brk_time3_s':
        case 'brk_time4_s':
            fname = 'updatenolinktimes';
            break;

        default:
            throw new Error('Unexpected parameter name.');
    }

    return await sendRequestAsyncJson<RequestUpdateCtrlParam, ResponseUpdateCtrlParam>(
        fname, {
        unique_iot_id: iotId,
        fname: param,
        fvalue: value
    });
}

/**
 * 请求更新控制器同步更新时间（？？？）
 * @param iotId 增氧机id
 */
export async function sendUpdateLastFreeTimeRequestAsync(iotId: string) {
    return await sendRequestAsyncJson<RequestUpdateLastFreeTime, ResponseUpdateLastFreeTime>(
        'updatelastfreetime', {
        unique_iot_id: iotId,
    });
}

/**
 * 移除控制器设定的时间
 * @param iotId 增氧机id
 * @param timeToRemove 要移除的控制器时间设定
 */
export async function sendRemoveTimeParamRequestAsync(iotId: string, timeToRemove: AeratorRemovableTimeParamNames) {
    return await sendRequestAsyncJson<RequestRemoveTimeParam, ResponseRemoveTimeParam>(
        'updateparams_removetime', {
        unique_iot_id: iotId,
        fname: timeToRemove
    });
}
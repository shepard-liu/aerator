/**
 * 异步请求Utility
 * @author shepard
 */

import { environment } from "src/environments/environment";
import { AeratorCtrlParams, AeratorRemovableTimeParamNames, AeratorUpdatableCtrlParamNames } from "../types";
import { RequestUser, ResponseUser, RequestGetCtrlParams, ResponseGetCtrlParams, RequestUpdateCtrlParam, ResponseUpdateCtrlParam, RequestUpdateLastFreeTime, RequestRemoveTimeParam, ResponseRemoveTimeParam, ResponseUpdateLastFreeTime } from "../types/httpTypes";

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

    const res = await fetch(
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
    return res;
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
    localStorage.removeItem('username');
    localStorage.removeItem('password');

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
    localStorage.setItem('username', username);
    localStorage.setItem('password', password);

    return { isLoggedIn: true, default_iot: res.default_iot };
}

/**
 * 请求当前用户默认的iot设备，
 * 该函数暂时使用localStorage中存储的用户名和密码。
 * 当后端提供使用sid和uid请求的接口后修改此函数
 */
export async function sendGetDefaultIotRequestAsync() {
    //TODO：错误处理
    return (await sendLoginRequestAsync(
        localStorage.getItem('username'),
        localStorage.getItem('password'))).default_iot;
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
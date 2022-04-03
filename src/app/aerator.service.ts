/**
 * 增氧机服务
 * @author shepard
 */

import { Injectable } from '@angular/core';
import { Aerator, AeratorCtrlParams, AeratorRemovableTimeParamNames, AeratorStatusName, AeratorUpdatableCtrlParamNames } from './types';
import { UserService } from './user.service';
import { sendGetCtrlParamsRequestAsync, sendUpdateCtrlParamsRequestAsync, sendRemoveTimeParamRequestAsync, sendLoginRequestAsync, sendGetDefaultIotRequestAsync, sendUpdateLastFreeTimeRequestAsync } from './utils/ajaxUtils';

@Injectable({
  providedIn: 'root'
})
export class AeratorService {

  constructor() {
  }

  //* 当前增氧机id
  private _aeratorId: string = null;
  get aeratorId() {
    return this._aeratorId;
  }
  set aeratorId(id: string) {
    if (id === this.aeratorId) return;
    this._aeratorId = id;

    sendGetCtrlParamsRequestAsync(id).then((params) => {
      // 在本服务先获取了增氧机控制参数后，再通知所有id订阅者
      this.idSubscribers.forEach(subscriber => { subscriber(this._aeratorId, params.result); });
    }).catch(console.log);
  }

  //* 增氧机状态获取
  async getStatus(status: AeratorStatusName): Promise<number | never> {
    // TODO: 增加请求代码
    switch (status) {
      case 'dol':
        return new Promise((resolve, reject) => resolve(Math.random() + 20));
      case 'pH':
        return new Promise((resolve, reject) => resolve(Math.random() + 7));
      case 'water-temper':
        return new Promise((resolve, reject) => resolve(Math.random() + 22));
      default:
        throw new Error('Unknown status specified.');
    }
  }

  //* 增氧机id改变时调用，通知订阅此变化的组件
  private idSubscribers: AeratorSubscriber[] = [];

  /**
   * 订阅增氧机Id改变（用户触发）
   * @param subscriber 订阅回调函数，增氧机改变时调用
   * @param initCall 是否在订阅后立即调用
   * @returns AeratorIdSubscription 订阅对象
   */
  subscribeAeratorIdChange(subscriber: AeratorSubscriber, initCall?: boolean): AeratorIdSubscription {
    const idSubscribers = this.idSubscribers;
    idSubscribers.push(subscriber);

    const _self = this;

    const subscriberIndex = idSubscribers.length - 1;
    let isSubscribed = true;

    return {
      getCurrentId() { return _self.aeratorId; },
      cancelSubscription() {
        if (!isSubscribed) return;
        idSubscribers.splice(subscriberIndex, 1);
        isSubscribed = false;
      }
    };
  }

  async getDefaultAerator(): Promise<Aerator> {
    // TODO:（需要后端支持）在凭证未过期的情况下获取当前用户默认的增氧机设备id
    return { id: await sendGetDefaultIotRequestAsync() };
  }

  /**
   * 查询当前账户关联的增氧机
   * @returns 增氧机信息数组
   * @throws 用户状态错误
   */
  async getRelatedAerators(): Promise<Aerator[]> {
    // TODO：暂时返回当前的iot
    //!目前已知的问题：(解决需要后端提供接口)
    // 1. 刷新页面之后当前iot会消失，因为只有在登陆时才能获取default_iot。
    // 2. 无法获取账户可用的iot列表。
    return this.aeratorId ? [{ id: this.aeratorId }] : [];
  }

  /**
   * 更新增氧机控制参数
   * @param param 增氧机控制参数名
   * @param value 增氧机控制参数值
   * @returns 
   */
  async updateAeratorCtrlParam<T extends AeratorUpdatableCtrlParamNames>(
    param: T,
    value: AeratorCtrlParams[T]) {
    return await sendUpdateCtrlParamsRequestAsync(this._aeratorId, param, value);
  }

  /**
   * 清除增氧机的时间设定
   * @param timeToRemove 要清楚的时间设定参数名称
   * @returns 
   */
  async removeAeratorTimeParam(timeToRemove: AeratorRemovableTimeParamNames) {
    return await sendRemoveTimeParamRequestAsync(this._aeratorId, timeToRemove);
  }

  /**
   * 更新增氧机离线时间设置
   * @returns 
   */
  async updateOfflineTimeParamSetting() {
    return await sendUpdateLastFreeTimeRequestAsync(this._aeratorId);
  }
}

// 增氧机Id订阅
interface AeratorIdSubscription {
  getCurrentId: () => string;
  cancelSubscription: () => void;
}

type AeratorSubscriber = (currentId: string, ctrlParams: AeratorCtrlParams) => unknown;

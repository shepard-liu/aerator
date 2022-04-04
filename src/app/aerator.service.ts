/**
 * 增氧机服务
 * @author shepard
 */

import { APP_BASE_HREF } from '@angular/common';
import { Injectable } from '@angular/core';
import { Aerator, AeratorCtrlParams, AeratorGroup, AeratorRemovableTimeParamNames, AeratorStatusName, AeratorUpdatableCtrlParamNames } from './types';
import { sendGetCtrlParamsRequestAsync, sendUpdateCtrlParamsRequestAsync, sendRemoveTimeParamRequestAsync, sendLoginRequestAsync, sendGetDefaultIotRequestAsync, sendUpdateLastFreeTimeRequestAsync, sendGetAvailableDevicesRequestAsync, sendGetStatusRequestAsync } from './utils/ajaxUtils';

// 增氧机Id订阅
interface AeratorIdSubscription {
  cancelSubscription: () => void;
}

type AeratorSubscriber = (aerator: Aerator, ctrlParams: AeratorCtrlParams) => unknown;

@Injectable({
  providedIn: 'root'
})
export class AeratorService {

  constructor() {
  }

  /**
   * 在登陆后初始化本服务！
   */
  async init() {
    this._aeratorGroups = await this.getAvailableAerators();
    this.aerator = await this.getDefaultAerator();
  }

  //* 可用增氧机列表
  private _aeratorGroups: AeratorGroup[] = null;
  get aeratorGroups() { return this._aeratorGroups; }

  //* 当前增氧机
  private _aerator: Aerator = null;
  get aerator() {
    return this._aerator;
  }
  set aerator(a: Aerator) {
    if (a?.id === this.aerator?.id) return;
    if (!this._aeratorGroups.find((group) => group.children.find((_a) => _a.id === a.id)))
      throw new Error('Aerator does not exist.');

    this._aerator = a;

    sendGetCtrlParamsRequestAsync(a.id).then((params) => {
      // 在本服务先获取了增氧机控制参数后，再通知所有id订阅者
      this.idSubscribers.forEach(subscriber => { subscriber(a, params.result); });
    }).catch(console.log);
  }

  //* 由id获取增氧机
  getAeratorById(id: string) {
    // 检查aeratorGroup是否已获取
    if (!this._aeratorGroups) throw new Error('Aerator groups not acquired.');

    // 使用id搜索目标增氧机
    for (const group of this._aeratorGroups) {
      const target = group.children.find((a) => a.id === id);
      if (target) return target;
    }
    return null;
  }

  //* 增氧机id改变时调用，通知订阅此变化的组件
  private idSubscribers: AeratorSubscriber[] = [];

  /**
   * 订阅增氧机Id改变（用户触发）
   * @param subscriber 订阅回调函数，增氧机改变时调用
   * @returns AeratorIdSubscription 订阅对象
   */
  subscribeAeratorIdChange(subscriber: AeratorSubscriber): AeratorIdSubscription {
    const idSubscribers = this.idSubscribers;
    idSubscribers.push(subscriber);

    const subscriberIndex = idSubscribers.length - 1;
    let isSubscribed = true;

    return {
      cancelSubscription() {
        if (!isSubscribed) return;
        idSubscribers.splice(subscriberIndex, 1);
        isSubscribed = false;
      }
    };
  }

  /**
   * 请求增氧机状态信息
   * @param status 状态名
   * @param prevMinutes 先前的分钟数
   * @param prevMaxId 先前状态点最大id
   * @returns 
   */
  async getStatus(status: AeratorStatusName, prevMinutes?: number, prevMaxId?: number) {
    return await sendGetStatusRequestAsync(this._aerator.id, status, prevMinutes || 15, prevMaxId || null);
  }

  /**
   * 获取用户默认的Aerator设备
   * @returns 
   */
  async getDefaultAerator(): Promise<Aerator> {
    return this.getAeratorById(await sendGetDefaultIotRequestAsync());
  }

  /**
   * 查询当前账户关联的增氧机
   * @returns 增氧机信息数组
   * @throws 用户状态错误
   */
  async getAvailableAerators() {
    return await sendGetAvailableDevicesRequestAsync();
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
    return await sendUpdateCtrlParamsRequestAsync(this._aerator.id, param, value);
  }

  /**
   * 清除增氧机的时间设定
   * @param timeToRemove 要清楚的时间设定参数名称
   * @returns 
   */
  async removeAeratorTimeParam(timeToRemove: AeratorRemovableTimeParamNames) {
    return await sendRemoveTimeParamRequestAsync(this._aerator.id, timeToRemove);
  }

  /**
   * 更新增氧机离线时间设置
   * @returns 
   */
  async updateOfflineTimeParamSetting() {
    return await sendUpdateLastFreeTimeRequestAsync(this._aerator.id);
  }
}

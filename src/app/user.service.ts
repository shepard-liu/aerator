/**
 * * 用户服务
 * @author shepard
 */

import { Injectable } from '@angular/core';
import { sendLoginRequestAsync } from './utils/ajaxUtils';
import { ResponseUser } from './types/httpTypes';
import { AeratorService } from './aerator.service';
import { User } from './types';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private aeratorService: AeratorService) {
  }

  /**
   * 发送登陆请求
   * @param user 用户凭证对象
   * @returns 登陆是否成功
   * @throws 服务端错误
   */
  async login(user: User): Promise<boolean> {
    const { username, password } = user;
    const { default_iot, isLoggedIn } = await sendLoginRequestAsync(username, password);
    // 设置当前的默认iot
    if (isLoggedIn)
      this.aeratorService.aeratorId = default_iot;
    return isLoggedIn;
  }

  /**
   * 返回登陆状态
   * @returns 
   */
  isLoggedIn(): boolean {
    return localStorage.getItem('credentials') !== null;
  }

}

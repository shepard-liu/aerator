/**
 * 增氧机管理应用
 * @author shepard
 */

import { Component } from '@angular/core';
import { UserService } from './user.service';
import { Router } from '@angular/router';
import { AeratorService } from './aerator.service';
import { Aerator } from './types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'feeder';
  relatedAerators: Aerator[] = [];
  currentAerator: Aerator = null;

  constructor(
    private router: Router,
    private aeratorService: AeratorService,
    public userService: UserService) {

    // 若没有登陆，则跳转到/login；若已经登陆，则跳转到/main
    if (!userService.isLoggedIn())
      router.navigateByUrl('/login');
    else {
      // 获取当前增氧机
      aeratorService.getDefaultAerator().then((value) => {
        aeratorService.aeratorId = value.id;
        return aeratorService.getRelatedAerators();
      }).then((value) => {
        this.relatedAerators = value;
      }).catch(console.log);
      router.navigateByUrl('/main');
    }

    // 订阅aeratorId改变
    aeratorService.subscribeAeratorIdChange((currentId) => {
      this.currentAerator = { id: currentId };

      // 请求当前账户下的增氧机
      aeratorService.getRelatedAerators()
        .then(aerators => { this.relatedAerators = aerators })
        .catch(console.log);
    });


  }

  /**
   * 处理改变当前增氧机事件
   * @param which 切换到新的Aerator
   */
  handleChangeAerator(which: Aerator) {
    if (which !== this.currentAerator) {
      this.aeratorService.aeratorId = which.id;
    }
  }
}

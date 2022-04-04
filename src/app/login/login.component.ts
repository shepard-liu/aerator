/**
 * 登陆组件
 * @author shepard
 */

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AeratorService } from '../aerator.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  username: string = '';
  password: string = '';
  loginMessage: string = '';
  loginMessageClasses: string = 'login-message';

  constructor(
    private userService: UserService,
    private aeratorService: AeratorService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  // 处理用户输入事件
  handleInput(which: 'username' | 'password', event: any) {
    this[which] = (event.target as HTMLInputElement).value;
  }

  async handleLogin() {
    const { username, password } = this;
    let isLoggedIn: boolean = false;
    try {
      isLoggedIn = await this.userService.login({ username, password });
      this.aeratorService.init();
    } catch (err) {
      console.log(err);
    }

    if (isLoggedIn) {
      this.router.navigateByUrl('/main');
    }
    else {
      this.loginMessage = '登陆失败，请检查用户名和密码';
      this.loginMessageClasses = 'login-message login-message-show';
    }
  }

}

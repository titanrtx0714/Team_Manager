import { AfterViewInit, Component, Inject, PLATFORM_ID, ViewChild, OnInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NbLayoutComponent } from '@nebular/theme';
import { UsersService } from '../../../@core/services/users.service';


import { WindowModeBlockScrollService } from '../../services/window-mode-block-scroll.service';
import { Store } from '../../../@core/services/store.service';

@Component({
  selector: 'ngx-one-column-layout',
  styleUrls: ['./one-column.layout.scss'],
  templateUrl: './one-column.layout.html',
})
export class OneColumnLayoutComponent implements OnInit, AfterViewInit {

  @ViewChild(NbLayoutComponent, { static: false }) layout: NbLayoutComponent;

  user: any;

  userMenu = [
    { title: 'Profile' },
    { title: 'Log out', link: '/auth/logout' }
  ];

  constructor(
    @Inject(PLATFORM_ID) private platformId,
    private windowModeBlockScrollService: WindowModeBlockScrollService,
    private usersService: UsersService,
    private store: Store
  ) { }

  ngOnInit() {
    this.loadUserData();
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.windowModeBlockScrollService.register(this.layout);
    }
  }

  private async loadUserData() {
    const id = this.store.userId;
    this.user = await this.usersService.getUserById(id);
  }
}

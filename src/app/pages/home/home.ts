import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Page } from '../../shared/layout/page/page';

@Component({
  selector: 'app-home',
  imports: [Page, TranslatePipe],
  templateUrl: './home.html',
})
export class Home {}

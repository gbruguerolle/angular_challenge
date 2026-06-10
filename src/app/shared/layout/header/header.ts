import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { APP_ROUTES } from '../../../app.paths';
import { ToPathPipe } from '../../utils/to-path.pipe';

@Component({
  selector: 'app-header',
  host: { class: 'app-header' },
  imports: [RouterLink, RouterLinkActive, ToPathPipe],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  readonly routes = APP_ROUTES;
}

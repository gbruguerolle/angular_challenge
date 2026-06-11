import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { APP_ROUTES } from '../../../app.paths';
import { ToPathPipe } from '../../utils/to-path.pipe';

@Component({
  selector: 'app-header',
  host: { class: 'app-header' },
  imports: [RouterLink, RouterLinkActive, ToPathPipe, TranslatePipe],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  readonly routes = APP_ROUTES;

  private readonly translate = inject(TranslateService);

  readonly languages = ['fr', 'en'];
  readonly currentLang = this.translate.currentLang;

  setLang(lang: string): void {
    this.translate.use(lang);
  }
}

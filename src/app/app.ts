import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Header } from './shared/layout/header/header';
import { Footer } from './shared/layout/footer/footer';
import { Loader } from './shared/layout/loader/loader';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, Loader],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  constructor() {
    inject(TranslateService).use('fr');
  }
}

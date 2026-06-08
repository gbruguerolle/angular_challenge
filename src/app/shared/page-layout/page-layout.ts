import { Component, input } from '@angular/core';

@Component({
  selector: 'app-page-layout',
  templateUrl: './page-layout.html',
  styleUrl: './page-layout.scss',
})
export class PageLayout {
  title = input.required<string>();
  hasBreadcrumb = input<boolean>(false);
}

import { Component, input } from '@angular/core';

@Component({
  selector: 'app-page',
  templateUrl: './page.html',
  styleUrl: './page.scss',
})
export class Page {
  title = input.required<string>();
  hasBreadcrumb = input<boolean>(false);
}

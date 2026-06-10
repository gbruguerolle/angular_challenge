import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  host: { class: 'app-footer' },
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  currentYear = new Date().getFullYear();
}

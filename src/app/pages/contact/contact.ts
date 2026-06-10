import { Component } from '@angular/core';
import { Page } from '../../shared/layout/page/page';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-contact',
  imports: [Page, RouterLink],
  templateUrl: './contact.html',
})
export class Contact {}

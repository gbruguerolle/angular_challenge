import { Component } from '@angular/core';
import { PageLayout } from '../../shared/layout/page/page';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-contact',
  imports: [PageLayout, RouterLink],
  templateUrl: './contact.html',
})
export class Contact {}

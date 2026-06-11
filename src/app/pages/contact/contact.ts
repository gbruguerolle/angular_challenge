import { Component, signal } from '@angular/core';
import { email, form, required } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Page } from '../../shared/layout/page/page';
import { ContactModel } from '../../models/contact';
import { InputComponent } from '../../shared/form/input/input.component';

@Component({
  selector: 'app-contact',
  imports: [Page, RouterLink, InputComponent, TranslatePipe],
  templateUrl: './contact.html',
})
export class Contact {

  contactModel = signal<ContactModel>({
    email: '',
    title: '',
    message: '',
  });
  
  contactForm = form(this.contactModel, (schemaPath) => {
    required(schemaPath.email, {message: 'Email is required'});
    email(schemaPath.email, {message: 'Enter a valid email address'});
    required(schemaPath.title, {message: 'Title is required'});
    required(schemaPath.message, {message: 'Message is required'});
  });

  onSubmit(event: Event) {
    event.preventDefault();
    // Perform contact form submission logic here
    const contactData = this.contactModel();
    console.log('Submitting contact form with:', contactData);
    // e.g., await this.contactService.submit(contactData);
  }
}

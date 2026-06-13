import { Component, Signal, signal } from '@angular/core';
import { email, form, required } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { TranslatePipe, translate } from '@ngx-translate/core';
import { Page } from '../../shared/layout/page/page';
import { ContactModel } from '../../models/contact';
import { InputComponent } from '../../shared/form/input/input.component';

@Component({
  selector: 'app-contact',
  imports: [Page, RouterLink, InputComponent, TranslatePipe],
  templateUrl: './contact.html',
})
export class Contact {

  isSubmitted = signal(false);

  contactModel = signal<ContactModel>({
    email: '',
    title: '',
    message: '',
  });

  contactForm = form(this.contactModel, (schemaPath) => {
    const requiredMsg = translate('FORM.ERROR.REQUIRED') as Signal<string>;
    const emailMsg    = translate('FORM.ERROR.EMAIL') as Signal<string>;

    required(schemaPath.email,   { message: () => requiredMsg() });
    email(schemaPath.email,      { message: () => emailMsg() });
    required(schemaPath.title,   { message: () => requiredMsg() });
    required(schemaPath.message, { message: () => requiredMsg() });
  });

  readonly fields = {
    email: {
      field: this.contactForm.email,
      controlName: 'email',
      inputType: 'email' as const,
      label: translate('CONTACT.FORM.EMAIL.LABEL') as Signal<string>,
      placeholder: translate('CONTACT.FORM.EMAIL.PLACEHOLDER') as Signal<string>,
    },
    title: {
      field: this.contactForm.title,
      controlName: 'title',
      inputType: 'text' as const,
      label: translate('CONTACT.FORM.TITLE.LABEL') as Signal<string>,
      placeholder: translate('CONTACT.FORM.TITLE.PLACEHOLDER') as Signal<string>,
    },
    message: {
      field: this.contactForm.message,
      controlName: 'message',
      inputType: 'textarea' as const,
      label: translate('CONTACT.FORM.MESSAGE.LABEL') as Signal<string>,
      placeholder: translate('CONTACT.FORM.MESSAGE.PLACEHOLDER') as Signal<string>,
    },
  };

  onSubmit(event: Event) {
    event.preventDefault();
    this.isSubmitted.set(true);

    if (!this.contactForm().valid()) return;

    const contactData = this.contactModel();
    console.log('Submitting contact form with:', contactData);
    this.isSubmitted.set(false);
  }
}

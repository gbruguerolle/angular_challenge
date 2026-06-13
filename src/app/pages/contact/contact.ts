import { Component, Signal, signal } from '@angular/core';
import { email, form, minLength, required } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { TranslatePipe, translate } from '@ngx-translate/core';
import { Page } from '../../shared/layout/page/page';
import { ContactModel } from '../../models/contact';
import { FormComponent } from '../../shared/form/form/form.component';
import { FormFieldConfig } from '../../shared/form/form.types';

@Component({
  selector: 'app-contact',
  imports: [Page, RouterLink, FormComponent, TranslatePipe],
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
    const minMsg      = translate('FORM.ERROR.MINLENGTH', { min: 10 }) as Signal<string>;

    required(schemaPath.email,   { message: () => requiredMsg() });
    email(schemaPath.email,      { message: () => emailMsg() });
    required(schemaPath.title,   { message: () => requiredMsg() });
    minLength(schemaPath.title, 10, { message: () => minMsg() });
    required(schemaPath.message, { message: () => requiredMsg() });
    minLength(schemaPath.message, 10, { message: () => minMsg() });
  });

  readonly fields: FormFieldConfig[] = [
    {
      field: this.contactForm.email,
      controlName: 'email',
      inputType: 'email',
      label: translate('CONTACT.FORM.EMAIL.LABEL') as Signal<string>,
      placeholder: translate('CONTACT.FORM.EMAIL.PLACEHOLDER') as Signal<string>,
    },
    {
      field: this.contactForm.title,
      controlName: 'title',
      inputType: 'text',
      label: translate('CONTACT.FORM.TITLE.LABEL') as Signal<string>,
      placeholder: translate('CONTACT.FORM.TITLE.PLACEHOLDER') as Signal<string>,
    },
    {
      field: this.contactForm.message,
      controlName: 'message',
      inputType: 'textarea',
      label: translate('CONTACT.FORM.MESSAGE.LABEL') as Signal<string>,
      placeholder: translate('CONTACT.FORM.MESSAGE.PLACEHOLDER') as Signal<string>,
    },
  ];

  onSubmit() {
    this.isSubmitted.set(true);

    if (!this.contactForm().valid()) return;

    const contactData = this.contactModel();
    console.log('Submitting contact form with:', contactData);
    this.isSubmitted.set(false);
  }
}

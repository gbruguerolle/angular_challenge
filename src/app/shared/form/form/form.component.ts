import { Component, input, output } from '@angular/core';
import { InputComponent } from '../input/input.component';
import { FormFieldConfig } from '../form.types';

@Component({
  selector: 'app-form',
  imports: [InputComponent],
  templateUrl: './form.component.html',
})
export class FormComponent {

  /** Ordered list of fields to render. */
  fields = input.required<FormFieldConfig[]>();
  /** Forwarded to every input so errors show after a submit attempt. */
  isSubmitted = input<boolean>(false);
  /** Text of the submit button. */
  submitLabel = input<string>('');

  /** Emitted on submit — the native default action is already prevented. */
  submitted = output<void>();

  onSubmit(event: Event): void {
    event.preventDefault();
    this.submitted.emit();
  }
}

import { Component, input, inject, computed } from '@angular/core';
import { FormGroupDirective, ReactiveFormsModule } from '@angular/forms';

import { isFieldDisabled, isFieldRequired, shouldShowError } from '../utils/form-validation-utils';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
})
export class InputComponent {
    private readonly formGroupDirective = inject(FormGroupDirective);

    // Inputs
    controlName = input.required<string>();
    inputType = input<'text' | 'number' | 'email' | 'password' | 'tel' | 'date' | 'textarea' | 'radio' | 'select' | 'multiSelect' | 'custom'>('text');
    customInput = computed(() => this.inputType() === 'custom');
    label = input.required<string>();
    placeholder = input<string>();
    isSubmitted = input<boolean>(false);

    // Inputs for date type - optional, only used when inputType is 'date'
    dateFormat = input<string>('dd/mm/yy');
    dateMin = input<Date | null>(null);
    dateMax = input<Date | null>(null);
    dateShowTime = input<boolean>(false);
    dateHourFormat = input<string>('24');

    // Input for textarea type - optional, only used when inputType is 'textarea'
    textareaRows = input<number>(3);

    // Inputs for number type - optional, only used when inputType is 'number'
    numberMode = input<'decimal' | 'currency'>('decimal');
    numberCurrency = input<string>('EUR');
    numberLocale = input<string>('fr-FR');
    numberMinFractionDigits = input<number>(0);
    numberMaxFractionDigits = input<number>(2);

    // Inputs for radio/select/multiSelect types - required when inputType is 'radio' or 'select' or 'multiSelect'
    options = input<any[]>([]);
    optionLabel = input<string>('name');
    optionValue = input<string>(); // Optional: specify which field to store (if not provided, stores whole object)
    enableFilter = input<boolean>(false); // Optional: enable/disable filter for select (default: false)
    selectFilterPlaceholder = input<string>('Rechercher...'); // Optional: placeholder for select filter input
    
    // Generate unique ID for label-input association
    inputId = computed(() => this.controlName());
    
    // Get the form group from the parent FormGroupDirective
    formGroup = computed(() => this.formGroupDirective.form);
    
    get form() {
        return this.formGroupDirective.form;
    }

    get inputValue() {
        return this.form.get(this.controlName())?.value;
    }

    // Gets error message for a specific form field
    getErrorMessage(): string {
        return "TODO: implement error messages";
        //return this.formErrorHandler.getErrorMessage(this.form, this.controlName());
    }

    // Helper to check if a control should show error
    shouldShowError(): boolean {
        return shouldShowError(this.form, this.controlName(), this.isSubmitted());
    }

    // Checks if a control is required based on its validators
    isFieldRequired(): boolean {
        return isFieldRequired(this.form, this.controlName());
    }

    // Checks if a control is required based on its validators
    isFieldDisabled(): boolean {
        if (this.form.disabled)
            return true;

        return isFieldDisabled(this.form, this.controlName());
    }

    toDateString(date: Date | null): string | null {
        if (!date) return null;
        return date.toISOString().split('T')[0];
    }
}
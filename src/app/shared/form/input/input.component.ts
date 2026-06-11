import { Component, input, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Field, FieldTree, FormField } from '@angular/forms/signals';
import { TranslateService } from '@ngx-translate/core';

type ScalarOrArray<T> = T | T[];

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [FormField],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
})
export class InputComponent<T> {

    // Inputs
    field = input.required<FieldTree<ScalarOrArray<T>>>();

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

    private readonly translate = inject(TranslateService);

    private readonly ERROR_KEYS: Record<string, string> = {
        required:   'FORM.ERROR.REQUIRED',
        email:      'FORM.ERROR.EMAIL',
        minlength:  'FORM.ERROR.MINLENGTH',
        maxlength:  'FORM.ERROR.MAXLENGTH',
        min:        'FORM.ERROR.MIN',
        max:        'FORM.ERROR.MAX',
        pattern:    'FORM.ERROR.PATTERN',
    };

    get fieldAsAny(): Field<any> {
        return this.field() as unknown as Field<any>;
    }
    fieldState = computed(() => this.field()());
    isArray    = computed(() => Array.isArray(this.fieldState().value()));
    arrayValue = computed(() => this.fieldState().value() as T[]);

    // Helper to check if a control should show error
    shouldShowError(): boolean {
        return this.fieldState().errors() && this.fieldState().touched() || this.isSubmitted();
    }

    // Gets error message for a specific form field
    getErrorMessage(): string {
        const errors = this.fieldState().errors();
        if (!errors || !Array.isArray(errors) || errors.length === 0) return '';

        return errors
            .map(e => this.translate.instant(this.ERROR_KEYS[e.kind] ?? e.kind) ?? e.message ?? e.kind)
            .join(', ');
    }

    // Checks if a control is required based on its validators
    isFieldRequired(): boolean {
        return this.fieldState().required() || false;
    }

    // Checks if a control is required based on its validators
    isFieldDisabled(): boolean {
        return this.fieldState().disabled() || false;
    }

    toDateString(date: Date | null): string | null {
        if (!date) return null;
        return date.toISOString().split('T')[0];
    }
}

import { Component, input, computed } from '@angular/core';
import { Field, FieldTree, FormField } from '@angular/forms/signals';
import { TranslatePipe } from '@ngx-translate/core';

type ScalarOrArray<T> = T | T[];

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [FormField, TranslatePipe],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
})
export class InputComponent<T> {

    field        = input.required<FieldTree<ScalarOrArray<T>>>();
    controlName  = input.required<string>();
    inputType    = input<'text' | 'number' | 'email' | 'password' | 'tel' | 'date' | 'textarea' | 'radio' | 'select' | 'multiSelect' | 'custom'>('text');
    label        = input.required<string>();
    placeholder  = input<string>();
    isSubmitted  = input<boolean>(false);

    // date
    dateMin      = input<Date | null>(null);
    dateMax      = input<Date | null>(null);
    dateShowTime = input<boolean>(false);

    // textarea
    textareaRows = input<number>(3);

    // number
    numberMode              = input<'decimal' | 'currency'>('decimal');
    numberCurrency          = input<string>('EUR');
    numberLocale            = input<string>('fr-FR');
    numberMinFractionDigits = input<number>(0);
    numberMaxFractionDigits = input<number>(2);

    // radio / select / multiSelect
    options      = input<Record<string, unknown>[]>([]);
    optionLabel  = input<string>('name');
    optionValue  = input<string>();
    enableFilter = input<boolean>(false);

    // internal computed properties
    fieldAsAny      = computed(() => this.field() as unknown as Field<any>);
    fieldState      = computed(() => this.field()());
    isArray         = computed(() => Array.isArray(this.fieldState().value()));
    arrayValue      = computed(() => this.fieldState().value() as T[]);
    isFieldRequired = computed(() => this.fieldState().required());
    isFieldDisabled = computed(() => this.fieldState().disabled());
    shouldShowError = computed(() => {
        const errors = this.fieldState().errors();
        return errors.length > 0 && (this.fieldState().touched() || this.isSubmitted());
    });
    errorMessage = computed(() => {
        const errors = this.fieldState().errors();
        if (errors.length === 0) return '';
        return errors.map(e => e.message ?? e.kind).join(', ');
    });

    toDateString = (date: Date | null): string | null =>
        date ? date.toISOString().split('T')[0] : null;
}

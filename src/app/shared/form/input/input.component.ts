import { Component, input, computed } from '@angular/core';
import { Field, FormField } from '@angular/forms/signals';
import { TranslatePipe } from '@ngx-translate/core';
import { FormFieldConfig } from '../form.types';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [FormField, TranslatePipe],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
})
export class InputComponent {

    /** Full declarative definition of the field to render. */
    config      = input.required<FormFieldConfig>();
    /** Set after a submit attempt so errors show even on untouched fields. */
    isSubmitted = input<boolean>(false);

    // config accessors (with the same defaults the inputs used to carry)
    controlName  = computed(() => this.config().controlName);
    inputType    = computed(() => this.config().inputType ?? 'text');
    label        = computed(() => this.config().label());
    placeholder  = computed(() => this.config().placeholder?.() ?? '');
    dateMin      = computed(() => this.config().dateMin ?? null);
    dateMax      = computed(() => this.config().dateMax ?? null);
    dateShowTime = computed(() => this.config().dateShowTime ?? false);
    textareaRows = computed(() => this.config().textareaRows ?? 3);
    options      = computed(() => this.config().options ?? []);
    optionLabel  = computed(() => this.config().optionLabel ?? 'name');
    optionValue  = computed(() => this.config().optionValue);

    // field state derived from the config
    fieldAsAny      = computed(() => this.config().field as unknown as Field<any>);
    fieldState      = computed(() => this.config().field());
    isArray         = computed(() => Array.isArray(this.fieldState().value()));
    arrayValue      = computed(() => this.fieldState().value() as unknown[]);
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

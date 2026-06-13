import { Signal } from '@angular/core';
import { FieldTree } from '@angular/forms/signals';

/** All input variants `app-input` is able to render. */
export type InputType =
  | 'text'
  | 'number'
  | 'email'
  | 'password'
  | 'tel'
  | 'date'
  | 'textarea'
  | 'radio'
  | 'select'
  | 'multiSelect'
  | 'custom';

/** A field value that is either a scalar or an array of scalars. */
export type ScalarOrArray<T> = T | T[];

/**
 * Declarative definition of a single form field, consumed by `app-form`.
 *
 * Labels and placeholders are signals (typically produced by `translate(...)`)
 * so they stay reactive to language changes.
 */
export interface FormFieldConfig {
  /** The signal-forms field tree node bound to this input. */
  field: FieldTree<unknown>;
  /** Unique control name — also used as the DOM id and `@for` track key. */
  controlName: string;
  /** Reactive label, e.g. `translate('CONTACT.FORM.EMAIL.LABEL')`. */
  label: Signal<string>;
  /** Which input variant to render. Defaults to `'text'`. */
  inputType?: InputType;
  /** Reactive placeholder. */
  placeholder?: Signal<string>;

  // date
  dateMin?: Date | null;
  dateMax?: Date | null;
  dateShowTime?: boolean;

  // textarea
  textareaRows?: number;

  // number
  numberMode?: 'decimal' | 'currency';
  numberCurrency?: string;
  numberLocale?: string;
  numberMinFractionDigits?: number;
  numberMaxFractionDigits?: number;

  // radio / select / multiSelect
  options?: Record<string, unknown>[];
  optionLabel?: string;
  optionValue?: string;
  enableFilter?: boolean;
}

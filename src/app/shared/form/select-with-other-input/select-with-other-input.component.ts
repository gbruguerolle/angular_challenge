import { Component, inject, input, DestroyRef, OnInit, computed } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlContainer, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Tag } from 'primeng/tag';

import { InputComponent } from '../input/input.component';
import { UserStore } from '../../../stores/user/user.store';
import { UserProfileType } from '../../../models/enums/user-profile.enum';
import { TranslationService } from '../../../core/services/translation.service';

export interface SelectOption {
  id: number;
  [key: string]: any; // Allow additional properties
}

@Component({
  selector: 'app-select-with-other-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent, Tag],
  templateUrl: './select-with-other-input.component.html',
  styleUrl: './select-with-other-input.component.scss',
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})
export class SelectWithOtherInputComponent implements OnInit {
  protected readonly userStore = inject(UserStore);
  private readonly formGroupDirective = inject(FormGroupDirective);
  private readonly destroyRef = inject(DestroyRef);
  private readonly translation = inject(TranslationService);

  protected readonly UserProfileType = UserProfileType;
  
  // Inputs
  controlName = input<string>('selectField');
  inputType = input<'select' | 'multiSelect'>('multiSelect');
  label = input<string>();
  placeholder = input<string>();
  options = input<SelectOption[]>([]);
  optionLabel = input<string>('name');
  selectFilterPlaceholderInput = input<string>('', { alias: 'selectFilterPlaceholder' });
  isSubmitted = input<boolean>(false);
  
  // Inputs for "Other" option
  otherOptionInput = input<SelectOption | null>(null, { alias: 'otherOption' });

  // Inputs for "Other" text input
  otherControlName = input<string>('otherField');
  otherInputLabelInput = input<string>('', { alias: 'otherInputLabel' });
  otherInputPlaceholderInput = input<string>('', { alias: 'otherInputPlaceholder' });
  otherInputResolveLabelInput = input<string>('', { alias: 'otherInputResolveLabel' });
  otherInputResolveCallback = input<() => void | Promise<void>>(() => this.resolveOtherInput());

  // Computed signals with translation defaults
  selectFilterPlaceholder = computed(() => this.selectFilterPlaceholderInput() || this.translation.translate('app.common.search'));
  otherOption = computed(() => this.otherOptionInput() || { id: -1, name: this.translation.translate('app.common.other') });
  otherInputLabel = computed(() => this.otherInputLabelInput() || this.translation.translate('app.common.other'));
  otherInputPlaceholder = computed(() => this.otherInputPlaceholderInput() || this.translation.translate('selectWithOther.placeholder.other'));
  otherInputResolveLabel = computed(() => this.otherInputResolveLabelInput() || this.translation.translate('app.button.resolve'));

  // State
  displayOtherInput = false;
  mergedOptions: SelectOption[] = [];

  get form(): FormGroup {
    return this.formGroupDirective.form;
  }

  ngOnInit(): void {
    this.setupMergedOptions();
    this.checkAndSetOtherOnLoad();
    this.setupValueChangeListener();
  }

  /**
   * Check if otherControlName has initial value and auto-select OTHER option
   */
  private checkAndSetOtherOnLoad(): void {
    const otherControl = this.form.get(this.otherControlName());
    const mainControl = this.form.get(this.controlName());

    // for multiSelect, we check if otherControl has a value and if mainControl doesn't already include OTHER, we add it
    if (otherControl && otherControl.value) {
      if (this.inputType() === 'multiSelect') {
        const currentValue = mainControl?.value || [];
        if (!currentValue.includes(this.otherOption())) {
          const newValue = Array.isArray(currentValue) 
            ? [this.otherOption(), ...currentValue]
            : [this.otherOption()];
          mainControl?.setValue(newValue, { emitEvent: false });
        }
      }
      // for select, if otherControl has a value and mainControl is not already OTHER, we set it to OTHER
      else if (this.inputType() === 'select') {
        if (mainControl?.value !== this.otherOption()) {
          mainControl?.setValue(this.otherOption(), { emitEvent: false });
        }
      }
    }
  }

  /**
   * Merge "Other" option with provided options
   */
  private setupMergedOptions(): void {
    this.mergedOptions = [this.otherOption(), ...this.options()];
  }

  /**
   * Listen to select control changes to show/hide "Other" input
   */
  private setupValueChangeListener(): void {
    const control = this.form.get(this.controlName());

    if (control) {
      control.valueChanges
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((value) => {
          this.handleValueChange(value);
        });

      // Check initial value
      this.handleValueChange(control.value);
    }
  }

  /**
   * Handle select value change
   */
  private handleValueChange(value: any): void {    
    const isOtherSelected = this.inputType() === 'multiSelect'
      ? Array.isArray(value) && value.includes(this.otherOption())
      : value === this.otherOption();

    this.displayOtherInput = isOtherSelected;

    // Setup/cleanup other input validator
    const otherControl = this.form.get(this.otherControlName());
    if (otherControl) {
      if (isOtherSelected) {
        otherControl.setValidators([Validators.required]);
      } else {
        otherControl.clearValidators();
        otherControl.setValue('', { emitEvent: false }); // Clear value when OTHER is deselected
      }
      otherControl.updateValueAndValidity({ emitEvent: false });
    }
  }

  resolveOtherInput(): void {
    const callback = this.otherInputResolveCallback();
    if (callback) {
      callback();
    }
  }
}

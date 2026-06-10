import { Component, inject, input, output, OnInit, DestroyRef, computed } from '@angular/core';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AddressService } from '../../../services/address.service';
import { FormErrorHandlerService } from '../../../services/form-error-handler.service';
import { isFieldRequired, shouldShowError } from '../../../utils/form-validation-utils';
import { ReferentialStore } from '../../../stores/referential/referential.store';
import { DepartmentFilter } from '../../../models/filter.model';
import { InputComponent } from '../input/input.component';
import { TranslationService } from '../../../core/services/translation.service';

export interface AddressSuggestion {
  properties: {
    name: string;
    postcode: string;
    city: string;
    label: string;
    department: string;
  };
}

@Component({
  selector: 'app-address-input',
  standalone: true,
  imports: [ReactiveFormsModule, InputComponent],
  templateUrl: './address-input.component.html',
  styleUrl: './address-input.component.scss',
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})
export class AddressInputComponent implements OnInit {
  private readonly addressService = inject(AddressService);
  private readonly formErrorHandler = inject(FormErrorHandlerService);
  private readonly referentialStore = inject(ReferentialStore);
  private readonly formGroupDirective = inject(FormGroupDirective);
  private readonly destroyRef = inject(DestroyRef);
  private readonly translation = inject(TranslationService);
  
  private readonly DEBOUNCE_TIME = 300; // milliseconds

  // Inputs for customization
  addressControlName = input<string>('address');
  addressLabelInput = input<string>('', { alias: 'addressLabel' });
  addressPlaceholderInput = input<string>('', { alias: 'addressPlaceholder' });

  complementControlName = input<string>('complement');
  complementLabelInput = input<string>('', { alias: 'complementLabel' });
  complementPlaceholderInput = input<string>('', { alias: 'complementPlaceholder' });

  postalCodeControlName = input<string>('postalCode');
  postalCodeLabelInput = input<string>('', { alias: 'postalCodeLabel' });
  postalCodePlaceholderInput = input<string>('', { alias: 'postalCodePlaceholder' });

  cityControlName = input<string>('city');
  cityLabelInput = input<string>('', { alias: 'cityLabel' });
  cityPlaceholderInput = input<string>('', { alias: 'cityPlaceholder' });

  departmentControlName = input<string>('department');
  departmentLabelInput = input<string>('', { alias: 'departmentLabel' });
  departmentPlaceholderInput = input<string>('', { alias: 'departmentPlaceholder' });
  departmentSelectFilterPlaceholderInput = input<string>('', { alias: 'departmentSelectFilterPlaceholder' });

  isSubmitted = input<boolean>(false);

  // Computed signals with translation defaults
  addressLabel = computed(() => this.addressLabelInput() || this.translation.translate('address.input.label.address'));
  addressPlaceholder = computed(() => this.addressPlaceholderInput() || this.translation.translate('address.input.placeholder.address'));
  complementLabel = computed(() => this.complementLabelInput() || this.translation.translate('address.input.label.complement'));
  complementPlaceholder = computed(() => this.complementPlaceholderInput() || this.translation.translate('address.input.placeholder.complement'));
  postalCodeLabel = computed(() => this.postalCodeLabelInput() || this.translation.translate('address.input.label.postalCode'));
  postalCodePlaceholder = computed(() => this.postalCodePlaceholderInput() || this.translation.translate('address.input.placeholder.postalCode'));
  cityLabel = computed(() => this.cityLabelInput() || this.translation.translate('address.input.label.city'));
  cityPlaceholder = computed(() => this.cityPlaceholderInput() || this.translation.translate('address.input.placeholder.city'));
  departmentLabel = computed(() => this.departmentLabelInput() || this.translation.translate('address.input.label.department'));
  departmentPlaceholder = computed(() => this.departmentPlaceholderInput() || this.translation.translate('address.input.placeholder.department'));
  departmentSelectFilterPlaceholder = computed(() => this.departmentSelectFilterPlaceholderInput() || this.translation.translate('address.input.placeholder.departmentFilter'));

  // Output to notify parent of suggestion selection (for department matching)
  suggestionSelected = output<AddressSuggestion>();

  // Internal state
  suggestions: AddressSuggestion[] = [];

  ngOnInit(): void {
    this.setupAddressInputDebounce();
  }

  /**
   * Setup debounced address search using form control value changes
   * Debounces API calls to reduce network traffic and improve performance
   */
  private setupAddressInputDebounce(): void {
    const addressControl = this.form.get(this.addressControlName());
    
    if (addressControl) {
      addressControl.valueChanges
        .pipe(
          debounceTime(this.DEBOUNCE_TIME),
          distinctUntilChanged(),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe((value) => {
          this.performAddressSearch(value);
        });
    }
  }

  /**
   * Performs the actual address search
   */
  private performAddressSearch(input: string): void {
    const trimmedInput = input?.trim() || '';
    
    if (trimmedInput.length < 3) {
      this.suggestions = [];
      return;
    }

    this.addressService.searchAddress(trimmedInput).subscribe({
      next: (response) => {
        this.suggestions =
          response?.features?.map((feature: any) => ({
            properties: {
              name: feature.properties.name,
              postcode: feature.properties.postcode,
              city: feature.properties.city,
              label: feature.properties.label,
              department: feature.properties.context,
            },
          })) || [];
      },
      error: (err) => {
        console.error(this.translation.translate('address.input.error.suggestions'), err);
        this.suggestions = [];
      },
    });
  }

  get form() {
    return this.formGroupDirective.form;
  }

  get departments(): DepartmentFilter[] {
    return this.referentialStore.departments();
  }



  /**
   * User selects an address suggestion, we populate the form fields accordingly and try to match the department from the context string. 
   */
  selectSuggestion(suggestion: AddressSuggestion): void {
    const addressControl = this.form.get(this.addressControlName());
    const postalCodeControl = this.form.get(this.postalCodeControlName());
    const cityControl = this.form.get(this.cityControlName());
    const departmentControl = this.form.get(this.departmentControlName());

    if (addressControl) {
      addressControl.setValue(suggestion.properties.name);
      addressControl.markAsTouched();
    }
    if (postalCodeControl) {
      postalCodeControl.setValue(suggestion.properties.postcode);
      postalCodeControl.markAsTouched();
    }
    if (cityControl) {
      cityControl.setValue(suggestion.properties.city);
      cityControl.markAsTouched();
    }

    // Extract department code from context string (e.g., "69, Rhône, Auvergne-Rhône-Alpes")
    const departmentContext = suggestion.properties.department;
    const departmentCode = this.extractDepartmentCode(departmentContext);

    if (departmentCode && departmentControl) {
      // Find matching department in the list
      const matchingDepartment = this.departments.find(
        dept => dept.number === departmentCode
      );

      if (matchingDepartment) {
        departmentControl.setValue(matchingDepartment);
        departmentControl.markAsTouched();
      }
    }

    this.suggestions = [];
    this.suggestionSelected.emit(suggestion);
  }

  // Extracts department code from address context string
  private extractDepartmentCode(context: string): string | null {
    if (!context) return null;
    const match = context.match(/^(\d{2,3}),/);
    return match ? match[1] : null;
  }

  // Gets error message for a specific form field
  getErrorMessage(controlName: string): string {
    return this.formErrorHandler.getErrorMessage(this.form, controlName);
  }

  // Helper to check if a control should show error
  shouldShowError(controlName: string): boolean {
    return shouldShowError(this.form, controlName, this.isSubmitted());
  }

  // Checks if a control is required based on its validators
  isFieldRequired(controlName: string): boolean {
    return isFieldRequired(this.form, controlName);
  }

  /**
   * Update debounce time if needed
   * @param ms Debounce time in milliseconds
   */
  setDebounceTime(ms: number): void {
    (this as any).DEBOUNCE_TIME = ms;
  }

}

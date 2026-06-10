import { Component, inject, input, computed } from '@angular/core';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';

import { Button } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';

import { resizeImage } from '../../../utils/image-utils';
import { isFieldRequired } from '../../../utils/form-validation-utils';
import { DialogMessage } from '../../dialog/dialog-message/dialog-message';
import { TranslationService } from '../../../core/services/translation.service';

@Component({
  selector: 'app-picture-input',
  standalone: true,
  imports: [ReactiveFormsModule, Button],
  templateUrl: './picture-input.component.html',
  styleUrl: './picture-input.component.scss',
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})
export class PictureInputComponent {
  private readonly dialogService = inject(DialogService);
  private readonly formGroupDirective = inject(FormGroupDirective);
  private readonly translation = inject(TranslationService);

  // Inputs for customization
  pictureControlName = input<string>('profilePictureBase64');
  pictureContentTypeControlName = input<string>('profilePictureContentType');

  pictureLabelInput = input<string>('', { alias: 'pictureLabel' });
  picturePlaceholderInput = input<string>('', { alias: 'picturePlaceholder' });
  pictureSelectButtonLabelInput = input<string>('', { alias: 'pictureSelectButtonLabel' });
  allowedFormatsLabelInput = input<string>('', { alias: 'allowedFormatsLabel' });
  noPictureLabelInput = input<string>('', { alias: 'noPictureLabel' });
  
  allowedFormats = input<string[]>(['image/jpeg', 'image/jpg', 'image/png', 'image/webp']);
  maxSizeMB = input<number>(5);

  isEditable = input<boolean>(true);
  isSubmitted = input<boolean>(false);

  // Computed signals with translation defaults
  pictureLabel = computed(() => this.pictureLabelInput() || this.translation.translate('picture.input.label'));
  picturePlaceholder = computed(() => this.picturePlaceholderInput() || this.translation.translate('picture.input.placeholder'));
  pictureSelectButtonLabel = computed(() => this.pictureSelectButtonLabelInput() || this.translation.translate('picture.input.selectButton'));
  allowedFormatsLabel = computed(() => this.allowedFormatsLabelInput() || this.translation.translate('picture.input.allowedFormats'));
  noPictureLabel = computed(() => this.noPictureLabelInput() || this.translation.translate('picture.input.noPicture'));

  // Internal state
  selectedPicture: File | null = null;
  
  get form() {
    return this.formGroupDirective.form;
  }

  get allowedFormatsAttribute(): string {
    return this.allowedFormats().join(',');
  }

  get allowedFormatsDisplay(): string {
    const formats = this.allowedFormats().map(format => {
      const extension = format.split('/')[1].toUpperCase();
      return extension === 'JPG' ? 'JPEG' : extension;
    });
    return [...new Set(formats)].join(', ');
  }

  get picturePreview(): string | null {
    const picture = this.form.get(this.pictureControlName())?.value;
    const contentType = this.form.get(this.pictureContentTypeControlName())?.value;
    
    if (picture && contentType) {
      return `data:${contentType};base64,${picture}`;
    }
    
    return null;
  }

  /**
   * Handles profile picture file selection and converts to base64
   */
  onPictureSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    
    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];
    
    // Validate file type
    if (!this.allowedFormats().includes(file.type)) {
      this.dialogService.open(DialogMessage, {
        header: this.translation.translate('picture.input.error.format.header'),
        data: {
            message: this.translation.translateWithParams('picture.input.error.format.message', { formats: this.allowedFormatsDisplay }),
            type: 'info',
        },
      });
      return;
    }

    // Validate file size
    const maxSizeInBytes = this.maxSizeMB() * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      this.dialogService.open(DialogMessage, {
        header: this.translation.translate('picture.input.error.size.header'),
        data: {
            message: this.translation.translateWithParams('picture.input.error.size.message', { maxSize: this.maxSizeMB() }),
            type: 'info',
        },
      });
      return;
    }

    this.selectedPicture = file;

    // Resize and compress image before converting to base64
    resizeImage(file, 800, 800, 1).then((resizedBase64) => {
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64Data = resizedBase64.split(',')[1];
      
      // Update form controls
      const pictureControl = this.form.get(this.pictureControlName());
      const contentTypeControl = this.form.get(this.pictureContentTypeControlName());
      
      if (pictureControl) {
        pictureControl.setValue(base64Data);
        pictureControl.markAsTouched();
      }
      if (contentTypeControl) {
        contentTypeControl.setValue(file.type);
        contentTypeControl.markAsTouched();
      }

      // Set preview
      //this.picturePreview.set(resizedBase64);
    }).catch((error) => {
      this.dialogService.open(DialogMessage, {
        header: this.translation.translate('picture.input.error.processing.header'),
        data: {
            message: this.translation.translate('picture.input.error.processing.message'),
            type: 'error',
        },
      });
      console.error('Image resize error:', error);
    });
  }

  /**
   * Removes selected profile picture
   */
  removeProfilePicture(): void {
    this.selectedPicture = null;
    
    const pictureControl = this.form.get(this.pictureControlName());
    const contentTypeControl = this.form.get(this.pictureContentTypeControlName());
    
    if (pictureControl) {
      pictureControl.setValue('');
      pictureControl.markAsTouched();
    }
    if (contentTypeControl) {
      contentTypeControl.setValue('');
      contentTypeControl.markAsTouched();
    }
  }

  // Checks if a control is required based on its validators
  isFieldRequired(controlName: string): boolean {
    return isFieldRequired(this.form, controlName);
  }
}
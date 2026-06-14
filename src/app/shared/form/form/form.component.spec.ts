import { TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { form, required } from '@angular/forms/signals';
import { provideTranslateService } from '@ngx-translate/core';
import { FormComponent } from './form.component';
import { FormFieldConfig } from '../form.types';

// ── Host component ───────────────────────────────────────────────────────────

@Component({
  template: `
    <app-form
      [fields]="fields"
      [isSubmitted]="submitted"
      [submitLabel]="submitLabel"
      (submitted)="onSubmit()"
    />
  `,
  imports: [FormComponent],
})
class Host {
  readonly model = signal({ email: '', title: '' });
  readonly f = form(this.model, (s) => required(s.email, { message: 'Email requis' }));

  submitted = false;
  submitLabel = 'Envoyer';
  submitCount = 0;

  fields: FormFieldConfig[] = [
    { field: this.f.email, controlName: 'email', label: signal('Email'), inputType: 'email' },
    { field: this.f.title, controlName: 'title', label: signal('Titre') },
  ];

  onSubmit(): void {
    this.submitCount++;
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function create() {
  const fixture = TestBed.createComponent(Host);
  fixture.detectChanges();
  return fixture;
}

// ── Tests ──────────────────────────────────────────────────────────────────

describe('FormComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideTranslateService()],
    });
  });

  afterEach(() => TestBed.resetTestingModule());

  // ── Rendering ───────────────────────────────────────────────────────────────

  describe('rendering', () => {
    it('renders one app-input per field config', () => {
      const fixture = create();
      expect(fixture.nativeElement.querySelectorAll('app-input').length).toBe(2);
    });

    it('renders the submit button with the provided label', () => {
      const fixture = create();
      const button = fixture.nativeElement.querySelector('button[type="submit"]') as HTMLButtonElement;
      expect(button.textContent?.trim()).toBe('Envoyer');
    });

    it('renders the fields in order', () => {
      const fixture = create();
      const ids = [...fixture.nativeElement.querySelectorAll('app-input [id]')].map(
        (el) => (el as HTMLElement).id,
      );
      expect(ids).toEqual(['email', 'title']);
    });
  });

  // ── Submission ────────────────────────────────────────────────────────────

  describe('submission', () => {
    it('emits submitted when the form is submitted', () => {
      const fixture = create();
      fixture.nativeElement
        .querySelector('form')
        .dispatchEvent(new Event('submit', { cancelable: true }));
      expect(fixture.componentInstance.submitCount).toBe(1);
    });

    it('prevents the native form submit default action', () => {
      const fixture = create();
      const event = new Event('submit', { cancelable: true });
      fixture.nativeElement.querySelector('form').dispatchEvent(event);
      expect(event.defaultPrevented).toBe(true);
    });
  });

  // ── isSubmitted forwarding ──────────────────────────────────────────────────

  describe('isSubmitted forwarding', () => {
    it('hides field errors before submit', () => {
      const fixture = create();
      expect(fixture.nativeElement.querySelector('.form-error')).toBeNull();
    });

    it('shows field errors once isSubmitted is true', () => {
      const fixture = create();
      fixture.componentInstance.submitted = true;
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.text-error')?.textContent?.trim()).toBe(
        'Email requis',
      );
    });
  });
});

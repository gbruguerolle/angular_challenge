import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component, signal } from '@angular/core';
import { form, required } from '@angular/forms/signals';
import { provideTranslateService } from '@ngx-translate/core';
import { InputComponent } from './input.component';

// ── Host components ────────────────────────────────────────────────────────

@Component({
  template: `
    <app-input
      [field]="f.name"
      controlName="name"
      [label]="label"
      [placeholder]="placeholder"
      [isSubmitted]="submitted"
    />
  `,
  imports: [InputComponent],
})
class TextHost {
  readonly model = signal({ name: '' });
  readonly f = form(this.model, (s) => required(s.name, { message: 'Champ requis' }));
  label = 'Nom';
  placeholder = 'Entrez un nom';
  submitted = false;
}

@Component({
  template: `<app-input [field]="f.msg" controlName="msg" label="Message" inputType="textarea" />`,
  imports: [InputComponent],
})
class TextareaHost {
  readonly model = signal({ msg: '' });
  readonly f = form(this.model, () => {});
}

@Component({
  template: `
    <app-input
      [field]="f.choice"
      controlName="choice"
      label="Choix"
      inputType="select"
      [options]="options"
      optionValue="id"
      optionLabel="label"
    />
  `,
  imports: [InputComponent],
})
class SelectHost {
  readonly model = signal({ choice: '' });
  readonly f = form(this.model, () => {});
  options = [{ id: '1', label: 'Un' }, { id: '2', label: 'Deux' }];
}

@Component({
  template: `<app-input [field]="f.name" controlName="name" inputType="email" label="Email" />`,
  imports: [InputComponent],
})
class EmailHost {
  readonly model = signal({ name: '' });
  readonly f = form(this.model, () => {});
}

// ── Helpers ────────────────────────────────────────────────────────────────

function inputComp<T>(fixture: ReturnType<typeof TestBed.createComponent<any>>) {
  return fixture.debugElement.query(By.directive(InputComponent)).componentInstance as InputComponent<T>;
}

// ── Tests ──────────────────────────────────────────────────────────────────

describe('InputComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideTranslateService()],
    });
  });

  afterEach(() => TestBed.resetTestingModule());

  // ── toDateString ──────────────────────────────────────────────────────────

  describe('toDateString', () => {
    it('formats a Date to YYYY-MM-DD', () => {
      const fixture = TestBed.createComponent(TextHost);
      fixture.detectChanges();
      expect(inputComp(fixture).toDateString(new Date('2024-06-13T00:00:00Z'))).toBe('2024-06-13');
    });

    it('returns null for null', () => {
      const fixture = TestBed.createComponent(TextHost);
      fixture.detectChanges();
      expect(inputComp(fixture).toDateString(null)).toBeNull();
    });
  });

  // ── Label ─────────────────────────────────────────────────────────────────

  describe('label', () => {
    it('renders the label text', () => {
      const fixture = TestBed.createComponent(TextHost);
      fixture.detectChanges();
      const label = fixture.nativeElement.querySelector('label') as HTMLLabelElement;
      expect(label.textContent?.trim()).toContain('Nom');
    });

    it('shows * when field is required', () => {
      const fixture = TestBed.createComponent(TextHost);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('label span')?.textContent?.trim()).toBe('*');
    });

    it('does not show * when field is not required', () => {
      const fixture = TestBed.createComponent(TextareaHost);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('label span')).toBeNull();
    });
  });

  // ── Input type rendering ──────────────────────────────────────────────────

  describe('input type rendering', () => {
    it('renders a text input by default', () => {
      const fixture = TestBed.createComponent(TextHost);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('input[type="text"]')).not.toBeNull();
    });

    it('renders an email input for inputType="email"', () => {
      const fixture = TestBed.createComponent(EmailHost);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('input[type="email"]')).not.toBeNull();
    });

    it('renders a textarea for inputType="textarea"', () => {
      const fixture = TestBed.createComponent(TextareaHost);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('textarea')).not.toBeNull();
    });

    it('renders a select for inputType="select"', () => {
      const fixture = TestBed.createComponent(SelectHost);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('select')).not.toBeNull();
    });

    it('renders placeholder option + all options in select', () => {
      const fixture = TestBed.createComponent(SelectHost);
      fixture.detectChanges();
      // 1 placeholder + 2 data options
      expect(fixture.nativeElement.querySelectorAll('option').length).toBe(3);
    });

    it('sets placeholder attribute on text input', () => {
      const fixture = TestBed.createComponent(TextHost);
      fixture.detectChanges();
      const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
      expect(input.placeholder).toBe('Entrez un nom');
    });
  });

  // ── Error display ─────────────────────────────────────────────────────────

  describe('error display', () => {
    it('hides errors initially', () => {
      const fixture = TestBed.createComponent(TextHost);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.form-error')).toBeNull();
    });

    it('hides errors when field has errors but is not touched and not submitted', () => {
      const fixture = TestBed.createComponent(TextHost);
      fixture.detectChanges();
      expect(inputComp(fixture).shouldShowError()).toBe(false);
    });

    it('shows error when isSubmitted=true and field is invalid', () => {
      const fixture = TestBed.createComponent(TextHost);
      fixture.componentInstance.submitted = true;
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.form-error')).not.toBeNull();
    });

    it('displays the validator message', () => {
      const fixture = TestBed.createComponent(TextHost);
      fixture.componentInstance.submitted = true;
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.text-error')?.textContent?.trim()).toBe('Champ requis');
    });

    it('shows error after blur on invalid field', () => {
      const fixture = TestBed.createComponent(TextHost);
      fixture.detectChanges();
      fixture.nativeElement.querySelector('input').dispatchEvent(new Event('blur'));
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.form-error')).not.toBeNull();
    });

    it('hides error when field becomes valid', () => {
      const fixture = TestBed.createComponent(TextHost);
      fixture.componentInstance.submitted = true;
      fixture.detectChanges();
      fixture.componentInstance.model.update((m) => ({ ...m, name: 'valid' }));
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.form-error')).toBeNull();
    });

    it('falls back to error kind when message is absent', () => {
      @Component({
        template: `<app-input [field]="f.val" controlName="val" label="Val" [isSubmitted]="true" />`,
        imports: [InputComponent],
      })
      class NoMessageHost {
        readonly model = signal({ val: '' });
        readonly f = form(this.model, (s) => required(s.val));
      }

      const fixture = TestBed.createComponent(NoMessageHost);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.text-error')?.textContent?.trim()).toBe('required');
    });
  });
});

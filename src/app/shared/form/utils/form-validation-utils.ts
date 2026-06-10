import { FormGroup } from "@angular/forms";

export function shouldShowError(
  form: FormGroup, 
  controlName: string, 
  isSubmitted: boolean
): boolean {
  const control = form.get(controlName);
  if (!control) return false;
  return control.invalid && (isSubmitted || control.touched || control.dirty);
}

export function isFieldRequired(form: FormGroup, controlName: string): boolean {
  const control = form.get(controlName);
  if (!control) return false;
  
  const validator = control.validator;
  if (!validator) return false;
  
  const validation = validator({} as any);
  return validation?.['required'] === true;
}

export function isFieldDisabled(form: FormGroup, controlName: string): boolean {
  const control = form.get(controlName);
  if (!control) return false;
  
  return control.disabled;
}
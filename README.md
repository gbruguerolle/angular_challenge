# AngularChallenge

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.0.0.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

The project uses [Vitest](https://vitest.dev/) via two separate configurations:

| Config file | Used by | Purpose |
|---|---|---|
| `vitest-base.config.ts` | `ng test` (Angular CLI) | Angular's own build pipeline — transforms decorators, templates, initializes TestBed automatically |
| `vitest.config.ts` | VS Code Vitest extension | Uses `@analogjs/vite-plugin-angular` to replicate the same Angular compilation outside the CLI |

### Terminal

```bash
ng test
```

Runs once and exits. Add `--watch` to re-run on file changes.

### VS Code Vitest extension

Install the [Vitest extension](https://marketplace.visualstudio.com/items?itemName=vitest.explorer) (`vitest.explorer`). It auto-detects `vitest.config.ts` and shows all tests in the Test Explorer panel.

> **Note:** the extension cannot run Angular tests without a dedicated Vite plugin — that is why `vitest.config.ts` with `@analogjs/vite-plugin-angular` exists alongside `vitest-base.config.ts`. The two configs are independent and do not interfere.

### Writing tests

Tests live next to their source files (`*.spec.ts`). Use Angular's `TestBed` with a host component pattern:

```typescript
@Component({
  template: `<app-input [field]="f.name" controlName="name" label="Name" />`,
  imports: [InputComponent],
})
class HostComponent {
  model = signal({ name: '' });
  f = form(this.model, (s) => required(s.name, { message: 'Required' }));
}

describe('InputComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideTranslateService()] });
  });

  it('shows error when submitted', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.form-error')).toBeNull();
  });
});
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

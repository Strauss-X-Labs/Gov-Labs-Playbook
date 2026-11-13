# @igds/core-web

This library was generated with [Nx](https://nx.dev).

General package which contains all web components of IGDS.

## Coding conventions (Code Style Guides)

### 1. **Package Structure & Organization**
   - Organize components in a logical directory structure:
     ```
     src/
        button/
           button.ts
           button.scss
           index.ts
       utils/
       mixins/
     ```
   - **File Naming**: Use **kebab-case** for file names to align with web standards:
     - `index.ts`: Exports component.
     - `component-name.ts`: The main component file.
     - `component-name.scss`: Style file.

### 2. **Component Naming Conventions**
   - **Custom Element Naming**: Follow the HTML custom element naming convention:
     - Use **kebab-case** for component selectors, with a namespace like `igds-`.
     ```typescript
     import {IGDS_TAGS} from '../constants';
     customElements.define(IGDS_TAGS.button, Button);
     ```
   - **Class Naming**: Use **PascalCase** for the class name of the web component:
     ```typescript
     export class Button extends LitElement { ... }
     ```

### 3. **LitElement Component Structure**
   - **Define Your Component**: Always extend `LitElement` to create your component.
     ```typescript
     import {LitElement, html, PropertyValues, unsafeCSS} from 'lit';

     export class Button extends LitElement {
       static override styles = unsafeCSS(styles);

       render() {
         return html`<button><slot></slot></button>`;
       }
     }
     ```
   - **Template Binding**: Use Lit’s `html` tagged template literal for rendering:
     ```typescript
     render() {
       return html`
         <button @click=${this.handleClick}>${this.label}</button>
       `;
     }
     ```

### 4. **Styles**
   - **SCSS**: Do not use the template string styles inside the web component or approach CSS-in-JS. Write styles in a separate SCSS files so that you can navigate, scale and check/lint them easier. After the build, the styles will be embedded inside the web component.
   - **CSS Variables**: Use design tokens for styling, which are provided by the `@igds/tokens` package. Use CSS variables for theming and customization across components:
     ```css
     :host {
       --component-color: var(--igds-base-color-text-primary);
     }

     .part {
        color: var(--component-color);
     }
     ```
   - **BEM**: For creation style classes use BEM (Block - Element - Modificator) approach:
     ```html
     <button class="button">
       Normal button
     </button>
     <button class="button button--success">
       Success button
     </button>
     <button class="button button--danger">
       Danger button
     </button>
     ```

     ```scss
     .button {
        display: inline-block;
        border-radius: var(--igds-ref-border-radius-m);
        padding:
          var(--igds-ref-space-400)
          var(--igds-ref-space-500);

        &--success {
          color: var(--igds-base-color-text-success);
        }

        &--danger {
          color: var(--igds-base-color-text-warning);
        }
     }
     ```

### 5. **Properties and Attributes**
   - Use `@property` decorator for declaring reactive properties:
     ```typescript
     import { property } from 'lit/decorators.js';

     export class Button extends LitElement {
       @property({ type: String }) label = 'Button';
     }
     ```
   - **Attribute Reflection**: Ensure that properties are reflected as attributes when needed by specifying the `reflect: true` option:
     ```typescript
     @property({ type: String, reflect: true }) label = 'Submit';
     ```

### 6. **Events and Event Handling**
   - **Event Handlers**: Bind event handlers directly in the template using Lit's `@event` syntax:
     ```typescript
     <button @click=${this.handleClick}>Click Me</button>
     ```
   - **Custom Events**: Use `dispatchEvent` to emit custom events:
     ```typescript
     handleClick() {
       this.dispatchEvent(new CustomEvent('button-click', { detail: { clicked: true } }));
     }
     ```
   - **Event Naming**: Use **kebab-case** for custom events:
     ```typescript
     <igds-button @button-click=${this.handleClick}></igds-button>
     ```

### 7. **Slots and Composition**
   - Use slots for content projection and composition:
     ```typescript
     render() {
       return html`
         <button>
           <slot></slot>
         </button>
       `;
     }
     ```
   - Name your slots when you expect multiple slots:
     ```typescript
     render() {
       return html`
         <div class="icon">
           <slot name="icon"></slot>
         </div>
         <div class="content">
           <slot></slot>
         </div>
       `;
     }
     ```

### 8. **Lifecycle Methods**
   - Leverage `LitElement` lifecycle methods (`connectedCallback`, `updated`, etc.) for reacting to property changes and DOM interactions.
     ```typescript
     connectedCallback() {
       super.connectedCallback();
       // Add additional setup logic here
     }
     ```
   - **Performing Updates**: Use `shouldUpdate` method to prevent unnecessary renders:
     ```typescript
     shouldUpdate(changedProperties) {
       return changedProperties.has('label');
     }
     ```

### 9. **Accessibility (A11y)**
   - **ARIA Attributes**: Ensure your components are accessible by using proper ARIA attributes:
     ```typescript
     render() {
       return html`
         <button aria-label=${this.label}><slot></slot></button>
       `;
     }
     ```
   - **Keyboard Navigation**: Implement keyboard focus management and accessibility for user interactions.
   - **Focus Management**: Use `tabindex`, `focus()`, and other attributes to make your components keyboard-navigable.

### 10. **Testing**
   - Use **web-test-runner** and **@open-wc/testing** for writing unit tests:
     ```typescript
     import { fixture, html } from '@open-wc/testing';

     it('renders the button with label', async () => {
       const el = await fixture(html`<igds-button label="Click me"></igds-button>`);
       expect(el.label).to.equal('Click me');
     });
     ```
   - Test lifecycle methods, rendering, and custom event dispatching in your tests.

### 11. **Performance Optimization**
   - **Use `@static` decorators** for performance optimization in large-scale applications when defining static templates:
     ```typescript
     static render = html`<div>...</div>`;
     ```
   - Use `requestUpdate` sparingly, and only when necessary, to trigger updates outside the regular property-driven flow.


### 12. **How to work with a project icon library.**
  - **Important note**: Starting from version **0.1.29**, icons have been moved to a separate package `@igds/icons`.
  - **Prepare icon svg-file** icon should be a square, it should have viewBox attribute as here `viewBox="0 0 24 24"`. All figures in SVG should be filled not stroked. Remove all necessary fill attributes. Pay attention to the svg-file name it will also be the icon name.
  - **Place svg-file** to the icon folder `icons\svg`
  - **Update icon library**- run `pnpm build`in the icons project folder.

> Deleted svg-files will be removed from the icon library when project data is updated.

### Summary of Best Practices
- **Naming**: Use `kebab-case` for component names and `PascalCase` for class names.
- **Properties**: Declare properties with `@property` and reflect attributes when needed.
- **Styling**: Use scoped CSS and CSS variables for maintainability and theming.
- **Events**: Handle native and custom events properly, using kebab-case for event names.
- **Accessibility**: Ensure that components are accessible, with proper ARIA roles and keyboard navigation.
- **Testing**: Write comprehensive tests to cover component functionality and behavior.


## Usage without a bundler (classic `<script>` tag)

If you don't use a build tool (webpack/vite/etc), you can include the prebuilt bundle directly from `node_modules`.

```html
<!-- Design tokens (CSS variables) -->
<link rel="stylesheet" href="./node_modules/@igds/tokens/lib/index.min.css" />

<!-- Registers all IGDS web components -->
<script src="./node_modules/@igds/core-web/lib/index.min.js"></script>
```

After that, all custom elements (e.g. `<igds-button>`, `<igds-modal>`, etc.) are available on the page.

Optionally, the bundle exposes exports on `window.IGDSCoreWeb` (useful for debugging).

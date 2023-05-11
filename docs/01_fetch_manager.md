# Fetch Manager

This component will enable the fetch functionality and validation state for invalid fields.

- [Enable Component](./01_fetch_manager.md#enable-component)
- [Element Transformer](./01_fetch_manager.md#element-transformer)
- [Extended Usage](./01_fetch_manager.md#extended-usage)
- [Endpoints](./01_fetch_manager.md#endpoints)

## Enable Component

```js
import {FetchManager} from 'js-pimcore-formbuilder';
```

```js
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.formbuilder.ajax-form').forEach((form) => {
        new FetchManager(form);
    });
});
```

## Element Transformer

### Predefined Element Transformers

Depending on the form template, predefined Element Transformers are used automatically.

- Tailwind 2
- Bootstrap 4
- Bootstrap 3

### Custom Element Transformers

Use the elementTransformer option to customize the validations. Use this option when a custom form template is set.

```js
new FetchManager(form, {
    elementTransformer: {
        addValidationMessage: (form, field, messages) => {
            form.classList.add('error-form');
            field.classList.add('error-field');
            messages.forEach((message) => {
                let errorEl = document.createElement('div');
                errorEl.className = 'error-message';
                errorEl.innerText = message;
                field.after(errorEl);
            });
        },
        removeFormValidations: (form) => {
            form.classList.remove('error-form');
            form.querySelectorAll('.error-field').forEach((el) => el.classList.remove('error-field'))
            form.querySelectorAll('.error-message').forEach((el) => el.remove());
        }
    }
});
```

## Extended Usage

```js
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.formbuilder.ajax-form').forEach((form) => {
        new FetchManager(form, {
            // avaiable options
            submitBtnSelector: 'button[type="submit"]',
            resetFormMethod: (form) => {
                // set a custom reset function if form has been submitted. Default: null
                console.log(form);
            },
            onRequestDone: (response, form) => {
                console.log(response, form);
            },
            onFail: (response, form) => {
                console.log(response, form);
            },
            onFatalError: (response, form) => {
                console.log(response, form);
            },
            onErrorField: (fieldError, form) => {
                console.log(fieldError.field, fieldError.messages, form);
            },
            onGeneralError: (generalErrorMessages, form) => {
                console.log(generalErrorMessages, form);
            },
            onSuccess: (messages, redirect, form) => {
                console.log(messages, redirect, form);
            },
            elementTransformer: {
                addValidationMessage: (form, field, messages) => {
                    console.log(field, messages);
                },
                removeFormValidations: (form) => {
                    console.log(form);
                }
            }
        });
    });
});
```

## Endpoints

To prevent multiple identical requests for the endpoints, create an endpoint instance and set the result to the Fetch Manager.

```js
import {Endpoints, FetchManager} from 'js-pimcore-formbuilder';

let formBuilderForms = document.querySelectorAll('.formbuilder.ajax-form');

if (formBuilderForms.length) {
    new Endpoints().getEndpoints(formBuilderForms[0].dataset.ajaxStructureUrl)
        .then((endpoints) => {
            formBuilderForms.forEach((formBuilderForm) => {
                new FetchManager(formBuilderForm, {}, endpoints);
            });
        }).catch((error) => {
        console.error('formbuilder error: fetching file structure', error);
    });
}
```

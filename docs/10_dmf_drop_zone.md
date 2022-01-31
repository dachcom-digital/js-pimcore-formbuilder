# Dynamic Multi File | DropZone

![image](https://user-images.githubusercontent.com/700119/119269406-daf90080-bbf7-11eb-9059-01485bf2edf7.png)

- Resource: https://www.dropzonejs.com
- Handler: `{DropzoneHandler}`
- Library: [Dropzone](https://www.npmjs.com/package/dropzone)

***

## Implementation

```bash
npm i dropzone
```

### CSS

Include CSS. E.g. `@import "dropzone/dist/dropzone.css";`

## Enable Handler

```js
import {DropzoneHandler} from 'js-pimcore-formbuilder';
```

```js
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.formbuilder.ajax-form').forEach((form) => {
        new DropzoneHandler(form);
    });
});
```

## Extended Usage

```js
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.formbuilder.ajax-form').forEach((form) => {
        new DropzoneHandler(form, {
            dropzoneOptions: {
                // add some dropzone library options 
            },
        });
    });
});
```

```js
import {Endpoints, DropzoneHandler} from 'js-pimcore-formbuilder';

let formBuilderForms = document.querySelectorAll('.formbuilder.ajax-form');

if (formBuilderForms.length) {
    new Endpoints().getEndpoints(formBuilderForms[0].dataset.ajaxStructureUrl)
        .then((endpoints) => {
            formBuilderForms.forEach((formBuilderForm) => {
                new DropzoneHandler(form, {
                    dropzoneOptions: {
                        // add some dropzone library options 
                    }
                    // set enpoints to prevent multiple identical requests
                }, endpoints);
            });
        }).catch((error) => {
        console.error('formbuilder error: fetching file structure', error);
    });
}
```

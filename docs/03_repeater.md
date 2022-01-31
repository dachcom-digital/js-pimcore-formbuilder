# Repeater Component
This component will enable the repeater functionality.

## Enable Component
```js
import {Repeater} from 'js-pimcore-formbuilder';
```

```js
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.formbuilder.ajax-form').forEach((form) => {
        new Repeater(form);
    });
});
```

## Extended Usage
```js

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.formbuilder.ajax-form').forEach((form) => {
        
        new Repeater(form, {
            addClass: 'btn btn-info',
            removeClass: 'btn btn-danger',
            containerClass: '.formbuilder-container.formbuilder-container-repeater',
            containerBlockClass: '.formbuilder-container-block',
            onRemove: (container, cb) => {
                container.remove();
                cb(); // always trigger the callback action!
            },
            onAdd: (container, newForm, cb) => {
                container.appendChild(newBlock);
                cb(newForm); // always trigger the callback action!
            },
            renderCreateBlockElement: (classes, text) => {
                let element = document.createElement('button');
                element.className = classes;
                element.textContent = text;
                return element;
            },
            allocateCreateBlockElement: (container, element) => {
                container.appendChild(element);
            },
            renderRemoveBlockElement: (block, classes, text) => {
                let element = document.createElement('button');
                element.className = classes;
                element.textContent = text;
                return element;
            },
            allocateRemoveBlockElement: (block, element) => {
                block.appendChild(element);
            }
            
        });
    });
});
```

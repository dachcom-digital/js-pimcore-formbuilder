# Conditional Logic Component

This component will enable the conditional logic functionality.

## Enable Extension

```js
import {ConditionalLogic} from 'js-pimcore-formbuilder';
```

```js
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.formbuilder.ajax-form').forEach((form) => {
        new ConditionalLogic(form);
    });
});
```

### Extended Usage

```js
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.formbuilder.ajax-form').forEach((form) => {
        new ConditionalLogic(form, {
            conditions: {},
            actions: {
                toggleElement: {
                    onEnable: function (action, actionId, ev, el) {
                        console.log(action, ev, el);
                    }
                }
            },
            elementTransformer: {
                hide: function (el) {
                    el.classList.add('hidden');
                }
            },
            hideElementClass: 'fb-cl-hide-element'
        });
    });
});
```

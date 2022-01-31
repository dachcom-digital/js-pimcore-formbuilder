# Tracker Component
This component will enable the tracker functionality. 
If enabled, this extension tries to submit insensible data like dropdown selection, checked radios/boxes to google analytics or matomo.

> **Configuration:**: You need to listen to the `form_builder_submission` event in your tag manager!

## Enable Component
```js
import {Tracker} from 'js-pimcore-formbuilder';
```

```js
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.formbuilder.ajax-form').forEach((form) => {
        new Tracker(form);
    });
});
```

## Extended Usage
```js
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.formbuilder.ajax-form').forEach((form) => {
        new Tracker(form, {
            onBeforeSubmitDataToProvider: (data, formName, $form) => {
                // add some special value to data
                // warning: in some cases, no data will be submitted (gtag, ga)
                return data;
            },
            provider: 'google', // choose between "google" or "matomo"
            trackDropDownSelection: true,
            trackCheckboxSelection: true,
            trackRadioSelection: true,
            trackHiddenInputs: true,
            invalidFieldNames: ['_token', 'formCl', 'formRuntimeData', 'formRuntimeDataToken'],
        });
    });
});
```

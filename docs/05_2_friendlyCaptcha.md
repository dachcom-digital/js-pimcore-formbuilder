# Friendly Captcha Component

This component will enable Friendly Captcha functionality on your form.

## Back-End Configuration
First, you need to set up some server side configuration via form builder. Read more about it [here](https://github.com/dachcom-digital/pimcore-formbuilder/blob/master/docs/03_SpamProtection.md#friendly-captcha). 

## Enable Component
```js
import {FriendlyCaptcha} from 'js-pimcore-formbuilder';
```

```js
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.formbuilder.ajax-form').forEach((form) => {
        new FriendlyCaptcha(form);
    });
});
```

## Default Options

```js
{
    useAutoWidget: true,
    autoWidgetVersionToLoad: null, // change to explict version you want to load from cdn: e.g. 0.9.16, null means latest
    setupField: null,
    friendlyCaptchaFieldClass: 'div.form-builder-friendly-captcha'
}

```
## Extended Usage
```js
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.formbuilder.ajax-form').forEach((form) => {
        new FriendlyCaptcha(form, {
            useAutoWidget: false, // disable it to use your own implementation (see next option "setupField")
            setupField: function (element, options) {

                const friendlyCaptionOptions = {
                    doneCallback: function (solution) {
                        console.log("CAPTCHA completed successfully, solution:", solution);
                    },
                    sitekey: options.sitekey,
                }

                const widget = new WidgetInstance(element, friendlyCaptionOptions);

                widget.start();

                formBuilderForm.addEventListener('formbuilder.success', () => widget.reset());
                formBuilderForm.addEventListener('formbuilder.error', () => widget.reset());
            }
        });
    });
});
```

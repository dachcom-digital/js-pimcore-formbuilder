# Cloudflare Turnstile Component

This component will enable Friendly Captcha functionality on your form.

## Back-End Configuration
First, you need to set up some server side configuration via form builder. Read more about it [here](https://github.com/dachcom-digital/pimcore-formbuilder/blob/master/docs/03_SpamProtection.md#friendly-captcha). 

## Enable Component
```js
import {CloudflareTurnstile} from 'js-pimcore-formbuilder';
```

```js
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.formbuilder.ajax-form').forEach((form) => {
        new CloudflareTurnstile(form);
    });
});
```

## Default Options

```js
{
    useAutoWidget: true,
    setupField: null,
    cloudflareTurnstileFieldClass: 'div.form-builder-cloudflare-turnstile',
}

```
## Extended Usage
```js
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.formbuilder.ajax-form').forEach((form) => {
        new CloudflareTurnstile(form, {
            useAutoWidget: false, // disable it to use your own implementation (see next option "setupField")
            setupField: function (element, form, options) {

                let setupDispatched = false;

                const setupTurnstile = function () {

                    let widgetId;
                    
                    // make sure, setup only gets called once!
                    if (setupDispatched === true) {
                        return;
                    }

                    setupDispatched = true;

                    widgetId = turnstile.render(element, {
                        sitekey: options.sitekey,
                        callback: function (token) {
                            console.log(`Challenge Success ${token}`);
                        },
                    });

                    formBuilderForm.addEventListener('formbuilder.success', () => turnstile.reset(widgetId));
                    formBuilderForm.addEventListener('formbuilder.error', () => turnstile.reset(widgetId));
                }

                // load the script with explicit flag
                // getScript: see js-pimcore-formbuilder/src/js/utils/helper.js
                getScript(`https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit`, false)
                    .then(() => {
                        turnstile?.ready(() => setupTurnstile());
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }
        });
    });
});
```

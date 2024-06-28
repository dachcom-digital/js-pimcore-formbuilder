# reCAPTCHA V3 Component

This component will enable reCAPTCHA v3 functionality on your form. Workflow: 
- Loads `https://www.google.com/recaptcha/api.js` if not available
- Adds token to captcha field on your form

## Back-End Configuration
First, you need to set up some server side configuration via form builder. Read more about it [here](https://github.com/dachcom-digital/pimcore-formbuilder/blob/master/docs/03_SpamProtection.md#recaptcha-v3). 

## Enable Component
```js
import {RecaptchaV3} from 'js-pimcore-formbuilder';
```

```js
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.formbuilder.ajax-form').forEach((form) => {
        new RecaptchaV3(form);
    });
});
```

## Extended Usage
```js
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.formbuilder.ajax-form').forEach((form) => {
        new RecaptchaV3(form, {
            disableFormWhileLoading: true,
            reCaptchaFieldClass: 'input.re-captcha-v3',
        });
    });
});
```

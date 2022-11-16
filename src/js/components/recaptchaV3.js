import {EVENTS, RECAPTCHA_V3_DEFAULTS} from '../constants/defaults';
import {getScript, isNode} from '../utils/helpers';

export default class RecaptchaV3 {
    siteKey = null;
    token = null;
    reCaptchaField = null;

    constructor(form, options = {}) {
        this.options = Object.assign(RECAPTCHA_V3_DEFAULTS, options);
        this.form = form;

        this.init();
    }

    init() {
        this.reCaptchaField = this.form.querySelector(this.options.reCaptchaFieldClass);

        if (!isNode(this.reCaptchaField)) {
            return;
        }

        this.disableFormSubmission();

        document.body.classList.add('form-builder-rec3-available');

        this.siteKey = this.reCaptchaField.dataset.siteKey;
        this.action = this.reCaptchaField.dataset.actionName;

        this.form.addEventListener(EVENTS.success, () => this.onReset());
        this.form.addEventListener(EVENTS.error, () => this.onReset());

        this.bindDependency();
    }

    bindDependency() {
        if (typeof window.grecaptcha !== 'undefined') {
            grecaptcha.ready(() => this.injectTokenToForm());
            return;
        }

        getScript(`https://www.google.com/recaptcha/api.js?render=${this.siteKey}`)
            .then(() => {
                grecaptcha.ready(() => this.injectTokenToForm());
            })
            .catch(() => {
                console.error('formbuilder error: unable to load recaptcha script');
            });
    }

    onReset() {
        if (this.token === null) {
            return;
        }

        if (!window.grecaptcha) {
            return;
        }

        if (!this.reCaptchaField) {
            return;
        }

        this.disableFormSubmission();
        this.injectTokenToForm();
    }

    injectTokenToForm() {
        try {
            grecaptcha.execute(this.siteKey, {action: this.action})
                .then((token) => this.onTokenGenerated(token));
        } catch (error) {
            this.form.dispatchEvent(new CustomEvent(EVENTS.fatalCaptcha));
        }
    }

    onTokenGenerated(tokenGoogleRecaptchaV3) {
        this.token = tokenGoogleRecaptchaV3;
        this.reCaptchaField.value = tokenGoogleRecaptchaV3;

        this.enableFormSubmission();
    }

    disableFormSubmission() {
        if (this.options.disableFormWhileLoading !== true) {
            return;
        }

        this.form.querySelector('[type="submit"]').setAttribute('disabled', 'disabled');
    }

    enableFormSubmission() {
        if (this.options.disableFormWhileLoading !== true) {
            return;
        }

        this.form.querySelector('[type="submit"]').removeAttribute('disabled');
    }

}

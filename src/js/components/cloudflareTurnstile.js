import {CLOUDFLARE_TURNSTILE_DEFAULTS, EVENTS} from '../constants/defaults';
import {getScript, isNode} from '../utils/helpers';

export default class CloudflareTurnstile {

    cloudflareTurnstileField = null;

    siteKey = null;
    lang = null;
    theme = null;
    appearance = null;

    constructor(form, options = {}) {
        this.options = Object.assign(CLOUDFLARE_TURNSTILE_DEFAULTS, options);
        this.form = form;

        this.init();
    }

    init() {

        this.cloudflareTurnstileField = this.form.querySelector(this.options.cloudflareTurnstileFieldClass);

        if (!isNode(this.cloudflareTurnstileField)) {
            return;
        }

        this.siteKey = this.cloudflareTurnstileField.dataset.sitekey;
        this.lang = this.cloudflareTurnstileField.dataset.lang;
        this.theme = this.cloudflareTurnstileField.dataset.theme;
        this.appearance = this.cloudflareTurnstileField.dataset.appearance;

        this.form.addEventListener(EVENTS.success, () => this.onReset());
        this.form.addEventListener(EVENTS.error, () => this.onReset());

        this.bindDependency();
    }

    bindDependency() {

        let widgetUrl = 'https://challenges.cloudflare.com/turnstile/v0/api.js';

        if (this.options.useAutoWidget === false) {

            if (typeof this.options.setupField === 'function') {
                this.options.setupField(this.cloudflareTurnstileField, this.form, {
                    sitekey: this.siteKey,
                    lang: this.lang,
                    theme: this.theme,
                    appearance: this.appearance,
                });
            }

            return;
        }

        if (typeof window.turnstile !== 'undefined') {
            return;
        }

        getScript(widgetUrl)
            .catch((e) => {
                console.error('formbuilder error: unable to load cloudflare turnstile script', e);
            });
    }

    onReset() {

        if (this.options.useAutoWidget === false) {
            return;
        }

        if (!window.turnstile) {
            return;
        }

        if (!this.cloudflareTurnstileField) {
            return;
        }

        window.turnstile.reset();
    }
}

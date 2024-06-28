import {EVENTS, FRIENDLY_CAPTCHA_DEFAULTS} from '../constants/defaults';
import {getScript, isNode} from '../utils/helpers';

export default class FriendlyCaptcha {

    friendlyCaptchaField = null;

    siteKey = null;
    dataSolutionFieldName = null;
    start = null;
    lang = null;
    callback = null;
    puzzleEndpoint = null;

    constructor(form, options = {}) {
        this.options = Object.assign(FRIENDLY_CAPTCHA_DEFAULTS, options);
        this.form = form;

        this.init();
    }

    init() {

        this.friendlyCaptchaField = this.form.querySelector(this.options.friendlyCaptchaFieldClass);

        if (!isNode(this.friendlyCaptchaField)) {
            return;
        }

        this.siteKey = this.friendlyCaptchaField.dataset.sitekey;
        this.dataSolutionFieldName = this.friendlyCaptchaField.dataset.dataSolutionFieldName;
        this.start = this.friendlyCaptchaField.dataset.start;
        this.lang = this.friendlyCaptchaField.dataset.lang;
        this.callback = this.friendlyCaptchaField.dataset.callback;
        this.puzzleEndpoint = this.friendlyCaptchaField.dataset.puzzleEndpoint;

        this.form.addEventListener(EVENTS.success, () => this.onReset());
        this.form.addEventListener(EVENTS.error, () => this.onReset());

        this.bindDependency();
    }

    bindDependency() {

        let widgetUrl = 'https://cdn.jsdelivr.net/npm/friendly-challenge/widget.min.js';

        if (this.options.autoWidgetVersionToLoad !== null) {
            widgetUrl = `https://cdn.jsdelivr.net/npm/friendly-challenge@${this.options.autoWidgetVersionToLoad}/widget.min.js`;
        }

        if (this.options.useAutoWidget === false) {

            if (typeof this.options.setupField === 'function') {
                this.options.setupField(this.friendlyCaptchaField, this.form, {
                    sitekey: this.siteKey,
                    dataSolutionFieldName: this.dataSolutionFieldName,
                    start: this.start,
                    lang: this.lang,
                    callback: this.callback,
                    puzzleEndpoint: this.puzzleEndpoint,
                });
            }

            return;
        }

        if (typeof window.friendlyChallenge !== 'undefined') {
            return;
        }

        getScript(widgetUrl)
            .catch((e) => {
                console.error('formbuilder error: unable to load friendly captcha script', e);
            });
    }

    onReset() {

        if (this.options.useAutoWidget === false) {
            return;
        }

        if (!window.friendlyChallenge) {
            return;
        }

        if (!this.friendlyCaptchaField) {
            return;
        }

        window.friendlyChallenge.autoWidget.reset();
    }
}

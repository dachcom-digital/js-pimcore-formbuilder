import {EVENTS, FETCH_MANAGER_DEFAULTS} from '../constants/defaults';
import Endpoints from './endpoints';
import ElementTransformer from './elementTransformer';
import {TYPE_VALIDATION} from '../constants/elementTransformer';
import {isFunction, isObject} from '../utils/helpers';

export default class FetchManager {

    constructor(form, options = {}, endpoints = null) {
        this.form = form;
        this.options = Object.assign({}, FETCH_MANAGER_DEFAULTS, options);
        this.elementTransformer = new ElementTransformer(this.form, TYPE_VALIDATION, this.options.elementTransformer);

        this.endpoints = endpoints;

        if (!this.endpoints || !this.endpoints.hasOwnProperty('form_parser')) {
            this.setEndpoints(form);
        } else {
            this.loadForm(form);
        }

    }

    loadForm(form) {

        if (!this.endpoints['form_parser']) {
            console.error('formbuilder error: no form parse url', error);
            return;
        }

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            let form = e.target,
                submitBtn = form.querySelector(this.options.submitBtnSelector),
                method = form.getAttribute('method').toLowerCase(),
                formData = new FormData(form),
                url = this.endpoints['form_parser'];

            if (method !== 'post') {
                console.error('formbuilder error: fetchManager only works with post method. change it in admin interface.');
                return;
            }

            submitBtn.setAttribute('disabled', 'disabled');

            fetch(url, {
                method: method,
                headers: {'X-Requested-With': 'XMLHttpRequest'},
                body: formData,
            })
                .then(response => response.json())
                .then((data) => {
                    this.onRequestDone(form, data);

                    if (!data.success) {
                        this.onFail(form, data);
                        let validationErrors = data['validation_errors'];

                        if (isObject(validationErrors) && Object.keys(validationErrors).length) {
                            this.handleValidationErrors(form, validationErrors);
                        } else {
                            this.onFatalError(form, data);
                        }
                    } else {
                        this.onSuccess(form, data);

                        if (isFunction(this.options.resetFormMethod)) {
                            this.options.resetFormMethod(form);
                        } else {
                            form.reset();
                            // in case conditional logic is active.
                            form.querySelectorAll('input, textarea').forEach((e) => e.dispatchEvent(new Event('change')));
                        }
                    }
                })
                .finally(() => {
                    submitBtn.removeAttribute('disabled');
                });
        });
    }

    handleValidationErrors(form, validationErrors) {
        let generalErrorMessages = [];

        for (const [fieldId, messages] of Object.entries(validationErrors)) {

            if (fieldId === 'general') {
                generalErrorMessages.push(messages);
            } else {
                let field = form.querySelector('[id="' + fieldId + '"]');

                //fallback for radio / checkbox
                if (!field instanceof Element) {
                    field = form.querySelector('[id^="' + fieldId + '"]');
                }

                //fallback for custom fields (like ajax file, headline or snippet type)
                if (!field instanceof Element) {
                    field = form.querySelector('[data-field-id*="' + fieldId + '"]');
                }

                if (field instanceof Element) {
                    this.onErrorField(form, field, messages);
                }
            }

            if (generalErrorMessages.length > 0) {
                this.onGeneralError(form, generalErrorMessages);
            }

        }
    }

    setEndpoints(form) {
        let url = form.dataset.ajaxStructureUrl;

        new Endpoints().getEndpoints(url)
            .then((endpoints) => {
                this.endpoints = endpoints;
                this.loadForm(form);
            }).catch((error) => {
            console.error('formbuilder error: fetching file structure', error);
        });
    }

    onRequestDone(form, data) {
        this.options.onRequestDone(data);
        this.elementTransformer.transform('removeFormValidations', form);
        form.dispatchEvent(new CustomEvent(EVENTS.done));
    }

    onFail(form, data) {
        this.options.onFail(data);
        form.dispatchEvent(new CustomEvent(EVENTS.error));
    }

    onFatalError(form, data) {
        this.options.onFatalError(data);
        form.dispatchEvent(new CustomEvent(EVENTS.fatal));
    }

    onGeneralError(form, generalErrorMessages) {
        this.options.onGeneralError(generalErrorMessages);
        form.dispatchEvent(new CustomEvent(EVENTS.errorForm));
    }

    onErrorField(form, field, messages) {
        this.options.onErrorField({
            field: field,
            messages: messages,
        });
        this.elementTransformer.transform('addValidationMessage', form, field, messages);
        form.dispatchEvent(new CustomEvent(EVENTS.errorField));
    }

    onSuccess(form, data) {
        this.options.onSuccess(data.messages, data.redirect);
        form.dispatchEvent(new CustomEvent(EVENTS.success));
    }

}

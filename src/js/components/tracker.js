import { EVENTS, TRACKER_DEFAULTS } from '../constants/defaults';
import {isObject, isString, isFunction} from '../utils/helpers';

export default class Tracker {
    duplicateNameCounter = {};

    constructor(form, options = {}) {
        this.options = Object.assign(TRACKER_DEFAULTS, options);
        this.form = form;

        this.form.addEventListener(EVENTS.success, (ev) => this.onSubmission(ev));
    }

    onSubmission(ev) {
        this.duplicateNameCounter = {};

        let form = ev.target,
            formName = form.getAttribute('name'),
            data = {
                'event': 'form_builder_submission',
                'type': 'success',
                'form_name': formName,
                'values': this.findFormValues(form, formName),
            };

        if (isFunction(this.options.onBeforeSubmitDataToProvider)) {
            data = this.options.onBeforeSubmitDataToProvider(data, formName, form);
        }

        if (!isObject(data)) {
            console.error('formbuilder error: invalid data for tracker provider', data);
            return;
        }

        if (this.options.provider === 'google') {
            this.submitToGoogle(data);
        } else if (this.options.provider === 'matomo') {
            this.submitToMatomo(data);
        }
    }

    submitToGoogle(data) {
        if (typeof window.dataLayer === 'object') {
            window.dataLayer.push(data);
        } else if (typeof window.gtag === 'function') {
            gtag('event', data.event, {
                'event_category': data.type,
                'event_label': data.form_name,
            });
        } else if (typeof window.ga === 'function') {
            ga('send', 'event', data.event, data.type, data.form_name);
        }
    }

    submitToMatomo(data) {
        let stringValues = JSON.stringify(data.values);
        if (typeof window._mtm === 'object') {
            // first, try matomo tag manager
            _mtm.push(data);
        } else if (typeof window._paq === 'object') {
            // second, try matomo event dispatcher
            _paq.push(['trackEvent', data.event, data.type, data.form_name, stringValues]);
        }
    }

    findFormValues(form, formName) {
        let selector = [],
            fieldData = {},
            fields;

        if (this.options.trackDropDownSelection === true) {
            selector.push('select');
        }

        if (this.options.trackCheckboxSelection === true) {
            selector.push('input[type="checkbox"]:checked');
        }

        if (this.options.trackRadioSelection === true) {
            selector.push('input[type="radio"]:checked');
        }

        if (this.options.trackHiddenInputs === true) {
            selector.push('input[type="hidden"]');
        }

        fields = form.querySelectorAll(selector.join());

        if (fields.length === 0) {
            return {};
        }

        fields.forEach((field) => {
            let name = this.parseFieldName(field.getAttribute('name'), formName),
                value = field.value;

            if (!value || !name) {
                return;
            }

            fieldData[name] = value;
        });

        return fieldData;
    }

    parseFieldName(fieldName, formName) {
        let suffix = '',
            invalidTest = new RegExp(this.options.invalidFieldNames.join('|'));

        if (!isString(fieldName)) {
            return null;
        }

        fieldName = fieldName.replace(formName, '');
        fieldName = fieldName.replace('][', '_');
        fieldName = fieldName.replace('[', '');
        fieldName = fieldName.replace(']', '');

        if (fieldName.match(invalidTest)) {
            return null;
        }

        if (this.duplicateNameCounter.hasOwnProperty(fieldName)) {
            suffix = '_' + (this.duplicateNameCounter[fieldName] + 1);
            this.duplicateNameCounter[fieldName]++;
        } else {
            this.duplicateNameCounter[fieldName] = 1;
        }

        if (suffix === '' && fieldName.substr(fieldName.length - 1) === '_') {
            suffix = '_1';
        }

        fieldName = fieldName + suffix;
        fieldName = fieldName.replace('__', '_');

        return fieldName;
    }

}

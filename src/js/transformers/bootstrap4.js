export const bootstrap4Validation = {
    addValidationMessage: (form, field, messages) => {
        form.classList.add('ajax-form-submitted');
        if (field.querySelectorAll('.custom-control').length) {
            field.querySelectorAll('.custom-control .custom-control-input').forEach((el) => el.classList.add('is-invalid'));
        } else {
            field.classList.add('is-invalid');
        }
        messages.forEach((message) => {
            let spanEl = document.createElement('div');
            spanEl.className = 'invalid-feedback';
            spanEl.innerText = message;
            if (field.querySelectorAll('.custom-control').length) {
                field.lastElementChild.lastElementChild.after(spanEl);
            } else {
                field.after(spanEl);
            }
        });
    },
    removeFormValidations: (form) => {
        form.querySelectorAll('.is-invalid').forEach((el) => el.classList.remove('is-invalid'));
        form.querySelectorAll('.invalid-feedback').forEach((el) => el.remove());
    },
};

export const bootstrap4ConditionalLogic = {
    show: (el, className) => {
        el.closest('.formbuilder-row').classList.remove(className);
    },
    hide: (el, className) => {
        if (el.selectedIndex) {
            el.selectedIndex = 0;
        }
        el.closest('.formbuilder-row').classList.add(className);
    },
    addClass: (el, className) => {
        el.closest('.formbuilder-row').classList.add(className);
    },
    removeClass: (el, className) => {
        el.closest('.formbuilder-row').classList.remove(className);
    },
    enable: (el) => {
        el.removeAttribute('disabled');
    },
    disable: (el) => {
        el.setAttribute('disabled', 'disabled');
    },
    addRequiredState: (el) => {
        el.setAttribute('required', 'required');
        if (el.closest('.ajax-form') && el.closest('.ajax-form').classList.contains('ajax-form-submitted')) {
            el.classList.add('is-invalid');
        }
        if (el.closest('.form-group') && el.closest('.form-group').querySelector('.col-form-legend')) {
            // form-group field
            el.closest('.form-group').querySelector('.col-form-legend').classList.add('required');
        } else if (el.labels.length) {
            // default
            el.labels[0].classList.add('required');
        }
    },
    removeRequiredState: (el) => {
        el.removeAttribute('required');
        el.classList.remove('is-invalid');
        if (el.closest('.form-group')) {
            // form-group field
            let legendField = el.closest('.form-group').querySelector('.col-form-legend');
            if (legendField) {
                legendField.classList.add('required');
            }
            let invalidFeedback = el.closest('.form-group').parentNode.querySelector('.invalid-feedback');
            if (invalidFeedback) {
                invalidFeedback.remove();
            }
        } else if (el.labels.length) {
            // default
            el.labels[0].classList.remove('required');
            let invalidFeedback = el.parentNode.querySelector('.invalid-feedback');
            if (invalidFeedback) {
                invalidFeedback.remove();
            }
        }
    },
};

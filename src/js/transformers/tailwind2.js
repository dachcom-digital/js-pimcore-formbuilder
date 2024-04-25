export const tailwind2Validation = {
    addValidationMessage: (form, field, messages) => {
        field.closest('.formbuilder-row').classList.add('form-invalid');
        messages.forEach((message) => {
            let el = document.createElement('div');
            el.className = 'form-invalid-message';
            el.innerText = message;
            if (field.matches('[type="radio"],[type="checkbox"]')) {
                field.parentElement.after(el);
            } else {
                field.after(el);
            }
        });
    },

    removeFormValidations: (form) => {
        form.querySelectorAll('.form-invalid').forEach((el) => el.classList.remove('form-invalid'));
        form.querySelectorAll('.form-invalid-message').forEach((el) => el.remove());
    },
};

export const tailwind2ConditionalLogic = {
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
        el.closest('.formbuilder-row').classList.add('form-invalid');
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
        el.closest('.formbuilder-row').classList.remove('form-invalid');
        if(el.closest('.form-group')) {
            // form-group field
            let legendField = el.closest('.form-group').querySelector('.col-form-legend');
            if(legendField) {
                legendField.classList.add('required');
            }
            let invalidFeedback = el.closest('.form-group').parentNode.querySelector('.form-invalid-message');
            if(invalidFeedback) {
                invalidFeedback.remove();
            }
        } else if (el.labels.length) {
            // default
            el.labels[0].classList.remove('required');
            let invalidFeedback = el.closest('.form-row').querySelector('.form-invalid-message');
            if(invalidFeedback) {
                invalidFeedback.remove();
            }
        }
    },
};

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
        //its a form-group field
        if (el.previousElementSibling.matches('label')) {
            el.previousElementSibling.classList.add('required');
        } else if (el.nextElementSibling.matches('label')) {
            el.closest('.form-group').querySelector('.col-form-legend').classList.add('required');
        }
    },
    removeRequiredState: (el) => {
        el.removeAttribute('required');
        el.closest('.formbuilder-row').classList.remove('form-invalid');
        // default
        if (el.previousElementSibling.matches('label')) {
            el.parentNode.querySelector('.invalid-feedback').remove();
            el.previousElementSibling.classList.remove('required');
            // custom control type
        } else if (el.nextElementSibling.matches('label')) {
            el.closest('.form-group').querySelector('.col-form-legend').classList.add('required');
            el.closest('.form-group').parentNode.querySelector('.invalid-feedback').remove();
        }
    },
};

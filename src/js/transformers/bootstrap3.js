export const bootstrap3Validation = {
    addValidationMessage: (form, field, messages) => {
        let formGroup = field.closest('.form-group');
        formGroup.classList.add('has-error');
        messages.forEach((message) => {
            let spanEl = document.createElement('div');
            spanEl.className = 'help-block error-help-block';
            spanEl.innerText = message;
            field.after(spanEl);
        });
    },
    removeFormValidations: (form) => {
        form.querySelectorAll('.has-error').forEach((el) => el.classList.remove('has-error'));
        form.querySelectorAll('.error-help-block').forEach((el) => el.remove());
    },
};

export const bootstrap3ConditionalLogic = {
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
        //its a form-group field
        if (el.parentNode.matches('label')) {
            el.parentNode.closest('.form-group').parentNode.querySelector('.control-label').classList.add('required');
        } else {
            el.previousElementSibling.classList.add('required');
        }
    },
    removeRequiredState: (el) => {
        el.removeAttribute('required');
        //its a form-group field
        if (el.parentNode.matches('label')) {
            el.parentNode.closest('.form-group').parentNode.querySelector('.control-label').classList.remove('required');
        } else {
            el.parentNode.querySelector('.help-block').remove();
            el.previousElementSibling.classList.remove('required');
            el.parentNode.classList.remove('has-error');
        }
    },
};

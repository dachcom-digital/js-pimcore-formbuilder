export const bootstrap5Validation = {
    addValidationMessage: (form, field, messages) => {
        form.classList.add('was-validated');

        field.classList.add('is-invalid');

        field.querySelectorAll('.invalid-feedback').forEach((el) => el.remove());

        messages.forEach((message) => {
            let errorDiv = document.createElement('div');
            errorDiv.className = 'invalid-feedback';
            errorDiv.innerText = message;
            field.parentNode.appendChild(errorDiv);
        });
    },
    removeFormValidations: (form) => {
        form.classList.remove('was-validated');
        form.querySelectorAll('.is-invalid').forEach((el) => el.classList.remove('is-invalid'));
        form.querySelectorAll('.invalid-feedback').forEach((el) => el.remove());
    },
};

export const bootstrap5ConditionalLogic = {
    show: (el) => {
        el.closest('.form-group, .mb-3').classList.remove('d-none');
    },
    hide: (el) => {
        el.closest('.form-group, .mb-3').classList.add('d-none');
    },
    enable: (el) => {
        el.removeAttribute('disabled');
    },
    disable: (el) => {
        el.setAttribute('disabled', 'disabled');
    },
    addRequiredState: (el) => {
        el.setAttribute('required', 'required');
        el.classList.add('is-invalid');
    },
    removeRequiredState: (el) => {
        el.removeAttribute('required');
        el.classList.remove('is-invalid');
        el.closest('.form-group, .mb-3')?.querySelector('.invalid-feedback')?.remove();
    },
};

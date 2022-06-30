export const FETCH_MANAGER_DEFAULTS = {
    submitBtnSelector: 'button[type="submit"]',
    resetFormMethod: null, // form
    onRequestDone: (responseData) => {
    },
    onFail: (responseData) => {
    },
    onError: (responseData) => {
    },
    onFatalError: (responseData) => {
    },
    onErrorField: (field, messages) => {
    },
    onGeneralError: (generalErrorMessages) => {
    },
    onSuccess: (messages, redirect) => {
    },
    elementTransformer: null,
};

export const DYNAMIC_MULTI_FILE_DROPZONE_DEFAULTS = {
    dropzoneOptions: {},
};

export const REPEATER_DEFAULTS = {
    onAdd: null,
    onRemove: null,
    renderCreateBlockElement: null, // container, classes, text
    renderRemoveBlockElement: null, // block, classes, text
    allocateCreateBlockElement: null,
    allocateRemoveBlockElement: null, // block, element
    addClass: 'btn btn-info',
    removeClass: 'btn btn-danger',
    containerClass: '.formbuilder-container.formbuilder-container-repeater',
    containerBlockClass: '.formbuilder-container-block',
};

export const RECAPTCHA_V3_DEFAULTS = {
    disableFormWhileLoading: true,
    reCaptchaFieldClass: 'input.re-captcha-v3',
};

export const TRACKER_DEFAULTS = {
    onBeforeSubmitDataToProvider: null, // data, formName, form
    provider: 'google',
    trackDropDownSelection: true,
    trackCheckboxSelection: true,
    trackRadioSelection: true,
    trackHiddenInputs: true,
    invalidFieldNames: ['_token', 'formCl', 'formRuntimeData', 'formRuntimeDataToken'],
};

export const CONDITIONAL_LOGIC_DEFAULTS = {
    conditions: {},
    actions: {},
    elementTransformer: null,
    hideElementClass: 'fb-cl-hide-element',
};

export const EVENTS = {
    success: 'formbuilder.success',
    error: 'formbuilder.error',
    errorForm: 'formbuilder.error-form',
    errorField: 'formbuilder.error-field',
    done: 'formbuilder.done',
    fatal: 'formbuilder.fatal',
    fatalCaptcha: 'formbuilder.fatal-captcha',
    requestDone: 'formbuilder.request-done',
    repeaterContainerUpdate: 'formbuilder.repeater.container.update',
    layoutPostAdd: 'formbuilder.layout.post.add',
    layoutPreAdd: 'formbuilder.layout.pre.add',
    layoutPostRemove: 'formbuilder.layout.post.remove',
    layoutPreRemove: 'formbuilder.layout.pre.remove',
    dynamicMultiFileInit: 'formbuilder.dynamic_multi_file.init',
    dynamicMultiFileDropzoneInit: 'formbuilder.dynamic_multi_file.dropzone.init'
};

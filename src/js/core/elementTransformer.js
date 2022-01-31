import {TYPE_VALIDATION, TYPE_CONDITIONAL_LOGIC} from '../constants/elementTransformer';
import {bootstrap3Validation, bootstrap3ConditionalLogic} from '../transformers/bootstrap3';
import {bootstrap4Validation, bootstrap4ConditionalLogic} from '../transformers/bootstrap4';
import {tailwind2Validation, tailwind2ConditionalLogic} from '../transformers/tailwind2';

import {isFunction} from '../utils/helpers';

export default class ElementTransformer {

    constructor(form, transformType, userMethods = null) {
        this.form = form;
        this.userMethods = userMethods;
        this.formTemplate = this.form.dataset.template;

        switch (transformType) {
            case TYPE_VALIDATION:
                this.themeTransform = {
                    'bootstrap3': bootstrap3Validation,
                    'bootstrap4': bootstrap4Validation,
                    'tailwind2': tailwind2Validation,
                };
                break;
            case TYPE_CONDITIONAL_LOGIC:
                this.themeTransform = {
                    'bootstrap3': bootstrap3ConditionalLogic,
                    'bootstrap4': bootstrap4ConditionalLogic,
                    'tailwind2': tailwind2ConditionalLogic,
                };
                break;
        }

    }

    transform() {

        let args = Array.prototype.slice.call(arguments),
            action = args.shift();

        if (this.userMethods && isFunction(this.userMethods[action])) {
            return this.userMethods[action].apply(null, args);
        }

        switch (this.formTemplate) {
            case 'bootstrap_3_layout':
            case 'bootstrap_3_horizontal_layout':
                return this.themeTransform.bootstrap3[action].apply(null, args);
            case 'bootstrap_4_layout':
            case 'bootstrap_4_horizontal_layout':
                return this.themeTransform.bootstrap4[action].apply(null, args);
            case 'tailwind_2_layout':
                return this.themeTransform.tailwind2[action].apply(null, args);
            default:
                console.warn('formbuilder error: unknown element transformer action found.', action);
                break;
        }
    }

}

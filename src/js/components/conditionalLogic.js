import {CONDITIONAL_LOGIC_DEFAULTS} from '../constants/defaults';
import {TYPE_CONDITIONAL_LOGIC} from '../constants/elementTransformer';
import ElementTransformer from '../core/elementTransformer';
import {isArray, isNode, isFunction} from '../utils/helpers';

class QualifiersApplier {
    constructor(internal, options) {
        this.onCheck = options && isFunction(options.onCheck) ? options.onCheck : internal.check;
    }
}

class ActionApplier {
    constructor(internal, options) {
        this.onEnable = options && isFunction(options.onEnable) ? options.onEnable : internal.enable;
        this.onDisable = options && isFunction(options.onDisable) ? options.onDisable : internal.disable;
    }
}

export default class ConditionalLogic {

    constructor(form, options = {}) {
        this.form = form;
        this.options = Object.assign(CONDITIONAL_LOGIC_DEFAULTS, options);
        this.formRuntimeOptions = {};
        this.logic = {};
        this.actions = {};
        this.conditions = {};
        this.elementTransformer = new ElementTransformer(this.form, TYPE_CONDITIONAL_LOGIC, this.options.elementTransformer);

        this.setupConditionProcessor();
        this.setupActionProcessor();

        this.init();

        this.form.classList.add('fb-cl-initialized');
    }

    init() {
        let clField = this.form.querySelector('input[name*="formCl"]'),
            rtoField = this.form.querySelector('input[name*="formRuntimeData"]');

        if (isNode(clField) && clField.value) {
            try {
                this.logic = JSON.parse(clField.value);
            } catch (e) {
                console.warn('formbuilder error: error while parsing conditional logic data. error was: ' + e);
                return;
            }
        }

        if (isNode(rtoField) && rtoField.value) {
            try {
                this.formRuntimeOptions = JSON.parse(rtoField.value);
            } catch (e) {
                console.warn('formbuilder error: error while parsing form runtime options data. error was: ' + e);
                return;
            }
        }

        this.setupInitialFields();
        this.parseConditions();
    }

    setupInitialFields() {
        //parse initial constraints
        this.form.querySelectorAll('*[data-initial-constraints]').forEach((el) => {
            let constraintString = el.dataset.initialConstraints,
                constraints = [],
                field;

            if (constraintString) {
                constraints = constraintString.split(',');
            }

            //append info to each checkbox/radio since the action also triggers on each checkbox/radio element!
            let subFields = this.form.querySelector('*[id^=' + el.id + '_]');
            if (isNode(subFields)) {
                field = subFields;
            } else {
                field = el;
            }

            el.removeAttribute('data-initial-constraints');
            field.dataset.fbClInitialConstraints = JSON.stringify(constraints);
            field.dataset.fbClHasInitialRequiredConstraint = constraints.includes('not_blank') ? '1' : '0';
        });
    }

    parseConditions() {

        this.logic.forEach((block) => {

            // invalid conditional logic stack.
            if (block === null) {
                return;
            }

            let actions = block.action,
                dependingStructure = actions.map((action) => ({
                    action: action,
                    condition: block.condition,
                    fields: action.fields,
                }));

            dependingStructure.forEach((d) => this.initDependencies(d));
        });
    }

    initDependencies(dependency) {
        let action = dependency.action;

        dependency.condition.forEach((condition) => {
            let conditionType = condition.type;

            condition.fields.forEach((fieldName) => {
                let fields = this.form.querySelectorAll('[name*="' + fieldName + '"]');

                fields.forEach((field) => {
                    field.addEventListener('change', (ev) => {
                        let doAction = Array.from(fields)
                                .filter((field) => !field.matches('[type="checkbox"],[type="radio"]') || field.checked)
                                .some((field) => this.conditions[conditionType].onCheck(condition, field))
                            && condition.fields.every((fieldName) => {
                                // check all other fields in same condition
                                let fields = this.form.querySelectorAll('[name*="' + fieldName + '"]');
                                return Array.from(fields)
                                    .filter((field) => !field.matches('[type="checkbox"],[type="radio"]') || field.checked)
                                    .some((field) => this.conditions[conditionType].onCheck(condition, field));
                            });

                        if (action.fields) {
                            action.fields.forEach((fieldName) => {
                                let field = this.form.querySelectorAll('[name*="' + fieldName + '"]');
                                if (doAction) {
                                    this.actions[action.type].onEnable(action, ev, field);
                                } else {
                                    this.actions[action.type].onDisable(action, ev, field);
                                }
                            });
                        }
                    });
                });
            });
        });
    }

    setupConditionProcessor() {
        let elementValue,
            outputWorkflow;

        // test!
        elementValue = new QualifiersApplier({
            check: function (condition, el) {
                switch (condition.comparator) {
                    case 'is_greater':
                        return parseFloat(el.value) > parseFloat(condition.value);
                    case 'is_less':
                        return parseFloat(el.value) < parseFloat(condition.value);
                    case 'is_value':
                        return el.value === condition.value;
                    case 'is_not_value':
                        return el.value !== condition.value;
                    case 'is_empty_value':
                        return el.value === '' || !el.value;
                    case 'contains':
                        return condition.value.split(',').some((s) => el.value.includes(s));
                    case 'is_checked':
                        return !!el.checked;
                    case 'is_not_checked':
                        return !el.checked;
                }
            },
        }, this.options.conditions.elementValue);

        outputWorkflow = new QualifiersApplier({
            check: (condition) => {
                if (!condition.hasOwnProperty('outputWorkflows') || !isArray(condition.outputWorkflows)) {
                    return true;
                }

                if (!this.formRuntimeOptions.hasOwnProperty('form_output_workflow')) {
                    return true;
                }

                return this.formRuntimeOptions.includes(condition.outputWorkflows);
            },
        }, this.options.conditions.outputWorkflow);

        this.conditions = {
            elementValue: elementValue,
            outputWorkflow: outputWorkflow,
        };
    }

    setupActionProcessor() {
        let toggleElement = new ActionApplier({
            enable: (action, ev, els) => {
                els.forEach((el) => {
                    this.elementTransformer.transform(action.state === 'show' ? 'show' : 'hide', el, this.options.hideElementClass);
                });
            },
            disable: (action, ev, els) => {
                els.forEach((el) => {
                    this.elementTransformer.transform(action.state === 'show' ? 'hide' : 'show', el, this.options.hideElementClass);
                });
            },
        }, this.options.actions.toggleElement);

        let changeValue = new ActionApplier({
            enable: (action, ev, els) => {
                els.forEach((e) => {
                    e.value = action.value;
                });
            },
            disable: function (action, ev, els) {
                // test
                els.forEach((e) => {
                    if (e.matches('input[type="checkbox"]')) {
                        e.checked = false;
                    } else if (e.matches('input') || e.matches('textarea')) {
                        e.value = '';
                    } else if (e.matches('select')) {
                        e.selectedIndex = 0;
                    }
                });
            },
        }, this.options.actions.changeValue);

        let triggerEvent = new ActionApplier({
            enable: (action, ev, els) => {
                els.forEach((el) => {
                    el.dispatchEvent(new CustomEvent(`${action.event}.enable`));
                });
            },
            disable: (action, ev, els) => {
                els.forEach((el) => {
                    el.dispatchEvent(new CustomEvent(`${action.event}.disable`));
                });
            },
        }, this.options.actions.triggerEvent);

        let toggleClass = new ActionApplier({
            enable: (action, ev, els) => {
                els.forEach((el) => {
                    this.elementTransformer.transform('addClass', el, action.class);
                });
            },
            disable: (action, ev, els) => {
                els.forEach((el) => {
                    this.elementTransformer.transform('removeClass', el, action.class);
                });
            },
        }, this.options.actions.toggleClass);

        let toggleAvailability = new ActionApplier({
            enable: (action, ev, els) => {
                els.forEach((el) => {
                    if (action.state === 'disable') {
                        this.elementTransformer.transform('disable', el);
                    } else {
                        this.elementTransformer.transform('enable', el);
                    }
                });
            },
            disable: (action, ev, els) => {
                els.forEach((el) => {
                    if (action.state === 'enable') {
                        this.elementTransformer.transform('disable', el);
                    } else {
                        this.elementTransformer.transform('enable', el);
                    }
                });
            },
        }, this.options.actions.toggleAvailability);

        let constraintsAdd = new ActionApplier({
            enable: (action, ev, els) => {
                els.forEach((el) => {
                    if (isArray(action.validation) && action.validation.includes('not_blank')) {
                        this.elementTransformer.transform('addRequiredState', el);
                    }
                });
            },
            disable: (action, ev, els) => {
                els.forEach((el) => {
                    if (el.dataset.fbClHasInitialRequiredConstraint === '1') {
                        this.elementTransformer.transform('addRequiredState', el);
                    } else if (isArray(action.validation) && action.validation.includes('not_blank')) {
                        this.elementTransformer.transform('removeRequiredState', el);
                    }
                });
            },
        }, this.options.actions.constraintsAdd);

        let constraintsRemove = new ActionApplier({
            enable: (action, ev, els) => {
                els.forEach((el) => {
                    if (action.removeAllValidations) {
                        this.elementTransformer.transform('removeRequiredState', el);
                    } else if (isArray(action.validation) && action.validation.contains('not_blank')) {
                        this.elementTransformer.transform('removeRequiredState', el);
                    }
                });
            },
            disable: (action, ev, els) => {
                els.forEach((el) => {
                    if (el.dataset.fbClHasInitialRequiredConstraint === '1') {
                        this.elementTransformer.transform('addRequiredState', el);
                    }
                });
            },
        }, this.options.actions.constraintsRemove);

        this.actions = {
            'toggleElement': toggleElement,
            'changeValue': changeValue,
            'triggerEvent': triggerEvent,
            'toggleClass': toggleClass,
            'toggleAvailability': toggleAvailability,
            'constraintsAdd': constraintsAdd,
            'constraintsRemove': constraintsRemove,
        };
    }

}

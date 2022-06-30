import { EVENTS, REPEATER_DEFAULTS } from '../constants/defaults';
import {isFunction, isNode} from '../utils/helpers';

export default class Repeater {

    constructor(form, options = {}) {
        this.options = Object.assign(REPEATER_DEFAULTS, options);
        this.form = form;

        this.form.querySelectorAll(this.options.containerClass).forEach((container) => {
            this.setupContainer(container);
        });
    }

    setupContainer(container) {
        let blocks = container.querySelectorAll(this.options.containerBlockClass);

        container.dataset.index = blocks.length;

        this.addCreateBlockButton(container);
        this.verifyButtonStates(container);

        blocks.forEach((block) => this.addRemoveBlockButton(block, container));

        container.addEventListener(EVENTS.repeaterContainerUpdate, (ev) => {
            this.reRenderBlockLabels(ev.target);
        });
    }

    addCreateBlockButton(container) {
        let element = this.renderCreateBlockElement(container);

        if (isFunction(this.options.allocateCreateBlockElement)) {
            this.options.allocateCreateBlockElement(container, element);
        } else {
            element.addEventListener('click', (ev) => this.onAdd(ev, container));
            container.appendChild(element);
        }
    }

    renderCreateBlockElement(container) {
        let element,
            classes = this.options.addClass + ' add-block',
            text = container.dataset.labelAddBlock;

        if (isFunction(this.options.renderCreateBlockElement)) {
            element = this.options.renderCreateBlockElement(container, classes, text);
        } else {
            element = document.createElement('button');
            element.className = classes;
            element.textContent = text;
        }

        if (!element.classList.contains('add-block')) {
            console.error('formbuilder error: Button requires a .add-block class to work properly.');
        }

        return element;
    }

    addRemoveBlockButton(block, container) {
        let element = this.renderRemoveBlockElement(container, block),
            repeaterMin = container.dataset.repeaterMin;

        if (repeaterMin && (this.getContainerBlockAmount(container)) <= repeaterMin) {
            return;
        }

        if (isFunction(this.options.allocateRemoveBlockElement)) {
            this.options.allocateRemoveBlockElement(block, element);
        } else {
            element.addEventListener('click', (ev) => this.onRemove(ev, container));
            block.appendChild(element);
        }
    }

    renderRemoveBlockElement(container, block) {
        let element,
            classes = this.options.removeClass + ' remove-block',
            text = container.dataset.labelRemoveBlock;


        if (isFunction(this.options.renderRemoveBlockElement)) {
            element = this.options.renderRemoveBlockElement(block, classes, text);
        } else {
            element = document.createElement('button');
            element.className = classes;
            element.textContent = text;
        }

        if (!element.classList.contains('remove-block')) {
            console.error('formbuilder error: Button requires a .remove-block class to work properly.');
        }

        return element;
    }

    onAdd(ev, container) {
        let newFormPrototype = container.dataset.prototype,
            index = container.dataset.index,
            newIndex = index + 1,
            newForm = newFormPrototype.replace(/__name__/g, index).replace(/__label__/g, (this.getContainerBlockAmount(container) + 1)),
            parser = new DOMParser(),
            newBlock = parser.parseFromString(newForm, 'text/html').body.firstChild,
            cb;

        ev.preventDefault();

        container.dataset.index = newIndex;

        cb = (newBlock) => {
            this.reRenderBlockLabels(container);
            this.addRemoveBlockButton(newBlock, container);
            this.verifyButtonStates(container);
            this.form.dispatchEvent(new CustomEvent(EVENTS.layoutPostAdd, {detail: {layout: newBlock}}));
        };

        this.form.dispatchEvent(new CustomEvent(EVENTS.layoutPreAdd, {detail: {layout: newBlock}}));

        if (isFunction(this.options.onAdd)) {
            this.options.onAdd(container, newForm, cb);
        } else {
            container.appendChild(newBlock);
            cb(newBlock);
        }
    }

    onRemove(ev, container) {
        let cb,
            containerBlock = ev.target.closest(this.options.containerBlockClass);

        ev.preventDefault();

        cb = () => {
            this.reRenderBlockLabels(container);
            this.verifyButtonStates(container);
            this.form.dispatchEvent(new CustomEvent(EVENTS.layoutPostRemove, {detail: {layout: containerBlock}}));
        };

        this.form.dispatchEvent(new CustomEvent(EVENTS.layoutPreRemove, {detail: {layout: containerBlock}}));

        if (isFunction(this.options.onRemove)) {
            this.options.onRemove(container, cb);
        } else {
            containerBlock.remove();
            cb();
        }
    }

    verifyButtonStates(container) {
        let addButton = container.querySelector('.add-block');
        addButton.style.display = this.canAddNewBlock(container) ? 'inline-block' : 'none';
    }

    reRenderBlockLabels(container) {
        let blocks = container.querySelectorAll(this.options.containerBlockClass),
            counter = 1;

        blocks.forEach((block) => {
            let labelText = '',
                label = block.querySelector('[data-label-template]');

            if (isNode(label)) {
                labelText = label.dataset.labelTemplate;
                label.innerText = labelText.replace(/__label_index__/, counter.toString());
                counter++;
            }
        });
    }

    canAddNewBlock(container) {
        let repeaterMax = container.dataset.repeaterMax;

        if (!repeaterMax) {
            return true;
        }

        return this.getContainerBlockAmount(container) < repeaterMax;
    }

    getContainerBlockAmount(container) {
        return container.querySelectorAll(this.options.containerBlockClass).length;
    }

}

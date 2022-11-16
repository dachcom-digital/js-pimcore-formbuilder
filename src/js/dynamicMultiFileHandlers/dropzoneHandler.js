import {DYNAMIC_MULTI_FILE_DROPZONE_DEFAULTS, EVENTS} from '../constants/defaults';
import Endpoints from '../core/endpoints';
import Dropzone from 'dropzone';

export default class DropzoneHandler {

    constructor(form, options = {}, endpoints = null) {
        this.form = form;
        this.options = Object.assign(DYNAMIC_MULTI_FILE_DROPZONE_DEFAULTS, options);
        this.endpoints = endpoints;
        this.dmfFields = form.querySelectorAll('[data-dynamic-multi-file-instance]');


        if (!this.endpoints || !['file_add', 'file_chunk_done', 'file_delete']
            .every((key) => Object.keys(this.endpoints).includes(key))) {
            this.setEndpoints(form);
        } else {
            this.prepareForm();
        }
    }

    prepareForm() {
        this.addListener();
        this.dmfFields.forEach((el) => this.setupDropZoneElement(el));
    }

    setupDropZoneElement(el) {
        let submitButton = this.form.querySelector('*[type="submit"]'),
            template = el.querySelector('.dropzone-template'),
            element = el.querySelector('.dropzone-container'),
            fieldId = el.dataset.fieldId,
            storageFieldId = fieldId + '_data',
            storageField = this.form.querySelector(`input[type="hidden"][id="${storageFieldId}"]`),
            config = JSON.parse(el.dataset.engineOptions),
            dropzoneConfiguration = {
                paramName: 'dmfData',
                url: this.getEndpoint('file_add'),
                chunking: config.multiple === false,
                addRemoveLinks: true,
                hiddenInputContainer: el,
                maxFiles: config.item_limit,
                acceptedFiles: config.allowed_extensions,
                maxFilesize: config.max_file_size,
                uploadMultiple: config.multiple,
                init: () => {
                    template.remove();
                    this.form.dispatchEvent(new CustomEvent(EVENTS.dynamicMultiFileDropzoneInit));
                },
            };

        if (template.querySelectorAll('div.dz-file-preview').length > 0) {
            dropzoneConfiguration.previewTemplate = template.innerHTML;
        }

        if (config.translations) {
            dropzoneConfiguration = Object.assign(dropzoneConfiguration, config.translations);
        }

        dropzoneConfiguration = Object.assign(dropzoneConfiguration, this.options.dropzoneOptions);

        this.form.dispatchEvent(new CustomEvent(EVENTS.dynamicMultiFileInit, {detail: [el, this.options, dropzoneConfiguration]}));
        element.classList.add('dropzone');

        new Dropzone(element, dropzoneConfiguration)
            .on('removedfile', (file) => {
                let url = `${this.getEndpoint('file_delete')}/${file.upload.uuid}`;
                fetch(url, {method: 'DELETE'})
                    .then(response => response.json())
                    .then((data) => {
                        if (data.success === false) {
                            return;
                        }

                        this.removeFromStorageField(storageField, {
                            id: data.uuid,
                        });
                    });
            }).on('sending', (file, xhr, formData) => {
            submitButton.setAttribute('disabled', 'disabled');
            formData.append('uuid', file.upload.uuid);
        }).on('complete', () => {
            submitButton.removeAttribute('disabled');
        }).on('success', (file, response) => {
            this.addToStorageField(storageField, {
                id: response.uuid,
                fileName: response.fileName,
            });
        }).on('cancel', () => {
            submitButton.removeAttribute('disabled');
        });

    }

    addToStorageField(storage, newData) {
        let data = typeof storage.value === 'string' && storage.value !== ''
            ? JSON.parse(storage.value)
            : [];

        data.push(newData);

        storage.value = JSON.stringify(data);
    }

    removeFromStorageField(storage, newData) {
        let data = typeof storage.value === 'string' && storage.value !== ''
            ? JSON.parse(storage.value)
            : [];

        data = data.filter((d) => d.id !== newData.id);

        storage.value = JSON.stringify(data);
    }

    addListener() {
        this.form.addEventListener('submit', (ev) => {

            let elements = ev.target.querySelectorAll('.dz-remove');
            elements.forEach((el) => el.style.display = 'none');

        });

        this.form.addEventListener(EVENTS.requestDone, (ev) => {

            let elements = ev.target.querySelectorAll('.dz-remove');
            elements.forEach((el) => el.style.display = 'block');

        });

        this.form.addEventListener(EVENTS.success, (ev) => {

            let elements = ev.target.querySelectorAll('[data-dynamic-multi-file-instance]');
            elements.forEach((el) => {
                let dzInstance = null,
                    fieldId = el.dataset.fieldId,
                    storageFieldId = fieldId + '_data',
                    storageField = this.form.querySelector('input[type="hidden"][id="' + storageFieldId + '"]');

                try {
                    dzInstance = Dropzone.forElement(el.querySelector('.dropzone-container'));
                } catch (e) {
                    console.error(e);
                }

                if (dzInstance !== null) {
                    dzInstance.removeAllFiles();
                }

                storageField.value = '';
            });

        });

        this.form.addEventListener(EVENTS.layoutPostAdd, (ev) => {

            let elements = ev.detail.layout.querySelectorAll('[data-dynamic-multi-file-instance]');
            elements.forEach((el) => this.setupDropZoneElement(el));

        });

        this.form.addEventListener(EVENTS.layoutPreRemove, (ev) => {

            let elements = ev.detail.layout.querySelectorAll('[data-dynamic-multi-file-instance]');
            elements.forEach((el) => {
                let dzInstance = null,
                    config = el.dataset.engineOptions;

                try {
                    dzInstance = Dropzone.forElement(el.querySelector('.dropzone-container'));
                } catch (e) {
                    console.error(e);
                }

                if (dzInstance !== null && dzInstance.files.length > 0) {
                    throw new Error(config.instance_error);
                }
            });

        });
    }

    getEndpoint(section) {
        return this.endpoints[section];
    }

    setEndpoints(form) {
        let url = form.dataset.ajaxStructureUrl;

        new Endpoints().getEndpoints(url)
            .then((endpoints) => {
                this.endpoints = endpoints;
                this.prepareForm();
            }).catch((error) => {
            console.error('formbuilder error: fetching file structure', error);
        });
    }

}

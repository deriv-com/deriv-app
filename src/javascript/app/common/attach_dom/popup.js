const Validation     = require('../form_validation');
const getElementById = require('../../../_common/common_functions').getElementById;
const createElement  = require('../../../_common/utility').createElement;

const cache = {};
const popup_queue = [];

// use this function if you need to show a form with some validations in popup
// if you need a simple popup with just a confirm or also a cancel button use Dialog instead
const showPopup = (options) => {
    if (cache[options.url]) {
        callback(options);
    } else {
        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState !== 4 || this.status !== 200) {
                return;
            }
            cache[options.url] = this.responseText;
            callback(options);
        };
        xhttp.open('GET', options.url, true);
        xhttp.send();
    }
};

const callback = (options) => {
    const div      = createElement('div', { html: cache[options.url] });
    const lightbox = createElement('div', { id: options.popup_id, class: 'lightbox' });
    lightbox.appendChild(div.querySelector(options.content_id));
    lightbox.addEventListener('DOMNodeRemoved', (e) => {
        if (!popup_queue.length || e.target.className !== 'lightbox') return;
        document.body.appendChild(popup_queue.pop()); // show popup in queue
    });

    const has_lightbox = document.querySelector('.lightbox');
    if (has_lightbox) {
        // store this popup in queue to show it after the previous popup has been removed
        // to avoid having multiple popup showing at the same time
        popup_queue.push(lightbox);
    } else {
        document.body.appendChild(lightbox);
    }

    if (options.validations) {
        Validation.init(options.form_id, options.validations);
    }

    if (typeof options.additionalFunction === 'function') {
        options.additionalFunction(lightbox);
    }

    getElementById(options.form_id.slice(1)).addEventListener('submit', (e) => {
        e.preventDefault();
        if (options.validations) {
            if (Validation.validate(options.form_id)) {
                if (lightbox) {
                    lightbox.remove();
                }
                if (typeof options.onAccept === 'function') {
                    options.onAccept();
                }
            }
        } else if (lightbox) {
            lightbox.remove();
        }
    });
};

module.exports = showPopup;

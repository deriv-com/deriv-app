const createElement = require('./utility').createElement;

const jqueryuiTabsToDropdown = ($container) => {
    const $ddl = $('<select/>');
    $container.find('li a').each(function () {
        $ddl.append($('<option/>', { text: $(this).text(), value: $(this).attr('href') }));
    });
    $ddl.change(function () {
        $container.find(`li a[href="${$(this).val()}"]`).click();
    });
    return $ddl;
};

const makeOption = (options) => {
    // setting null value helps with detecting required error
    // on 'Please select' options
    // that have no value of their own
    const option_el = createElement('option', { text: options.text, value: options.value || '' });

    if (options.is_disabled && options.is_disabled.toLowerCase() === 'disabled') {
        option_el.setAttribute('disabled', 'disabled');
    }
    if (options.class) {
        option_el.className = options.class;
    }
    if (options.is_selected) {
        option_el.setAttribute('selected', 'selected');
    }
    return option_el;
};

/*
 * function to check if element is visible or not
 *
 * alternative to jquery $('#id').is(':visible')
 */
const isVisible = elem => !(!elem || (elem.offsetWidth === 0 && elem.offsetHeight === 0));

/*
 * function to check if browser supports the type date/time
 * send a wrong val in case browser 'pretends' to support
 */
const checkInput = (type, wrong_val) => {
    const input = createElement('input', { type, value: wrong_val });
    return (input.value !== wrong_val);
};

/*
 * function to check if new date is selected using native picker
 * if yes, update the data-value. if no, return false.
 */
const dateValueChanged = (element, type) => {
    let value;
    if (element.selectedOptions) {
        value = element.selectedOptions[0].getAttribute('data-value');
    } else {
        value = element.value;
    }
    if (element.getAttribute('data-value') === value) {
        return false;
    }
    if (element.getAttribute('type') === type) {
        element.setAttribute('data-value', value);
    }
    return true;
};

const selectorExists = element => (typeof (element) !== 'undefined' && element !== null);

const getSetElementValue = (element, text, type) => { // eslint-disable-line consistent-return
    if (selectorExists(element)) {
        if (typeof text === 'undefined') return element[type];
        // else
        element[type] = text;
    }
};

/*
 * @param  {String}  id_selector   the selector for the element
 * @param  {Element} parent        optional selector to use for parent, defaults to document
 * @return {Element}               return element if it exists, if it doesn't return a dummy element
 */
const getElementById = (id_selector, parent = document) => parent.getElementById(id_selector) || createElement('div');

/*
 * @param  {String}  class_name    the selector class for the element
 * @param  {Element} parent        optional selector to use for parent, defaults to document
 * @return {Element}               return element if it is visible
 */
const getVisibleElement = (class_name, parent = document) =>
    Array.from(parent.getElementsByClassName(class_name)).find((el) => isVisible(el));

module.exports = {
    jqueryuiTabsToDropdown,
    makeOption,
    isVisible,
    checkInput,
    dateValueChanged,
    selectorExists,
    getElementById,
    getVisibleElement,
    elementTextContent: (element, text) => getSetElementValue(element, text, 'textContent'),
    elementInnerHtml  : (element, text) => getSetElementValue(element, text, 'innerHTML'),
};

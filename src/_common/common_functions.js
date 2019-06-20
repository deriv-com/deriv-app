const createElement = require('./utility').createElement;

/*
 * function to check if element is visible or not
 *
 */
const isVisible = elem => !(!elem || (elem.offsetWidth === 0 && elem.offsetHeight === 0));

/*
 * @param  {String}  id_selector   the selector for the element
 * @param  {Element} parent        optional selector to use for parent, defaults to document
 * @return {Element}               return element if it exists, if it doesn't return a dummy element
 */
const getElementById = (id_selector, parent = document) => parent.getElementById(id_selector) || createElement('div');

module.exports = {
    isVisible,
    getElementById,
};

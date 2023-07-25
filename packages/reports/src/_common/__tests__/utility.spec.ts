import { createElement, getStaticHash, PromiseClass } from '../utility';

describe('Utility', () => {
    it('should create and return an element without any attributes when createElement is called', () => {
        const element = createElement('p');
        expect(element).toBeDefined();
    });
    it('should create and return an element with the text attribute when createElement is called', () => {
        const element = createElement('div', { text: 'test-text' });
        expect(element).toBeDefined();
    });
    it('should create and return an element with the value attribute when createElement is called', () => {
        const element = createElement('input', { value: 'test-value' });
        expect(element).toBeDefined();
    });
    it('should create and return an element with the html attribute when createElement is called', () => {
        const element = createElement('div', { html: 'test-html' });
        expect(element).toBeDefined();
    });
    it('should return static hash when getStaticHash is called', () => {
        global.window.document.body.innerHTML =
            '<script src="/js/core.vendors-node_modules_datadog_browser-rum_esm_entries_main_js-node_modules_deriv_deriv-api_dis-f4a55b.dbae67284cad6cbfe87d.js"></script>';
        const hash = getStaticHash();
        expect(hash).toEqual(
            'vendors-node_modules_datadog_browser-rum_esm_entries_main_js-node_modules_deriv_deriv-api_dis-f4a55b'
        );
    });
    it('it should instantiate the PromiseClass', () => {
        const promise = new PromiseClass();
        expect(promise).toBeDefined();
    });
});

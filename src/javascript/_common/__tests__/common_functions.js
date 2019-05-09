const expect          = require('chai').expect;
const jsdom           = require("jsdom");
const CommonFunctions = require('../common_functions');

describe('CommonFunctions', () => {
    let date_element,
        text_element,
        invalid_element;

    before(() => {
        jsdom.env({
            html: '<!DOCTYPE html>' +
            '<div></div>' +
            '<input data-value="2017-06-21" type="date" value="2017-06-21">',
            done: (error, window) => {
                date_element    = window.document.querySelector('input');
                text_element    = window.document.querySelector('div');
                invalid_element = window.document.getElementById('invalid');
            },
        });
    });

    describe('.dateValueChanged()', () => {
        it('detects value hasn\'t changed', () => {
            expect(CommonFunctions.dateValueChanged(date_element, 'date')).to.eq(false);
        });
        it('detects value has changed', () => {
            date_element.value = '2017-06-22';
            expect(CommonFunctions.dateValueChanged(date_element, 'date')).to.eq(true);
        });
        it('correctly updates data-value to new value', () => {
            expect(date_element.getAttribute('data-value')).to.eq(date_element.value);
        });
    });

    describe('.selectorExists()', () => {
        it('detects valid selector exists', () => {
            expect(CommonFunctions.selectorExists(date_element)).to.eq(true);
        });
        it('detects invalid selector doesn\'t exist', () => {
            expect(CommonFunctions.selectorExists(invalid_element)).to.eq(false);
        });
    });

    describe('.elementTextContent()', () => {
        it('sets and gets textContent', () => {
            CommonFunctions.elementTextContent(text_element, 'Test<span></span>');
            expect(CommonFunctions.elementTextContent(text_element)).to.eq('Test<span></span>');
        });
    });

    describe('.elementInnerHtml()', () => {
        it('sets and gets innerHTML', () => {
            expect(CommonFunctions.elementInnerHtml(text_element)).to.eq('Test&lt;span&gt;&lt;/span&gt;');
            CommonFunctions.elementInnerHtml(text_element, 'Test<span></span>');
            expect(CommonFunctions.elementInnerHtml(text_element)).to.eq('Test<span></span>');
        });
    });
});

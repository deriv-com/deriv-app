const color   = require('cli-color');
const expect  = require('chai').expect;
const extract = require('../extract_js_texts');

describe('extract_js_texts.js', () => {
    let errors_count = 0;

    before(function (done) {
        this.timeout(60000);
        errors_count = ['app'].reduce((acc, app) => {
            extract.parse(app, true);
            return acc +  extract.getErrorsCount();
        }, 0);
        done();
    });

    it('localize() calls should have the first arguments as literal string', () => {
        expect(errors_count).to.be.a('number').and.to.eq(0);
    });

    after(() => {
        if (errors_count) {
            console.log(
                color.white('\tDescription:\n'),
                color.xterm(8)(
`\tThis is to make sure that the extractor code won't miss any string to push to translations.
\t1. Please check the errors and refactor the code accordingly.
\t2. If there is no way to have the string literal in js code (i.e. API texts),
\t   add them to 'scripts/js_texts/static_strings_app.js'.
\t3. At the end, when you're sure that a strings already been taken care of somewhere else,
\t   just put this comment /* localize-ignore */ right after the first argument of localize() call to ignore it.`
                )
            );
        }
    });
});

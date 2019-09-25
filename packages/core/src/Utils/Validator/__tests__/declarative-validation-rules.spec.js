import { expect }             from 'chai';
// import sinon                  from 'sinon';
import { getPreBuildDVRs }    from '../declarative-validation-rules.js';

describe('declarative_validation_rules.js', () => {
    let rules = getPreBuildDVRs();
    let options;

    describe('.validRequired', () => {
        it('should return false if value is undefined', () => {
            expect(rules['req'].func(undefined)).to.be.false;
        });
        it('should return false if value is null', () => {
            expect(rules['req'].func(null)).to.be.false;
        });
        it('should return false if value length is 0', () => {
            expect(rules['req'].func('')).to.be.false;
        });
        it('should return true if value length is larger than 0', () => {
            expect(rules['req'].func('a')).to.be.true;
        });
    });

    describe('.validEmail', () => {
        it('should return false if username contains restricted characters', () => {
            let restricted_characters = '`!@#$%^&*=(){}[]:;"<>,?/~|\'\\'.split('');
            restricted_characters.forEach((restricted_character) => {
                let mockvalue = `user${restricted_character}name@proper.test`
                expect(rules['email'].func(mockvalue)).to.be.false;
            });
        });
        it('should return false if @ does not exist in the middle of an address', () => {
            expect(rules['email'].func('usernameproper.test')).to.be.false;
        });
        it('should return false if domain name contains restricted characters', () => {
            let restricted_characters = '`!@#$%^&*=(){}[]:;"<>,?/~|\'\\_+'.split('');
            restricted_characters.forEach((restricted_character) => {
                let mockvalue = `username@pro${restricted_character}per.test`;
                expect(rules['email'].func(mockvalue)).to.be.false;
            });
        });
        it('should return false if top level domain contains restricted characters', () => {
            let restricted_characters = '0123456789`~!@#$%^&*()_+-={}[]|:";<>?,/\\\''.split('');
            restricted_characters.forEach((restricted_character) => {
                let mockvalue = `username@proper.te${restricted_character}st`;
                expect(rules['email'].func(mockvalue)).to.be.false;
            });
        });
        it('should return false if top level domain is smaller than 2', () => {
            expect(rules['email'].func('username@proper.t')).to.be.false;
        });
        it('should return false if top level domain is bigger than 63', () => {
            expect(rules['email'].func('username@proper.tttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt')).to.be.false;
        });
    });

    describe('.validPassword', () => {
        it('should return false if password contains characters that are not alphabets or numerals', () => {
            let restricted_characters = '`!@#$%^&*=(){}[]:;"<>,?/~|\'\\_+'.split('');
            restricted_characters.forEach((restricted_character) => {
                let mockvalue = `pass${restricted_character}word`;
                expect(rules['password'].func(mockvalue)).to.be.false;
            });
        });
    });

    describe('.validLetterSymbol', () => {
        it('should return false if value contains restricted characters', () => {
            let restricted_characters = '`~!@#$%^&*)(_=+[}{\]\\/";:?><,|\d'.split('');
            restricted_characters.forEach((restricted_character) => {
                let mockvalue = `test_${restricted_character}`;
                expect(rules['letter_symbol'].func(mockvalue)).to.be.false;
            });
        });
    });

    describe('.validGeneral', () => {
        it('should return false if value contains restricted characters', () => {
            let restricted_characters = '`~!@#$%^&*)(_=+[}{\]\\/";:?><|'.split('');
            restricted_characters.forEach((restricted_character) => {
                let mockvalue = `test_${restricted_character}`;
                expect(rules['general'].func(mockvalue)).to.be.false;
            });
        });
    });

    describe('.validAddress', () => {
        it('should return false if value contains restricted characters', () => {
            let restricted_characters = '`~!$%^&*_=+[}{\]\\"?><|'.split('');
            restricted_characters.forEach((restricted_character) => {
                let mockvalue = `test_${restricted_character}`;
                expect(rules['address'].func(mockvalue)).to.be.false;
            });
        });
    });

    describe('.validPostCode', () => {
        it('should return false if value contains characters that is not alphabets or numerals', () => {
            let non_alpha_nums = '`~!@#$%^&*()_+={}|[]\\:;"\'<>?,./'.split('');
            non_alpha_nums.forEach((non_char_num) => {
                let mockvalue = `00${non_char_num}00`;
                expect(rules['postcode'].func(mockvalue)).to.be.false;
            });
        });
    });

    describe('.validPhone', () => {
        it('should return false if value contains characters that are not numerals', () => {
            let non_numbers = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ`~!@#$%^&*()_+={}|[]\\:;"\'<>?,./'.split('');
            non_numbers.forEach((non_number) => {
                let mockvalue = `000 000${non_number} 0000`;
                expect(rules['phone'].func(mockvalue)).to.be.false;
            });
        });
    });

    describe('.validEmailToken', () => {
        it('should return false if value length is less than 8', () => {
            expect(rules['signup_token'].func('1234567')).to.be.false;
        });
        it('should return false if value length is more than 8', () => {
            expect(rules['signup_token'].func('123456789')).to.be.false;
        });
    });

    describe('.validTaxID', () => {
        it('should return false if value is not allowed', () => {
            let not_valid_charaters = '~!@#$%^&*()+`={}|[]\\:\'";<>?/.,'.split('');
            not_valid_charaters.forEach((not_valid_charater) => {
                let mockvalue = `10${not_valid_charater}01`;
                expect(rules['tax_id'].func(mockvalue)).to.be.false;
            });
        });
    });

    describe('.validBarrier', () => {
        it('should return false if value is not numbers and a full stop', () => {
            let not_valid_charaters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ~!@#$%^&*()_+-=`{}|[]\\:";\'<>?/,'.split('');
            not_valid_charaters.forEach((not_valid_charater) => {
                let mockvalue = `0.${not_valid_charater}001`;
                expect(rules['barrier'].func(mockvalue)).to.be.false;
            });
        });
    });

    // TODO: find a way to test these without jquery
    // describe('tests that uses options variable', () => {
    //     let options;
    //     beforeEach('setting up options', () => {
    //         options = {
    //             allow_empty: true,
    //             min: 0,
    //             max: 8,
    //             type: 'float',
    //             decimals: 2,
    //             regex: /[a-z]/g,
    //             to: '#txt',
    //         }
    //     });
    //
    //     describe('tests that use jQuery', () => {
    //         beforeEach('setting up sinon stub', () => {
    //             $ = sinon.stub();
    //             $.withArgs(options.to).returns({
    //                 val: sinon.stub().returns('txt')
    //             });
    //         });
    //
    //         describe('validCompare', () => {
    //             it('expects return false if empty value passed', () => {
    //                 expect(rules['compare'].func('', options)).to.be.false;
    //             });
    //
    //             it('expects return true if the value match', () => {
    //                 expect(rules['compare'].func('txt', options)).to.be.true;
    //             });
    //
    //             it('expects false if the value is not match', () => {
    //                 expect(rules['compare'].func('txt_wrong', options)).to.be.false;
    //             });
    //         });
    //
    //         describe('validNotEqual', () => {
    //             it('expects return true if empty value passed', () => {
    //                 expect(rules['not_equal'].func('', options)).to.be.true;
    //             });
    //
    //             it('expects return false if the value match', () => {
    //                 expect(rules['not_equal'].func('txt', options)).to.be.false;
    //             });
    //
    //             it('expects true if the value is not match', () => {
    //                 expect(rules['not_equal'].func('txt_wrong', options)).to.be.true;
    //             });
    //         });
    //     });
    //
    //     describe('.validMin', () => {
    //         it('should return true if options.min is null, undefined, or 0', () => {
    //             options.min = 0;
    //             expect(rules['min'].func('', options)).to.be.true;
    //         });
    //         it('should return true if value.length >= options.min', () => {
    //             options.min = 2;
    //             expect(rules['min'].func('00', options)).to.be.true;
    //         });
    //         it('should return false if value.length < options.min', () => {
    //             options.min = 2;
    //             expect(rules['min'].func('0', options)).to.be.false;
    //         });
    //     });
    //
    //     describe('.validLength', () => {
    //         it('should return true if value.length is in boundary', () => {
    //             options.min = 1;
    //             expect(rules['length'].func('00', options)).to.be.true;
    //         });
    //         it('should return false if value is smaller than minimum', () => {
    //             options.min = 1;
    //             expect(rules['length'].func('', options)).to.be.false;
    //         });
    //         it('should return false if value is bigger than maximum', () => {
    //             options.max = 1;
    //             expect(rules['length'].func('00', options)).to.be.false;
    //         });
    //         it('should return true if min and max is not set', () => {
    //             options.max = 0;
    //             expect(rules['length'].func('0', options)).to.be.true;
    //         });
    //     });
    //
    //     describe('.validNumber', () => {
    //         // New lines seperates tests for different if statements.
    //         it('should return true if value is empty', () => {
    //             expect(rules['number'].func('', options)).to.be.true;
    //         });
    //
    //         it('should return true if float', () => {
    //             expect(rules['number'].func(0.0, options)).to.be.true;
    //         });
    //         it('should return true if integer', () => {
    //             options['type'] = 'int';
    //             expect(rules['number'].func(0, options)).to.be.true;
    //         });
    //         it('should return false if value is characters', () => {
    //             expect(rules['number'].func('a', options)).to.be.false;
    //         });
    //         it('should return false if value is NaN', () => {
    //             expect(rules['number'].func(NaN, options)).to.be.false;
    //         });
    //
    //         it('should return false if value is float which does not exceed options.decimal', () => {
    //             expect(rules['number'].func(0.002, options)).to.be.false;
    //         });
    //
    //         it('should return false if min and max equals to one another while value is not equal to min', () => {
    //             options.min = 1;
    //             options.max = 1;
    //
    //             expect(rules['number'].func(0, options)).to.be.false;
    //             expect(rules['number'].func(2, options)).to.be.false;
    //         });
    //
    //         it('should return false if value out of boundary (min, max)', () => {
    //             options.min = 2;
    //             options.max = 3;
    //
    //             expect(rules['number'].func(1, options)).to.be.false;
    //             expect(rules['number'].func(4, options)).to.be.false;
    //         });
    //         it('should return true if value in boundary (min, max)', () => {
    //             options.min = 2;
    //             options.max = 4;
    //
    //             expect(rules['number'].func(3, options)).to.be.true;
    //         });
    //
    //         it('should return false if smaller than min', () => {
    //             options.min = 2;
    //             expect(rules['number'].func(1, options)).to.be.false;
    //         });
    //
    //         it('should return false if bigger than max', () => {
    //             options.max = 0;
    //             expect(rules['number'].func(1, options)).to.be.false;
    //         });
    //     });
    // });

    describe('getPreBuildDVRs', () => {
        const anyFunction = () => {};
        const pre_build_dvrs = {
            address:        { func: anyFunction, message: '' },
            barrier:        { func: anyFunction, message: '' },
            compare:        { func: anyFunction, message: '' },
            email:          { func: anyFunction, message: '' },
            general:        { func: anyFunction, message: '' },
            length:         { func: anyFunction, message: '' },
            letter_symbol:  { func: anyFunction, message: '' },
            min:            { func: anyFunction, message: '' },
            not_equal:      { func: anyFunction, message: '' },
            number:         { func: anyFunction, message: '' },
            password:       { func: anyFunction, message: '' },
            phone:          { func: anyFunction, message: '' },
            postcode:       { func: anyFunction, message: '' },
            regular:        { func: anyFunction, message: '' },
            req:            { func: anyFunction, message: '' },
            signup_token:   { func: anyFunction, message: '' },
            tax_id:         { func: anyFunction, message: '' },
        };

        it('Expects pre_build_dvrs initialized if no arguments passed', () => {
            expect(Object.keys(rules)).to.eql(Object.keys(pre_build_dvrs));
        });

        it('Expects return pre build dvrs if there is pre-build dvrs', () => {
            rules['address'].message = 'anymessage';
            expect(rules['address'].message).to.eql('anymessage');
        });
    });
});

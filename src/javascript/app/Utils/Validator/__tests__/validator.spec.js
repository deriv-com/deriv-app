import { expect }           from 'chai';
import { getPreBuildDVRs }  from '../declarative-validation-rules';
import Validator            from '../validator';

describe('Validator', () => {
    let input;
    let rules = getPreBuildDVRs();
    let validator;

    beforeEach('Setting up validator', () => {
        input = 'TestInput';
        validator = new Validator(
            input,
            rules,
        );
    });

    describe('.addFailure', () => {
        it('should add failure to the error list if addFailure is used', () => {
            validator.addFailure(input, Validator.getRuleObject('length'));
            expect(validator.errors.errors).to.have.property(input).with.lengthOf(1);
        });
        it('should update error count if addFailure is used', () => {
            validator.addFailure(input, Validator.getRuleObject('length'));
            expect(validator.error_count).to.eql(1);
        });
    });

    describe('.isPassed', () => {
        it('should return true if no error is added', () => {
            expect(validator.isPassed()).to.be.true;
        });
        it('should return false if an error or more is added', () => {
            validator.addFailure(input, Validator.getRuleObject('length'));
            expect(validator.isPassed()).to.be.false;
        });
    });

    describe('.getRuleObject', () => {
        it('should get rule object from a rule array', () => {
            const ruleArray = ['length', 'options'];
            expect(Validator.getRuleObject(ruleArray)).to.be.a('object');
        });
    });
});

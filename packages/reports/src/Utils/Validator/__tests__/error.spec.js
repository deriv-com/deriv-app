import { expect } from 'chai';
import Errors from '../errors';

describe('Error', () => {
    let errors;
    beforeEach(() => {
        errors = new Errors();
        errors.add('Error', 100);
    });

    describe('.add', () => {
        it('should add error to errors', () => {
            errors.add('Error', 101);
            expect(errors.errors).to.have.property('Error').with.length(2);
        });
        it('should not add error if already existed', () => {
            errors.add('Error', 100);
            expect(errors.errors).to.have.property('Error').with.length(1);
        });
    });

    describe('.all', () => {
        it('should return all errors', () => {
            expect(errors.all()).to.be.eql({
                Error: [100],
            });
        });
    });

    describe('.first', () => {
        it('should return first error if attribute exists', () => {
            expect(errors.first('Error')).to.eql(100);
        });
    });

    describe('.get', () => {
        it('should return data if attribute exists', () => {
            expect(errors.get('Error')).to.eql([100]);
        });
        it('should return [] if attribute does not exist', () => {
            expect(errors.get('')).to.eql([]);
        });
    });

    describe('.has', () => {
        it('should return true if attribute exists', () => {
            expect(errors.has('Error')).to.be.true;
        });
        it('should return false if attribute does not exists', () => {
            expect(errors.has('')).to.be.false;
        });
    });
});

import Errors from '../errors';

describe('Errors', () => {
    let errors;

    beforeEach(() => {
        errors = new Errors();
        errors.add('Error', 100);
    });

    it('should add a new error to the errors', () => {
        errors.add('Error', 101);
        expect(errors.errors['Error']).toHaveLength(2);
    });

    it('should not add an error if already existed', () => {
        errors.add('Error', 100);
        expect(errors.errors['Error']).toHaveLength(1);
    });

    it('should return all errors', () => {
        expect(errors.all()).toEqual({ Error: [100] });
    });

    it('should return first error if attribute exists', () => {
        expect(errors.first('Error')).toEqual(100);
    });

    it('should return data if attribute exists', () => {
        expect(errors.get('Error')).toEqual([100]);
    });

    it('should return an empty array if attribute does not exist', () => {
        expect(errors.get('')).toEqual([]);
    });

    it('should return "true" if attribute exists', () => {
        expect(errors.has('Error')).toBeTruthy();
    });

    it('should return "false" if the attribute does not exist', () => {
        expect(errors.has('')).toBeFalsy();
    });
});

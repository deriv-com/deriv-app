import { generatePlaceholderText } from '../utils';

describe('generatePlaceholderText', () => {
    it('should return the correct placeholder text for drivers license', () => {
        expect(generatePlaceholderText('drivers_license')).toEqual('Enter Driver License Reference number');
    });

    it('should return the correct placeholder text for ssnit', () => {
        expect(generatePlaceholderText('ssnit')).toEqual('Enter your SSNIT number');
    });

    it('should return the correct placeholder text for id card', () => {
        expect(generatePlaceholderText('id_card')).toEqual('Enter your document number');
    });

    it('should return the correct placeholder text for passport', () => {
        expect(generatePlaceholderText('passport')).toEqual('Enter your document number');
    });
});

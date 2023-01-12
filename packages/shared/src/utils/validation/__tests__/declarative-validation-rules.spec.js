import { validAddress, initFormErrorMessages } from '../declarative-validation-rules';

const form_error_messages = {
    address: () => '',
};

describe('validAddress', () => {
    beforeAll(() => {
        initFormErrorMessages(form_error_messages);
    });
    it('should not accept empty string', () => {
        expect(validAddress('').is_ok).toBe(false);
    });
    it('should not accept string longer than 70 characters', () => {
        expect(validAddress('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod').is_ok).toBe(
            false
        );
    });
    it('should accept English and decimals', () => {
        expect(validAddress('221B Baker Street').is_ok).toBe(true);
    });
    it('should accept permitted characters', () => {
        expect(validAddress(". , ' : ; ( ) ° @ # / -").is_ok).toBe(true);
    });
    it('should accept different languages', () => {
        expect(validAddress('Улица đường phố ถนน شارع 街道 거리').is_ok).toBe(true);
    });
    it('should not accept special characters other then the permitted ones', () => {
        const not_permitted_characters = '§±!$%^&*+=\\?{}[]|';
        [...not_permitted_characters].forEach(c => expect(validAddress(c).is_ok).toBe(false));
    });
});

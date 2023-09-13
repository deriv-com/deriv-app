import { generateErrorDialogBody, generateErrorDialogTitle } from '../adverts';

describe('generateErrorDialogBody', () => {
    it('should return "Please set a different minimum and/or maximum order limit" when error_code is "AdvertSameLimits"', () => {
        expect(generateErrorDialogBody('AdvertSameLimits')).toBe(
            'Please set a different minimum and/or maximum order limit. \n\nThe range of your ad should not overlap with any of your active ads.'
        );
    });
    it('should return "You already have an ad with the same exchange rate" when error_code is "DuplicateAdvert"', () => {
        expect(generateErrorDialogBody('DuplicateAdvert')).toBe(
            'You already have an ad with the same exchange rate for this currency pair and order type. \n\nPlease set a different rate for your ad.'
        );
    });
    it('should return the passed error_message when error_code is not "AdvertSameLimits" or "DuplicateAdvert"', () => {
        expect(generateErrorDialogBody('', 'this is the error message')).toBe('this is the error message');
    });
    it('should return "Something\'s not right" when error_code is not "AdvertSameLimits" or "DuplicateAdvert" and no error_message is passed', () => {
        expect(generateErrorDialogBody('')).toBe("Something's not right");
    });
});

describe('generateErrorDialogTitle', () => {
    it('should return "You already have an ad with this range" when error_code is "AdvertSameLimits"', () => {
        expect(generateErrorDialogTitle('AdvertSameLimits')).toBe('You already have an ad with this range');
    });
    it('should return "You already have an ad with this rate" when error_code is "DuplicateAdvert"', () => {
        expect(generateErrorDialogTitle('DuplicateAdvert')).toBe('You already have an ad with this rate');
    });
    it('should return "Something\'s not right" when error_code is not "AdvertSameLimits" or "DuplicateAdvert"', () => {
        expect(generateErrorDialogTitle('')).toBe("Something's not right");
    });
});

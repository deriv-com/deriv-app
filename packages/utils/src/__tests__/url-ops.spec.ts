import { isExternalLink } from '../url-ops';

describe('isExternalLink', () => {
    it('should return true if the link is external', () => {
        expect(isExternalLink('https://www.deriv.com')).toBeTruthy();
        expect(isExternalLink('http://www.deriv.com')).toBeTruthy();
        expect(isExternalLink('mailto://www.deriv.com')).toBeTruthy();
        expect(isExternalLink('ftp://test_doc.com')).toBeFalsy();
    });
});

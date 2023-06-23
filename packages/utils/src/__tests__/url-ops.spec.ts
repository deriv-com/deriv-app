import { isExternalLink } from '../url-ops';

describe('isExternalLink', () => {
    it('should return true if the link is external', () => {
        expect(isExternalLink('https://www.deriv.com')).toBeTruthy();
        expect(isExternalLink('www.deriv.com')).toBeFalsy();
        expect(isExternalLink('mailto://www.deriv.com')).toBeTruthy();
        expect(isExternalLink('sftp://test_doc.com')).toBeFalsy();
    });
});

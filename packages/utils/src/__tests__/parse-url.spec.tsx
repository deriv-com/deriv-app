import { isExternalLink } from '../parse-url';

describe('isExternalLink', () => {
    it('should return true if the link matches the regex for external link', () => {
        expect(isExternalLink('https://www.deriv.com')).toBeTruthy();
        expect(isExternalLink('mailto://www.deriv.com')).toBeTruthy();
    });

    it("should return false if the link dosen't match the for external link", () => {
        expect(isExternalLink('localhost.binary.sx')).toBeFalsy();
        expect(isExternalLink('sftp://test_doc.com')).toBeFalsy();
    });
});

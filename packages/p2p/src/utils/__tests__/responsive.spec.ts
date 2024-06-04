import { isMobile } from '@deriv/shared';
import { getTextSize, getIconSize, getInlineTextSize } from '../responsive';

jest.mock('@deriv/shared', () => ({
    isMobile: jest.fn(() => false),
}));

describe('getTextSize', () => {
    it('should return desktop size if isMobile is false', () => {
        expect(getTextSize('mobile', 'desktop')).toEqual('desktop');
    });

    it('should return mobile size if isMobile is true', () => {
        (isMobile as jest.Mock).mockImplementation(() => true);
        expect(getTextSize('mobile', 'desktop')).toEqual('mobile');
    });
});

describe('getIconSize', () => {
    it('should return mobile size if isMobile is true', () => {
        expect(getIconSize(20, 30)).toEqual(20);
    });

    it('should return desktop size if isMobile is false', () => {
        (isMobile as jest.Mock).mockImplementation(() => false);
        expect(getIconSize(20, 30)).toEqual(30);
    });
});

describe('getInlineTextSize', () => {
    it('should return mobile size if isMobile is true', () => {
        (isMobile as jest.Mock).mockImplementation(() => true);
        expect(getInlineTextSize('sm', 'xs')).toEqual('sm');
    });

    it('should return desktop size if isMobile is false', () => {
        (isMobile as jest.Mock).mockImplementation(() => false);
        expect(getInlineTextSize('sm', 'xs')).toEqual('xs');
    });
});

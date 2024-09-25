import { getInitialLanguage } from '@deriv-com/translations';
import { renderHook } from '@testing-library/react-hooks';
import useLanguage from '../useLanguage';

describe('useLanguage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (getInitialLanguage as jest.Mock).mockReturnValue('AR');
    });

    it('returns the preferred language if provided', () => {
        const { result } = renderHook(() => useLanguage('AR'));
        expect(result.current).toBe('AR');
    });

    it('updates language to the initial language from getInitialLanguage', () => {
        const { result } = renderHook(() => useLanguage('EN'));

        expect(result.current).toBe('AR');
        expect(getInitialLanguage).toHaveBeenCalled();
    });
});

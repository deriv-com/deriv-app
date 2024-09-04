import { useTranslations } from '@deriv-com/translations';
import { renderHook } from '@testing-library/react-hooks';
import useIsRtl from '../useIsRtl';

jest.mock('@deriv-com/translations', () => ({
    ...jest.requireActual('@deriv-com/translations'),
    useTranslations: jest.fn(),
}));

describe('useIsRtl', () => {
    beforeEach(() => {
        (useTranslations as jest.Mock).mockReturnValue({
            currentLang: 'EN',
        });
    });

    it('returns true when current language is AR', () => {
        (useTranslations as jest.Mock).mockReturnValue({
            currentLang: 'AR',
        });
        const { result } = renderHook(() => useIsRtl());

        expect(result.current).toBe(true);
    });

    it('returns false when current language is EN', () => {
        localStorage.setItem('i18n_language', 'EN');

        const { result } = renderHook(() => useIsRtl());

        expect(result.current).toBe(false);
    });

    it('returns false when current language is not set', () => {
        (useTranslations as jest.Mock).mockReturnValue({});
        const { result } = renderHook(() => useIsRtl());

        expect(result.current).toBe(false);
    });

    it('updates isRtl when current language changes', () => {
        const { rerender, result } = renderHook(() => useIsRtl());

        expect(result.current).toBe(false);

        (useTranslations as jest.Mock).mockReturnValue({
            currentLang: 'AR',
        });
        rerender();

        expect(result.current).toBe(true);
    });

    it('updates isRtl when language changes from AR to EN', () => {
        (useTranslations as jest.Mock).mockReturnValue({
            currentLang: 'AR',
        });
        const { rerender, result } = renderHook(() => useIsRtl());

        expect(result.current).toBe(true);

        (useTranslations as jest.Mock).mockReturnValue({
            currentLang: 'EN',
        });
        rerender();

        expect(result.current).toBe(false);
    });
});

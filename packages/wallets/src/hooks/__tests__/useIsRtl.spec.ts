import { renderHook } from '@testing-library/react-hooks';
import useIsRtl from '../useIsRtl';

describe('useIsRtl', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('returns true when language is set to AR in localStorage', () => {
        localStorage.setItem('i18n_language', 'AR');

        const { result } = renderHook(() => useIsRtl());

        expect(result.current).toBe(true);
    });

    it('returns false when language is set to EN in localStorage', () => {
        localStorage.setItem('i18n_language', 'EN');

        const { result } = renderHook(() => useIsRtl());

        expect(result.current).toBe(false);
    });

    it('returns false when i18n_language is not set in localStorage', () => {
        const { result } = renderHook(() => useIsRtl());

        expect(result.current).toBe(false);
    });

    it('updates isRtl when i18n_language changes in localStorage', () => {
        const { rerender, result } = renderHook(() => useIsRtl());

        expect(result.current).toBe(false);

        localStorage.setItem('i18n_language', 'AR');
        rerender();

        expect(result.current).toBe(true);
    });

    it('updates isRtl when language changes from AR to EN', () => {
        localStorage.setItem('i18n_language', 'AR');
        const { rerender, result } = renderHook(() => useIsRtl());

        expect(result.current).toBe(true);

        localStorage.setItem('i18n_language', 'EN');
        rerender();

        expect(result.current).toBe(false);
    });
});

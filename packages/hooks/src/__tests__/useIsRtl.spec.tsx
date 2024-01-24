import { renderHook } from '@testing-library/react-hooks';
import useIsRtl from '../useIsRtl';

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: () => ({
        i18n: {
            dir: jest.fn().mockImplementation(lang => (lang === 'ar' ? 'rtl' : 'ltr')),
            language: 'ar',
        },
    }),
}));

describe('useIsRtl', () => {
    it('should return true when language is RTL', () => {
        const { result } = renderHook(() => useIsRtl());

        expect(result.current).toBe(true);
    });
});

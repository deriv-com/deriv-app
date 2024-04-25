import { renderHook } from '@testing-library/react-hooks';
import useScript from '../useScript';

describe('useScript', () => {
    it('should add script with correct src attribute', () => {
        const URL = 'www.google.com';
        renderHook(() => useScript(URL));
        const { firstChild } = document.body;
        expect((firstChild as HTMLElement)?.getAttribute('src')).toContain(URL);
    });
});

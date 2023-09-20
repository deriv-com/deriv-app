import { act, renderHook } from '@testing-library/react-hooks';
import useToggle from '../useToggle';

describe('useToggle', () => {
    test('should return false', () => {
        const { result } = renderHook(() => useToggle());
        expect(result.current.state).toBe(false);
    });

    test('should return true', () => {
        const { result } = renderHook(() => useToggle(true));
        expect(result.current.state).toBe(true);
    });

    test('should return false, after toggle call should return true', () => {
        const { result } = renderHook(() => useToggle());

        expect(result.current.state).toBe(false);
        act(() => result.current.toggle());
        expect(result.current.state).toBe(true);
    });
});

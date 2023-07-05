import { renderHook, act } from '@testing-library/react-hooks';
import useLocalStorageData from '../useLocalStorageData';

describe('useLocalStorageData', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    test('should get the current value from localStorage when it exists', () => {
        const key = 'test_key';
        const value = 'some value';

        localStorage.setItem(key, JSON.stringify(value));

        const { result } = renderHook(() => useLocalStorageData(key));
        const [data] = result.current;

        expect(data).toBe(value);
    });

    test('should use the fallback value when localStorage key does not exist', () => {
        const key = 'non_existent_key';
        const fallbackValue = 'default value';

        const { result } = renderHook(() => useLocalStorageData(key, fallbackValue));
        const [data] = result.current;

        expect(data).toBe(fallbackValue);
    });

    test('should get null when localStorage key does not exist', () => {
        const key = 'non_existent_key';
        const { result } = renderHook(() => useLocalStorageData(key));
        const [, , clearData] = result.current;

        act(() => {
            clearData();
        });

        const [data] = result.current;
        expect(data).toBeNull();
    });

    test('should clear the localStorage key and reset to fallback value', () => {
        const key = 'test_key';
        const fallbackValue = 'default value';

        const { result } = renderHook(() => useLocalStorageData(key, fallbackValue));
        const [, setData, clearData] = result.current;

        act(() => {
            clearData();
        });

        expect(localStorage.getItem(key)).toBeNull();
        expect(result.current[0]).toBe(fallbackValue);

        act(() => {
            setData('new value');
        });

        expect(localStorage.getItem(key)).toBe(JSON.stringify('new value'));
        expect(result.current[0]).toBe('new value');
    });
});

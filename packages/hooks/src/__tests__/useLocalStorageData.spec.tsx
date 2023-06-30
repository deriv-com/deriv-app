import { act, renderHook } from '@testing-library/react-hooks';
import useLocalStorageData from '../useLocalStorageData';

describe('useLocalStorageData', () => {
    test('should initialize with existing data from localStorage', () => {
        const key = 'test_key';
        const existing_data = { existing: 'data' };
        localStorage.setItem(key, JSON.stringify(existing_data));
        const default_data = { default: 'value' };

        const { result } = renderHook(() => useLocalStorageData(key, default_data));

        expect(result.current[0]).toEqual(existing_data);
    });

    test('should update the data when setState function is called', () => {
        const key = 'test_key';
        const default_data = { default: 'value' };
        const updated_data = { default: 'updated' };

        const { result } = renderHook(() => useLocalStorageData(key, default_data));

        act(() => {
            result.current[1](updated_data);
        });

        expect(result.current[0]).toEqual(updated_data);
    });

    test('should clear the data when clear function is called', () => {
        const key = 'test_key';
        const default_data = { default: 'value' };
        const { result } = renderHook(() => useLocalStorageData(key, default_data));

        act(() => {
            result.current[2]();
        });

        expect(result.current[0]).toEqual(default_data);
        expect(localStorage.getItem(key)).toBeNull();
    });
});

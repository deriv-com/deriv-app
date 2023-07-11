import { RenderResult, act, renderHook } from '@testing-library/react-hooks';
import useInputDecimalFormatter from '../useInputDecimalFormatter';

const type = (
    input: RenderResult<ReturnType<typeof useInputDecimalFormatter>>,
    characters: string[],
    replace?: boolean
) => {
    characters.forEach(char => {
        let new_value = `${input.current.value}${char}`;

        if (replace) new_value = char;
        if (char === 'BACKSPACE') new_value = `${input.current.value.substring(0, input.current.value.length - 1)}`;

        act(() => input.current.onChange({ target: { value: new_value } }));
    });
};

describe('useInputDecimalFormatter', () => {
    test('should format the initial value correctly', () => {
        const { result } = renderHook(() => useInputDecimalFormatter(69.42));

        expect(result.current.value).toBe('69.42');
    });

    test('should only accept numbers', () => {
        const { result } = renderHook(() => useInputDecimalFormatter());

        type(result, ['-', 'f', '4', 'o', '*', '+', '2', '/', 'b', 'a', '0']);

        expect(result.current.value).toBe('420');
    });

    test('should only accept dot after zero if it starts with zero', () => {
        const { result } = renderHook(() => useInputDecimalFormatter());

        type(result, ['0', '6', '9', '.']);

        expect(result.current.value).toBe('0.');
    });

    test('should only accept three fractional digits after dot', () => {
        const { result } = renderHook(() => useInputDecimalFormatter(0, { fraction_digits: 3 }));

        type(result, ['0', '2', '0', '.', '8', 'x', '5', '4', '2', '0']);

        expect(result.current.value).toBe('0.854');
    });

    test('should only accept one dot', () => {
        const { result } = renderHook(() => useInputDecimalFormatter());

        type(result, ['0', '2', '0', '.', '8', '.', '5', '4']);

        expect(result.current.value).toBe('0.85');
    });

    test('should only accept dot after zero if it starts with signed zero', () => {
        const { result } = renderHook(() => useInputDecimalFormatter(0, { with_sign: true }));

        type(result, ['-', '0', '-', '6', '9', '.']);

        expect(result.current.value).toBe('-0.');
    });

    test('should accept negative sign', () => {
        const { result } = renderHook(() => useInputDecimalFormatter(0, { with_sign: true }));

        type(result, ['-', '6', '9', '.', '4', '2', '0']);

        expect(result.current.value).toBe('-69.42');
    });

    test('should accept positive sign', () => {
        const { result } = renderHook(() => useInputDecimalFormatter(0, { with_sign: true }));

        type(result, ['+', '6', '9', '.', '4', '2', '0']);

        expect(result.current.value).toBe('+69.42');
    });

    test('should only accept negative sign as starting character', () => {
        const { result } = renderHook(() => useInputDecimalFormatter(0, { with_sign: true }));

        type(result, ['-', '6', '9', '-', '4', '2', '0']);

        expect(result.current.value).toBe('-69420');
    });

    test('should only accept positive sign as starting character', () => {
        const { result } = renderHook(() => useInputDecimalFormatter(0, { with_sign: true }));

        type(result, ['+', '6', '9', '+', '4', '2', '0']);

        expect(result.current.value).toBe('+69420');
    });

    test('should work with random inputs', () => {
        const { result } = renderHook(() => useInputDecimalFormatter(0, { with_sign: true }));

        type(result, ['0.85', '', '-69', '00.00', 'foo', '+4.20'], true);

        expect(result.current.value).toBe('+4.20');
    });

    test('should not accept + or - signs after dot', () => {
        const { result } = renderHook(() => useInputDecimalFormatter(0, { with_sign: true }));

        type(result, ['+', '+.', '+.-', '+.0-', '+2.02'], true);

        expect(result.current.value).toBe('+2.02');
    });
});

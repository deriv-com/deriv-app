import { RenderResult, act, renderHook } from '@testing-library/react-hooks';
import useInputATMFormatter from '../useInputATMFormatter';

const type = (
    input: RenderResult<ReturnType<typeof useInputATMFormatter>>,
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

describe('useInputATMFormatter', () => {
    test('should format the initial value correctly when initial value is undefined', async () => {
        const { result } = renderHook(() => useInputATMFormatter());

        expect(result.current.value).toBe('0.00');
    });

    test('should format the initial value correctly when initial value is provided', async () => {
        const { result } = renderHook(() => useInputATMFormatter(1234.56));

        expect(result.current.value).toBe('1,234.56');
    });

    test('should format the initial value correctly when locale is es-ES', async () => {
        const { result } = renderHook(() => useInputATMFormatter(12345.678, { locale: 'es-ES' }));

        expect(result.current.value).toBe('12.345,67');
    });

    test('should shift the numbers to left while user is typing', () => {
        const { result } = renderHook(() => useInputATMFormatter());

        type(result, ['1', '2', '3', '4', '5']);

        expect(result.current.value).toBe('123.45');
    });

    test('should shift the numbers to left while user is typing with 3 fraction digits', () => {
        const { result } = renderHook(() => useInputATMFormatter(0, { fraction_digits: 3 }));

        type(result, ['1', '2', '3', '4', '5']);

        expect(result.current.value).toBe('12.345');
    });

    test('should shift the numbers correctly when user removes something while typing', () => {
        const { result } = renderHook(() => useInputATMFormatter());

        type(result, ['1', '2', '3', '4', 'BACKSPACE', '5']);

        expect(result.current.value).toBe('12.35');
    });

    test('should shift the numbers correctly when user changes something in the middle of the input', () => {
        const { result } = renderHook(() => useInputATMFormatter(0, { fraction_digits: 3 }));

        type(result, ['1', '2', '3', '4', 'BACKSPACE']);
        act(() => result.current.onChange({ target: { value: `${result.current.value.replace('2', '9')}` } }));
        type(result, ['5', 'BACKSPACE', '8']);

        expect(result.current.value).toBe('1.938');
    });

    test('should shift the numbers correctly when user types zeros', () => {
        const { result } = renderHook(() => useInputATMFormatter());

        type(result, ['1', '0', '1', '0', 'BACKSPACE', '1']);

        expect(result.current.value).toBe('10.11');
    });

    test('should format correctly on paste when decimal points are more than accepted', () => {
        const { result } = renderHook(() => useInputATMFormatter());

        type(result, ['1234.5678'], true);

        expect(result.current.value).toBe('1,234.56');
    });
});

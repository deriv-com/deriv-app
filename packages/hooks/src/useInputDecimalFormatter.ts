import { useCallback, useEffect, useState } from 'react';

type TOptions = {
    fraction_digits?: number;
    with_sign?: boolean;
};

const hasSign = (inputs: string[]) => {
    const left = inputs[0];
    const right = inputs.length > 1 ? inputs[1] : null;
    const has_right = right !== null && right !== '';

    // The field value is positive or negative sign or 0, So we return the new value without
    // any calculations.
    return ['-', '+', '0'].includes(left) && !has_right;
};

const hasDecimalPoint = (inputs: string[], value: string) => {
    const left = inputs[0];
    const new_left = left.replaceAll(/[+-]/g, '');
    const has_decimal = value.includes('.');

    return new_left.startsWith('0') && new_left.length !== 1 && !has_decimal;
};

const hasValidDecimalPlaces = (inputs: string[], fraction_digits: number) => {
    const right = inputs.length > 1 ? inputs[1] : null;
    const has_right = right !== null && right !== '';

    return has_right && right.length > fraction_digits;
};

const isNumber = (value: string) => !isNaN(Number(value));
const useInputDecimalFormatter = (initial?: number, options?: TOptions) => {
    const [value, setValue] = useState('');
    const { fraction_digits = 2, with_sign = false } = options || {};

    const onChange = useCallback(
        (e: DeepPartial<React.ChangeEvent<HTMLInputElement>> | React.ChangeEvent<HTMLInputElement>) => {
            setValue(old_value => {
                const new_value = e?.target?.value ?? '';
                const isEmpty = new_value === '';

                // The field has been cleared, So we return the new value.
                if (isEmpty) return new_value;

                const text = with_sign ? new_value : new_value.replaceAll(/[+-]/g, '');
                const inputs = text.split('.');

                if (hasSign(inputs)) return new_value;

                const hasMoreDots = inputs.length > 2;

                // The field contains more than one dot, So we return the old value as only one dot
                // is allowed.
                // The input value is not a valid number, So we return the old value.
                if (hasMoreDots || !isNumber(new_value)) return old_value;

                // The field starts with 0 but doesn't have decimal point, So we return the old value
                // as the only valid input at this step is decimal point.
                if (hasDecimalPoint(inputs, new_value)) return old_value;

                // The field have a decimal point and decimal places are already as allowed fraction
                // digits, So we remove the extra decimal digits from the right and return the new value.
                if (hasValidDecimalPlaces(inputs, fraction_digits)) {
                    const left = inputs[0];
                    const right = inputs[1];
                    const new_right = right.substring(0, fraction_digits);

                    return `${left}.${new_right}`;
                }

                return new_value;
            });
        },
        [fraction_digits, with_sign]
    );

    useEffect(() => {
        if (initial) onChange({ target: { value: `${initial}` } });
    }, [initial, onChange]);

    return { value, onChange };
};

export default useInputDecimalFormatter;

import { useCallback, useEffect, useState } from 'react';

type TOptions = {
    fraction_digits?: number;
    with_sign?: boolean;
};

const useInputDecimalFormatter = (initial?: number, options?: TOptions) => {
    const [value, setValue] = useState('');
    const { fraction_digits = 2, with_sign = false } = options || {};

    const onChange = useCallback(
        (e: DeepPartial<React.ChangeEvent<HTMLInputElement>> | React.ChangeEvent<HTMLInputElement>) => {
            setValue(old_value => {
                const new_value = e?.target?.value || '';
                const isEmpty = new_value === '';

                // The field has been cleared, So we return the new value.
                if (isEmpty) return new_value;

                const text = with_sign ? new_value : new_value.replaceAll(/[+-]/g, '');
                const inputs = text.split('.');

                // The field contains more than one dot, So we return the old value as only one dot
                // is allowed.
                if (inputs.length > 2) return old_value;

                const left = inputs[0];
                const right = inputs.length > 1 ? inputs[1] : null;
                const has_right = right !== null && right !== '';

                // The field value is positive or negative sign, So we return the new value without
                // any calculations.
                if ((left === '-' || left === '+') && !has_right) return new_value;

                // The field value is 0, So we return the new value without any calculations.
                if (left === '0' && !has_right) return new_value;

                const is_number = !isNaN(Number(new_value));

                // The input value is not a valid number, So we return the old value.
                if (!is_number) return old_value;

                const new_left = left.replaceAll(/[+-]/g, '');
                const has_decimal = new_value.includes('.');

                // The field starts with 0 but doesn't have decimal point, So we return the old value
                // as the only valid input at this step is decimal point.
                if (new_left.startsWith('0') && new_left.length !== 1 && !has_decimal) return old_value;

                // The field have a decimal point and decimal places are already as allowed fraction
                // digits, So we remove the extra decimal digits from the right and return the new value.
                if (has_right && right.length > fraction_digits) {
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

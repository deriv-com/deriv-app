import { useCallback, useEffect, useState } from 'react';

type TOptions = {
    fractionDigits?: number;
    withSign?: boolean;
};

const useInputDecimalFormatter = (initial?: number, options?: TOptions) => {
    const [value, setValue] = useState('');
    const { fractionDigits = 2, withSign = false } = options || {};

    const onChange = useCallback(
        (e: DeepPartial<React.ChangeEvent<HTMLInputElement>> | React.ChangeEvent<HTMLInputElement>) => {
            setValue(oldValue => {
                const newValue = e?.target?.value || '';
                const isEmpty = newValue === '';

                // The field has been cleared, So we return the new value.
                if (isEmpty) return newValue;

                const text = withSign ? newValue : newValue.replaceAll(/[+-]/g, '');
                const inputs = text.split('.');

                // The field contains more than one dot, So we return the old value as only one dot
                // is allowed.
                if (inputs.length > 2) return oldValue;

                const left = inputs[0];
                const right = inputs.length > 1 ? inputs[1] : null;
                const hasRight = right !== null && right !== '';

                // The field value is positive or negative sign, So we return the new value without
                // any calculations.
                if ((text[0] === '-' || text[0] === '+') && !hasRight) return newValue;

                // The field value is 0, So we return the new value without any calculations.
                if (left === '0' && !hasRight) return newValue;

                const isNumber = !isNaN(Number(newValue));

                // The input value is not a valid number, So we return the old value.
                if (!isNumber) return oldValue;

                const newLeft = left.replaceAll(/[+-]/g, '');
                const hasDecimal = newValue.includes('.');

                // The field starts with 0 but doesn't have decimal point, So we return the old value
                // as the only valid input at this step is decimal point.
                if (newLeft.startsWith('0') && newLeft.length !== 1 && !hasDecimal) return oldValue;

                // The field have a decimal point and decimal places are already as allowed fraction
                // digits, So we remove the extra decimal digits from the right and return the new value.
                if (fractionDigits) {
                    const newRight = `${right ?? ''}${'0'.repeat(fractionDigits)}`.slice(0, fractionDigits);

                    return `${left}.${newRight}`;
                }

                return newValue;
            });
        },
        [fractionDigits, withSign]
    );

    useEffect(() => {
        if (initial) onChange({ target: { value: `${initial}` } });
    }, [initial, onChange]);

    return { onChange, value };
};

export default useInputDecimalFormatter;

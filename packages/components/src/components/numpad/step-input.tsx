import React from 'react';
import classNames from 'classnames';
import { isCryptocurrency } from '@deriv/shared';
import Input from '../input/input';
import Button from '../button/button';

type TStepInput = {
    className?: string;
    max: number;
    min: number;
    value: string | number;
    onChange: (increment_value: string | number, pip_size: number) => void;
    render?: (props: { value: string; className: string }) => React.ReactNode;
    pip_size: number;
    currency: string;
    label?: string;
};

const getDecimals = (val: number | string) => {
    const array_value = typeof val === 'string' ? val.split('.') : val.toString().split('.');
    return array_value && array_value.length > 1 ? array_value[1].length : 0;
};

const StepInput = ({ className, max, min, value, onChange, render, pip_size = 0, currency }: TStepInput) => {
    const getSmallestScale = () => {
        const is_crypto = !!currency && isCryptocurrency(currency);
        const decimal_places = Number.isFinite(+value) ? getDecimals(value) : 0;
        if (is_crypto || (!currency && decimal_places)) {
            return parseFloat(String(1 * 10 ** (0 - decimal_places)));
        }
        return 1;
    };

    const smallest_scale = getSmallestScale();
    const is_gt_max = Number.isFinite(+max) && +value + smallest_scale > +max;
    const is_lt_min = Number.isFinite(+min) && +value - smallest_scale < +min;

    const increment = () => {
        if (is_gt_max) return;

        const parsed_value = parseFloat(value.toString());

        let increment_value;
        if (Number.isNaN(parsed_value)) {
            increment_value = min;
        } else {
            const decimal_places = Number.isFinite(+value) ? getDecimals(value) : 0;
            const is_crypto = !!currency && isCryptocurrency(currency);

            if (is_crypto || (!currency && decimal_places)) {
                const new_value = parseFloat(value.toString()) + parseFloat(String(1 * 10 ** (0 - decimal_places)));
                increment_value = parseFloat(new_value.toString()).toFixed(decimal_places);
            } else {
                increment_value = parsed_value + 1;
            }
        }

        onChange(increment_value, pip_size);
    };

    const decrement = () => {
        if (is_lt_min) return;

        const parsed_value = parseFloat(value.toString());

        let increment_value;
        if (Number.isNaN(parsed_value)) {
            increment_value = min;
        } else {
            const decimal_places = Number.isFinite(+value) ? getDecimals(value) : 0;
            const is_crypto = !!currency && isCryptocurrency(currency);

            if (is_crypto || (!currency && decimal_places)) {
                const new_value = parseFloat(value.toString()) - parseFloat(String(1 * 10 ** (0 - decimal_places)));
                increment_value = parseFloat(new_value.toString()).toFixed(decimal_places);
            } else {
                increment_value = parsed_value - 1;
            }
        }

        onChange(increment_value, pip_size);
    };

    return (
        <div className='dc-numpad__input-area'>
            <Button text='+' className='dc-numpad__increment' onClick={increment} is_disabled={is_gt_max} />
            <React.Fragment>
                {render &&
                    render({
                        value: value.toString(),
                        className: classNames('dc-numpad__input-field', className),
                    })}
            </React.Fragment>
            {!render && <Input className='dc-numpad__input-field' name='amount' value={value} readOnly />}
            <Button text='-' className='dc-numpad__decrement' onClick={decrement} is_disabled={is_lt_min} />
        </div>
    );
};

export default StepInput;

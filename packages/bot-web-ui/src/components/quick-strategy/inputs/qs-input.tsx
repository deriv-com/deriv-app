import React from 'react';
import classNames from 'classnames';
import { Input, Popover } from '@deriv/components';
import { localize } from '@deriv/translations';

type TQSInput = {
    value?: string | number;
    onChange?: (data: { [key: string]: string | number }) => void;
    type?: string;
    fullwidth?: boolean;
};

const QSInput: React.FC<TQSInput> = ({ value, onChange, type = 'text', fullwidth = false }) => {
    const [input_value, setValue] = React.useState(value);
    const error = false;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setValue(value);
        onChange?.({ amount: value });
    };

    return (
        <div className={classNames('qs__form__field', { 'full-width': fullwidth })}>
            <Popover
                alignment='bottom'
                message={localize('Enter an amount between 1 and 10000')}
                is_open={error}
                zIndex='9999'
                classNameBubble='qs__warning-bubble'
            >
                <Input
                    className={classNames('qs__input', { error })}
                    type={type}
                    leading_icon={<button>-</button>}
                    trailing_icon={<button>+</button>}
                    value={input_value}
                    onChange={handleChange}
                />
            </Popover>
        </div>
    );
};

export default QSInput;

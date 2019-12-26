import PropTypes    from 'prop-types';
import React        from 'react';
import classNames   from 'classnames';
import { Localize } from 'deriv-translation';
import Button       from 'Components/button';
import NumberGrid   from './number-grid.jsx';
import StepInput    from './step-input.jsx';

const concatenate = (number, default_value) => default_value.toString().concat(number);

const Numpad = ({
    className,
    is_regular,
    is_currency,
    max = 9999999,
    min = 0,
    pip_size,
    onSubmit,
    value,
}) => {
    const [is_float, setFloat] = React.useState(false);
    const [default_value, onChange] = React.useState(value);

    const onSelect = (num) => {
        switch (num) {
            case -1:
                chop();
                break;
            case '.':
                if (is_float) {
                    break;
                }
                setFloat(true);
                onChange(concatenate(num, default_value));
                break;
            default:
                if (default_value === 0) {
                    onChange(concatenate(num, ''));
                } else {
                    const regex   = /(?:\d+\.)(\d+)$/;
                    const matches = regex.exec(default_value);

                    if (matches !== null && is_float) {
                        matches.forEach((match, groupIndex) => {
                            if (groupIndex === 1 && match.length < pip_size && is_float) {
                                onChange(concatenate(num, default_value));
                            }
                        });
                    } else {
                        onChange(concatenate(num, default_value));
                    }
                }

                break;
        }
    };

    const chop = () => {
        if (default_value.toString().slice(-1) === '.') {
            setFloat(false);
        }
        onChange(default_value.toString().slice(0, -1));
    };

    const is_default_enabled = ![!!is_regular, !!is_currency].includes(true);
    React.useEffect(() => {
        if (is_currency && typeof pip_size === 'undefined') {
            // eslint-disable-next-line no-console
            console.error('Warning: property pip_size is required when using currency type <Numpad pip_size=\'2\' />');
        }
    });
    return (
        <div className={
            classNames('dc-numpad', className, {
                'dc-numpad--is-regular' : is_regular || is_default_enabled,
                'dc-numpad--is-currency': is_currency && !is_default_enabled,
            })}
        >
            <StepInput
                pip_size={pip_size}
                value={default_value}
                onChange={onChange}
                min={min}
                max={max}
            />
            <NumberGrid onSelect={onSelect} />
            {is_currency &&
            <Button
                type='secondary'
                className='dc-numpad__number'
                has_effect
                onClick={() => onSelect('.')}
            >.
            </Button>}
            <div
                className='dc-numpad__bkspace'
            >
                <Button
                    type='secondary'
                    has_effect
                    className='dc-numpad__number'
                    onClick={() => onSelect(-1)}
                >
                    ⌫
                </Button>
            </div>
            <div
                className='dc-numpad__ok'
            >
                <Button
                    type='secondary'
                    has_effect
                    className='dc-numpad__number'
                    onClick={() => {
                        onSubmit(default_value);
                    }}
                >
                    <Localize
                        i18n_default_text='OK'
                    />
                </Button>
            </div>
        </div>
    );
};

Numpad.propTypes = {
    currency   : PropTypes.string,
    is_currency: PropTypes.bool,
    is_regular : PropTypes.bool,
    max        : PropTypes.number,
    min        : PropTypes.number,
    onSubmit   : PropTypes.func,
    pip_size   : PropTypes.number,
    value      : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
};

export default Numpad;

import classNames from 'classnames';
import React from 'react';
import { toMoment } from '@deriv/shared';
import Icon from '../icon';
import Text from '../text';

const Native = ({
    id,
    disabled,
    display_format,
    name,
    error,
    hint,
    label,
    max_date,
    min_date,
    placeholder,
    onBlur,
    onFocus,
    onSelect,
    value,
    data_testid,
}) => {
    const [is_focused, setIsFocused] = React.useState(0);
    const input_ref = React.useRef();

    React.useEffect(() => {
        if (input_ref.current) input_ref.current.value = value;
    }, [value]);

    const handleFocus = e => {
        setIsFocused(true);
        if (typeof onFocus === 'function') {
            onFocus(e);
        }
    };

    const handleBlur = e => {
        setIsFocused(false);
        if (typeof onBlur === 'function') {
            onBlur(e);
        }
    };

    return (
        <div
            className={classNames('dc-input', {
                'dc-input--disabled': disabled,
                'dc-input--error': error,
                'dc-input--hint dc-datepicker--hint': hint,
            })}
        >
            <div
                className={classNames('dc-datepicker__container', {
                    'dc-datepicker__container--error': error,
                    'dc-datepicker__container--disabled': disabled,
                })}
            >
                <div className='dc-datepicker__display'>
                    {value && (
                        <Text
                            size='xs'
                            color={disabled ? 'disabled' : 'prominent'}
                            className={classNames('dc-datepicker__display-text', {
                                'dc-datepicker__display-text--disabled': disabled,
                            })}
                        >
                            {toMoment(value).format(display_format)}
                        </Text>
                    )}
                </div>
                <label
                    className={classNames('dc-datepicker__placeholder', {
                        'dc-datepicker__placeholder--has-value': !!value,
                        'dc-datepicker__placeholder--has-error': error,
                        'dc-datepicker__placeholder--is-focused': is_focused,
                    })}
                    htmlFor={id}
                >
                    {label || (!value && placeholder)}
                </label>

                <Icon icon='IcCalendar' className='dc-datepicker__calendar-icon' color={disabled && 'disabled'} />

                <input
                    ref={input_ref}
                    id={id}
                    name={name}
                    className='dc-datepicker__native'
                    type='date'
                    max={max_date && toMoment(max_date).format('YYYY-MM-DD')}
                    min={min_date && toMoment(min_date).format('YYYY-MM-DD')}
                    required
                    onBlur={handleBlur}
                    onFocus={handleFocus}
                    disabled={disabled}
                    data-testid={data_testid}
                    onChange={e => {
                        let new_value = e.target.value;
                        const moment_value = toMoment(new_value);

                        if (min_date) {
                            const moment_mindate = toMoment(min_date);
                            const days_diff = moment_mindate.diff(moment_value, 'days');

                            new_value = days_diff > 0 ? moment_mindate.format('YYYY-MM-DD') : new_value;
                        }

                        if (max_date) {
                            const moment_maxdate = toMoment(max_date);
                            const days_diff = moment_maxdate.diff(moment_value, 'days');

                            new_value = days_diff < 0 ? moment_maxdate.format('YYYY-MM-DD') : new_value;
                        }

                        if (input_ref.current) {
                            input_ref.current.value = new_value;
                        }

                        onSelect(new_value);
                    }}
                />
            </div>
            {error && (
                <Text size='xxs' styles={{ color: 'var(--brand-red-coral)' }} className='dc-datepicker__error'>
                    {error}
                </Text>
            )}
            {!error && hint && (
                <div className='dc-datepicker__hint'>
                    <Text as='p' color='less-prominent' size='xxs'>
                        {hint}
                    </Text>
                </div>
            )}
        </div>
    );
};

export default Native;

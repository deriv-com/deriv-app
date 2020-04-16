import classNames from 'classnames';
import React, { useState } from 'react';
import { toMoment } from '@deriv/shared/utils/date';
import Icon from 'Components/icon';

const Native = ({ id, display_format, name, error, label, max_date, min_date, onBlur, onFocus, onSelect, value }) => {
    const [is_focused, setIsFocused] = useState(0);

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
                'dc-input--error': error,
            })}
        >
            <div className='dc-datepicker__display'>
                {value && <span className='dc-datepicker__display-text'>{toMoment(value).format(display_format)}</span>}
            </div>
            <label
                className={classNames('dc-datepicker__placeholder', {
                    'dc-datepicker__placeholder--has-value': !!value,
                    'dc-datepicker__placeholder--has-error': error,
                    'dc-datepicker__placeholder--is-focused': is_focused,
                })}
                htmlFor={id}
            >
                {label}
            </label>
            <Icon icon='IcCalendar' className='dc-datepicker__calendar-icon' />
            <input
                id={id}
                name={name}
                className='dc-datepicker__native'
                type='date'
                max={max_date}
                min={min_date}
                error={error}
                required
                onBlur={handleBlur}
                onFocus={handleFocus}
                onChange={e => {
                    // fix for ios issue: clear button doesn't work
                    // https://github.com/facebook/react/issues/8938
                    const target = e.nativeEvent.target;
                    function iosClearDefault() {
                        target.defaultValue = '';
                    }
                    window.setTimeout(iosClearDefault, 0);
                    onSelect(e.target.value);
                }}
                value={value}
            />
            {error && <span className='dc-datepicker__error'>{error}</span>}
        </div>
    );
};

export default Native;

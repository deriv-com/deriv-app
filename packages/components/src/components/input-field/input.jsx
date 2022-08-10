import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { getCurrencyDisplayCode } from '@deriv/shared';

const Input = ({
    ariaLabel,
    changeValue,
    checked,
    className,
    classNameInlinePrefix,
    classNameDynamicSuffix,
    current_focus,
    data_value,
    data_tip,
    display_value,
    fractional_digits,
    id,
    inputmode,
    inline_prefix,
    is_autocomplete_disabled,
    is_disabled,
    is_hj_whitelisted,
    is_incrementable,
    is_read_only,
    max_length,
    name,
    onBlur,
    onClick,
    onKeyPressed,
    placeholder,
    required,
    setCurrentFocus,
    type,
    data_testid,
}) => {
    const ref = React.useRef();
    React.useEffect(() => {
        if (current_focus === name) {
            ref?.current?.focus();
        }
    }, [current_focus, name]);

    const onBlurHandler = e => {
        setCurrentFocus(null);
        if (onBlur) {
            onBlur(e);
        }
    };
    const onFocus = () => setCurrentFocus(name);

    const onChange = e => {
        /**
         * fix for Safari
         * we have to keep track of the current cursor position, update the value in store,
         * then reset the cursor position to the current cursor position
         */
        // TODO: find better ways to target browsers
        if (navigator.userAgent.indexOf('Safari') !== -1 && type !== 'checkbox') {
            const cursor = e.target.selectionStart;
            changeValue(e, evt => {
                evt.target.selectionEnd = cursor; // reset the cursor position in callback
            });
        } else {
            changeValue(e);
        }
    };

    return (
        <div className={classNameDynamicSuffix}>
            {!!inline_prefix && (
                <div className={classNameInlinePrefix}>
                    <span
                        className={classNames(classNameInlinePrefix ? `${classNameInlinePrefix}--symbol` : '', {
                            disabled: !!is_disabled,
                        })}
                    >
                        {inline_prefix === 'UST' ? getCurrencyDisplayCode(inline_prefix) : inline_prefix}
                    </span>
                </div>
            )}
            <input
                autoComplete={is_autocomplete_disabled ? 'off' : undefined}
                checked={checked}
                className={classNames(className)}
                data-for={`error_tooltip_${name}`}
                data-hj-whitelist={is_hj_whitelisted}
                data-tip={data_tip}
                data-testid={data_testid}
                data-value={data_value}
                disabled={is_disabled}
                id={id}
                maxLength={fractional_digits ? max_length + fractional_digits + 1 : max_length}
                name={name}
                onBlur={onBlurHandler}
                onChange={onChange}
                onClick={onClick}
                onFocus={onFocus}
                onKeyDown={is_incrementable ? onKeyPressed : undefined}
                placeholder={placeholder || undefined}
                readOnly={is_read_only}
                ref={ref}
                required={required || undefined}
                inputMode={inputmode}
                type={type === 'number' ? 'text' : type}
                value={display_value ?? ''}
                aria-label={ariaLabel}
                data-lpignore={type !== 'password'}
            />
        </div>
    );
};

Input.propTypes = {
    ariaLabel: PropTypes.string,
    changeValue: PropTypes.func,
    checked: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    className: PropTypes.string,
    classNameInlinePrefix: PropTypes.string,
    classNameDynamicSuffix: PropTypes.string,
    current_focus: PropTypes.string,
    data_testid: PropTypes.string,
    data_tip: PropTypes.string,
    data_value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    display_value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    fractional_digits: PropTypes.number,
    id: PropTypes.string,
    inline_prefix: PropTypes.string,
    is_autocomplete_disabled: PropTypes.bool,
    is_disabled: PropTypes.string,
    is_hj_whitelisted: PropTypes.bool,
    is_incrementable: PropTypes.bool,
    is_read_only: PropTypes.bool,
    max_length: PropTypes.number,
    name: PropTypes.string,
    onBlur: PropTypes.func,
    onClick: PropTypes.func,
    onKeyPressed: PropTypes.func,
    placeholder: PropTypes.string,
    required: PropTypes.bool,
    setCurrentFocus: PropTypes.func,
    type: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    inputmode: PropTypes.string,
};

export default Input;

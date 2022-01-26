import classNames from 'classnames';
import React from 'react';
import { getCurrencyDisplayCode } from '@deriv/shared';

type InputProps = {
    ariaLabel: string;
    changeValue: () => void;
    checked: unknown | number | string;
    className: string;
    classNameInlinePrefix: string;
    current_focus: string;
    data_tip: string;
    data_value: unknown | number | string;
    display_value: unknown | number | string;
    fractional_digits: number;
    id: string;
    inline_prefix: string;
    is_autocomplete_disabled: boolean;
    is_disabled: string;
    is_hj_whitelisted: boolean;
    is_incrementable: boolean;
    is_read_only: boolean;
    max_length: number;
    name: string;
    onClick: () => void;
    onKeyPressed: () => void;
    placeholder: string;
    required: boolean;
    setCurrentFocus: () => void;
    type: string;
    value: unknown | number | string;
};

const Input = ({
    ariaLabel,
    changeValue,
    checked,
    className,
    classNameInlinePrefix,
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
    onClick,
    onKeyPressed,
    placeholder,
    required,
    setCurrentFocus,
    type,
}: InputProps) => {
    const ref = React.createRef();
    React.useEffect(() => {
        if (current_focus === name) {
            ref.current.focus();
        }
    }, [current_focus, name]);

    const onBlur = () => setCurrentFocus(null);
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
        <React.Fragment>
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
                data-value={data_value}
                disabled={is_disabled}
                id={id}
                maxLength={fractional_digits ? max_length + fractional_digits + 1 : max_length}
                name={name}
                onBlur={onBlur}
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
                value={display_value || ''}
                aria-label={ariaLabel}
            />
        </React.Fragment>
    );
};

export default Input;

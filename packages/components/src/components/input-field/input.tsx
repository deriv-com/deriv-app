import classNames from 'classnames';
import React from 'react';
import { getCurrencyDisplayCode } from '@deriv/shared';
import { TInputMode } from './input-field';

type TInputProps = {
    ariaLabel: string;
    changeValue: (
        e: React.ChangeEvent<HTMLInputElement>,
        callback?: (evt: React.ChangeEvent<HTMLInputElement>) => void
    ) => void;
    checked?: boolean;
    className?: string;
    classNameDynamicSuffix?: string;
    classNameInlinePrefix?: string;
    current_focus: string;
    data_testid?: string;
    data_tip?: string;
    data_value?: number | string;
    display_value: number | string;
    fractional_digits: number;
    has_error?: boolean;
    id?: string;
    inline_prefix?: string;
    inputmode?: TInputMode;
    is_autocomplete_disabled: boolean;
    is_disabled?: boolean;
    is_hj_whitelisted: boolean;
    is_incrementable: boolean;
    is_read_only: boolean;
    max_length: number;
    name: string;
    onBlur?: React.FocusEventHandler<HTMLInputElement>;
    onClick?: React.MouseEventHandler<HTMLInputElement>;
    onClickInputWrapper?: React.MouseEventHandler<HTMLDivElement>;
    onKeyPressed: React.KeyboardEventHandler<HTMLInputElement>;
    placeholder?: string;
    required?: boolean;
    setCurrentFocus: (name: string | null) => void;
    type: string;
    value?: number | string;
};

const Input = ({
    ariaLabel,
    changeValue,
    checked,
    className,
    classNameDynamicSuffix,
    classNameInlinePrefix,
    current_focus,
    data_testid,
    data_tip,
    data_value,
    display_value,
    fractional_digits,
    id,
    inline_prefix,
    inputmode,
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
}: TInputProps) => {
    const ref = React.useRef<HTMLInputElement>(null);
    React.useEffect(() => {
        if (current_focus === name) {
            ref?.current?.focus();
        }
    }, [current_focus, name]);

    const onBlurHandler = (e: React.FocusEvent<HTMLInputElement>) => {
        setCurrentFocus(null);
        if (onBlur) {
            onBlur(e);
        }
    };
    const onFocus = () => setCurrentFocus(name);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        /**
         * fix for Safari
         * we have to keep track of the current cursor position, update the value in store,
         * then reset the cursor position to the current cursor position
         */
        // TODO: find better ways to target browsers
        if (navigator.userAgent.indexOf('Safari') !== -1 && type !== 'checkbox') {
            const cursor = e.target.selectionStart;
            changeValue(e, evt => {
                (evt as React.ChangeEvent<HTMLInputElement>).target.selectionEnd = cursor; // reset the cursor position in callback
            });
        } else {
            changeValue(e);
        }
    };

    return (
        <div className={classNameDynamicSuffix}>
            {inline_prefix ? (
                <div className={classNameInlinePrefix}>
                    <span
                        className={classNames(classNameInlinePrefix ? `${classNameInlinePrefix}--symbol` : '', {
                            disabled: !!is_disabled,
                        })}
                    >
                        {inline_prefix === 'UST' ? getCurrencyDisplayCode(inline_prefix) : inline_prefix}
                    </span>
                </div>
            ) : null}
            <input
                autoComplete={is_autocomplete_disabled ? 'off' : undefined}
                checked={checked}
                className={classNames(className)}
                data-for={`error_tooltip_${name}`}
                data-hj-whitelist={is_hj_whitelisted}
                data-tip={data_tip}
                data-testid={data_testid}
                data-value={data_value}
                disabled={!!is_disabled}
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

export default Input;

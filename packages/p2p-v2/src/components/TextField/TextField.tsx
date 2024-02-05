import React, { ChangeEvent, ComponentProps, forwardRef, Ref, useState } from 'react';
import classNames from 'classnames';
import HelperMessage, { HelperMessageProps } from './HelperMessage';
import './TextField.scss';

export interface TextFieldProps extends ComponentProps<'input'>, HelperMessageProps {
    defaultValue?: string;
    disabled?: boolean;
    errorMessage?: string[] | string;
    isInvalid?: boolean;
    label?: string;
    renderLeftIcon?: () => React.ReactNode;
    renderRightIcon?: () => React.ReactNode;
    shouldShowWarningMessage?: boolean;
    showMessage?: boolean;
}

const TextField = forwardRef(
    (
        {
            defaultValue = '',
            disabled,
            errorMessage,
            isInvalid,
            label,
            maxLength,
            message,
            messageVariant = 'general',
            name = 'textField',
            onChange,
            renderLeftIcon,
            renderRightIcon,
            shouldShowWarningMessage = false,
            showMessage = false,
            ...rest
        }: TextFieldProps,
        ref: Ref<HTMLInputElement>
    ) => {
        const [value, setValue] = useState(defaultValue);

        const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
            const newValue = e.target.value;
            setValue(newValue);
            onChange?.(e);
        };

        return (
            <div
                className={classNames('p2p-v2-textfield', {
                    'p2p-v2-textfield--disabled': disabled,
                    'p2p-v2-textfield--error': isInvalid,
                })}
            >
                <div className='p2p-v2-textfield__box'>
                    {typeof renderLeftIcon === 'function' && (
                        <div className='p2p-v2-textfield__icon-left'>{renderLeftIcon()}</div>
                    )}
                    <input
                        className='p2p-v2-textfield__field'
                        disabled={disabled}
                        id={name}
                        maxLength={maxLength}
                        onChange={handleChange}
                        placeholder={label}
                        ref={ref}
                        value={value}
                        {...rest}
                    />
                    {label && (
                        <label className='p2p-v2-textfield__label' htmlFor={name}>
                            {label}
                        </label>
                    )}
                    {typeof renderRightIcon === 'function' && (
                        <div className='p2p-v2-textfield__icon-right'>{renderRightIcon()}</div>
                    )}
                </div>
                <div className='p2p-v2-textfield__message-container'>
                    {showMessage && !isInvalid && (
                        <HelperMessage
                            inputValue={value}
                            maxLength={maxLength}
                            message={message}
                            messageVariant={messageVariant}
                        />
                    )}
                    {errorMessage && (isInvalid || (!isInvalid && shouldShowWarningMessage)) && (
                        <HelperMessage
                            inputValue={value}
                            isError={isInvalid}
                            maxLength={maxLength}
                            message={errorMessage as string}
                            messageVariant={isInvalid ? 'error' : 'warning'}
                        />
                    )}
                </div>
            </div>
        );
    }
);

TextField.displayName = 'TextField';
export default TextField;

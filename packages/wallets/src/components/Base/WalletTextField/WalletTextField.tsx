import React, { ChangeEvent, ComponentProps, forwardRef, Ref, useState } from 'react';
import classNames from 'classnames';
import { FormikErrors } from 'formik';
import HelperMessage, { HelperMessageProps } from './HelperMessage';
import './WalletTextField.scss';

export interface WalletTextFieldProps extends ComponentProps<'input'>, HelperMessageProps {
    defaultValue?: string;
    disabled?: boolean;
    errorMessage?: FormikErrors<unknown> | FormikErrors<unknown>[] | string[] | string;
    inputWidth?: string;
    isInvalid?: boolean;
    label?: string;
    renderLeftIcon?: () => React.ReactNode;
    renderRightIcon?: () => React.ReactNode;
    showMessage?: boolean;
    showMessageContainer?: boolean;
    typeVariant?: 'listcard' | 'normal';
}

const WalletTextField = forwardRef(
    (
        {
            defaultValue = '',
            disabled,
            errorMessage,
            inputWidth,
            isInvalid,
            label,
            maxLength,
            message,
            messageVariant = 'general',
            name = 'walletTextField',
            onChange,
            renderLeftIcon,
            renderRightIcon,
            showMessage = false,
            showMessageContainer = true,
            typeVariant = 'normal',
            ...rest
        }: WalletTextFieldProps,
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
                className={classNames(
                    `wallets-textfield ${typeVariant === 'listcard' ? 'wallets-textfield--listcard' : ''}`,
                    {
                        'wallets-textfield--disabled': disabled,
                        'wallets-textfield--error': isInvalid,
                    }
                )}
                data-testid='dt_wallets_textfield'
            >
                <div
                    className={`wallets-textfield__box ${
                        typeVariant === 'listcard' ? 'wallets-textfield__box--listcard' : ''
                    }`}
                    data-testid='dt_wallets_textfield_box'
                >
                    {typeof renderLeftIcon === 'function' && (
                        <div className='wallets-textfield__icon-left' data-testid='dt_wallets_textfield_icon_left'>
                            {renderLeftIcon()}
                        </div>
                    )}
                    <input
                        className={`wallets-textfield__field ${
                            typeVariant === 'listcard' ? 'wallets-textfield__field--listcard' : ''
                        }`}
                        disabled={disabled}
                        id={name}
                        maxLength={maxLength}
                        onChange={handleChange}
                        placeholder={label}
                        ref={ref}
                        style={{ width: inputWidth }}
                        value={value}
                        {...rest}
                    />
                    {label && (
                        <label className='wallets-textfield__label' htmlFor={name}>
                            {label}
                        </label>
                    )}
                    {typeof renderRightIcon === 'function' && (
                        <div
                            className={`wallets-textfield__icon-right ${
                                typeVariant === 'listcard' ? 'wallets-textfield__icon-right--listcard' : ''
                            }`}
                            data-testid='dt_wallets_textfield_icon_right'
                        >
                            {renderRightIcon()}
                        </div>
                    )}
                </div>
                {showMessageContainer && (
                    <div className='wallets-textfield__message-container'>
                        {errorMessage ? (
                            <HelperMessage
                                inputValue={value}
                                isError={isInvalid}
                                maxLength={maxLength}
                                message={errorMessage as string}
                                messageVariant={isInvalid ? 'error' : 'warning'}
                            />
                        ) : (
                            showMessage && (
                                <HelperMessage
                                    inputValue={value}
                                    maxLength={maxLength}
                                    message={message}
                                    messageVariant={messageVariant}
                                />
                            )
                        )}
                    </div>
                )}
            </div>
        );
    }
);

WalletTextField.displayName = 'WalletTextField';
export default WalletTextField;

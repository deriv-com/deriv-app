import React, { ChangeEvent, ComponentProps, forwardRef, Ref, useState } from 'react';
import classNames from 'classnames';
import { FormikErrors } from 'formik';
import HelperMessage, { HelperMessageProps } from './HelperMessage';
import './WalletTextField.scss';

export interface WalletTextFieldProps extends ComponentProps<'input'>, HelperMessageProps {
    defaultValue?: string;
    errorMessage?: FormikErrors<unknown> | FormikErrors<unknown>[] | string[] | string;
    isInvalid?: boolean;
    label?: string;
    renderLeftIcon?: () => React.ReactNode;
    renderRightIcon?: () => React.ReactNode;
    showMessage?: boolean;
}

const WalletTextField = forwardRef(
    (
        {
            defaultValue = '',
            isInvalid = false,
            label,
            maxLength,
            message,
            name = 'wallet-textfield',
            onChange,
            renderLeftIcon,
            renderRightIcon,
            showMessage = false,
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
                className={classNames('wallets-textfield', {
                    'wallets-textfield--error': isInvalid,
                })}
            >
                <div className='wallets-textfield__box'>
                    {typeof renderLeftIcon === 'function' && (
                        <div className='wallets-textfield__icon-left'>{renderLeftIcon()}</div>
                    )}
                    <input
                        className='wallets-textfield__field'
                        id={name}
                        maxLength={maxLength}
                        onChange={handleChange}
                        placeholder={label}
                        ref={ref}
                        value={value}
                        {...rest}
                    />
                    {label && (
                        <label className='wallets-textfield__label' htmlFor={name}>
                            {label}
                        </label>
                    )}
                    {typeof renderRightIcon === 'function' && (
                        <div className='wallets-textfield__icon-right'>{renderRightIcon()}</div>
                    )}
                </div>
                <div className='wallets-textfield__message-container'>
                    {showMessage && <HelperMessage inputValue={value} maxLength={maxLength} message={message} />}
                </div>
            </div>
        );
    }
);

WalletTextField.displayName = 'WalletTextField';
export default WalletTextField;

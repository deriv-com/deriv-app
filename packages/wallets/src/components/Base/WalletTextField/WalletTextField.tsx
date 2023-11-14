import React, { ChangeEvent, CSSProperties, forwardRef, InputHTMLAttributes, useState } from 'react';
import MessageContainer, { MessageContainerProps } from './HelperMessage';
import './WalletTextField.scss';

export interface WalletTextFieldProps extends InputHTMLAttributes<HTMLInputElement>, MessageContainerProps {
    defaultValue?: string;
    label?: string;
    maxWidth?: CSSProperties['maxWidth'];
    renderRightIcon?: () => React.ReactNode;
    showMessage?: boolean;
}

const WalletTextField = forwardRef<HTMLInputElement, WalletTextFieldProps>(
    (
        {
            defaultValue = '',
            helperMessage,
            label,
            maxLength,
            maxWidth = '33rem',
            name = 'wallet-textfield',
            onChange,
            renderRightIcon,
            showMessage = false,
            ...rest
        },
        ref
    ) => {
        const [value, setValue] = useState(defaultValue);

        const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
            const newValue = e.target.value;
            setValue(newValue);
            onChange?.(e);
        };

        return (
            <div className='wallets-textfield' style={{ maxWidth: `${maxWidth}` }}>
                <div className='wallets-textfield__box'>
                    <input
                        className='wallets-textfield__field'
                        id={name}
                        maxLength={maxLength}
                        onChange={handleChange}
                        placeholder={label}
                        value={value}
                        {...rest}
                        ref={ref}
                    />
                    {label && (
                        <label className='wallets-textfield__label' htmlFor={name}>
                            {label}
                        </label>
                    )}
                    {renderRightIcon && <div className='wallets-textfield__icon'>{renderRightIcon?.()}</div>}
                </div>
                <div className='wallets-textfield__message-container'>
                    {showMessage && (
                        <MessageContainer helperMessage={helperMessage} inputValue={value} maxLength={maxLength} />
                    )}
                </div>
            </div>
        );
    }
);

WalletTextField.displayName = 'WalletTextField';
export default WalletTextField;

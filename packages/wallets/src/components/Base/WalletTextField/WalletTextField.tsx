import React, { ChangeEvent, ComponentProps, FC, useState } from 'react';
import classNames from 'classnames';
import HelperMessage, { HelperMessageProps } from './HelperMessage';
import './WalletTextField.scss';

export interface WalletTextFieldProps extends ComponentProps<'input'>, HelperMessageProps {
    defaultValue?: string;
    inputClassName?: string;
    label?: string;
    renderRightIcon?: () => React.ReactNode;
    showMessage?: boolean;
}

const WalletTextField: FC<WalletTextFieldProps> = ({
    defaultValue = '',
    helperMessage,
    inputClassName,
    label,
    maxLength,
    name = 'wallet-textfield',
    onChange,
    renderRightIcon,
    showMessage = false,
    ...rest
}) => {
    const [value, setValue] = useState(defaultValue);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setValue(newValue);
        onChange?.(e);
    };

    return (
        <div className='wallets-textfield'>
            <div className={classNames('wallets-textfield__box', inputClassName)}>
                <input
                    className='wallets-textfield__field'
                    id={name}
                    maxLength={maxLength}
                    onChange={handleChange}
                    placeholder={label}
                    value={value}
                    {...rest}
                />
                {label && (
                    <label className='wallets-textfield__label' htmlFor={name}>
                        {label}
                    </label>
                )}
                <div className='wallets-textfield__icon'>{renderRightIcon?.()}</div>
            </div>
            <div className='wallets-textfield__message-container'>
                {showMessage && (
                    <HelperMessage helperMessage={helperMessage} inputValue={value} maxLength={maxLength} />
                )}
            </div>
        </div>
    );
};

WalletTextField.displayName = 'WalletTextField';
export default WalletTextField;

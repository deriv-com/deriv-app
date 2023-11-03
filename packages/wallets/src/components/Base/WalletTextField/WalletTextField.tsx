import React, { ChangeEvent, ComponentProps, ReactElement, useEffect, useState } from 'react';
import { WalletButton } from '../WalletButton';
import WalletText from '../WalletText/WalletText';
import './WalletTextField.scss';

interface WalletTextFieldProps {
    helperMessage?: string;
    icon?: ReactElement;
    id?: ComponentProps<'input'>['id'];
    label?: string;
    leftIcon?: React.ReactNode;
    maxLength?: ComponentProps<'input'>['maxLength'];
    onChange?: ComponentProps<'input'>['onChange'];
    onClick?: ComponentProps<'input'>['onClick'];
    onClickIcon?: ComponentProps<'button'>['onClick'];
    showMessage?: boolean;
    type?: ComponentProps<'input'>['type'];
    value?: string;
}

type MessageContainerProps = {
    helperMessage?: WalletTextFieldProps['helperMessage'];
    maxLength?: WalletTextFieldProps['maxLength'];
};

const WalletTextField: React.FC<WalletTextFieldProps> = ({
    helperMessage,
    icon,
    id = 'wallet-textfield',
    label,
    maxLength,
    onChange,
    onClick,
    onClickIcon,
    showMessage = false,
    type = 'text',
    value,
}) => {
    const [currentValue, setCurrentValue] = useState<WalletTextFieldProps['value']>(value);

    useEffect(() => {
        setCurrentValue(value);
    }, [value]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setCurrentValue(newValue);
        onChange?.(e);
    };

    const MessageContainer: React.FC<MessageContainerProps> = ({ helperMessage, maxLength }) => (
        <>
            {helperMessage && (
                <div className='wallets-textfield__message-container--msg'>
                    <WalletText color='less-prominent' size='xs'>
                        {helperMessage}
                    </WalletText>
                </div>
            )}
            {maxLength && currentValue && (
                <div className='wallets-textfield__message-container--maxchar'>
                    <WalletText align='right' color='less-prominent' size='xs'>
                        {currentValue.length} / {maxLength}
                    </WalletText>
                </div>
            )}
        </>
    );

    return (
        <div className='wallets-textfield' onClick={onClick}>
            <div className='wallets-textfield__content'>
                <input
                    className='wallets-textfield__field'
                    id={id}
                    maxLength={maxLength}
                    onChange={handleChange}
                    placeholder={label}
                    type={type}
                    value={currentValue}
                />
                {label && (
                    <label className='wallets-textfield__label' htmlFor={id}>
                        {label}
                    </label>
                )}
                {icon && <WalletButton icon={icon} onClick={onClickIcon} rounded='md' size='sm' variant='ghost' />}
            </div>
            <div className='wallets-textfield__message-container'>
                {showMessage && <MessageContainer helperMessage={helperMessage} maxLength={maxLength} />}
            </div>
        </div>
    );
};

export default WalletTextField;

import React, { ChangeEvent, ComponentProps, ReactElement, useState } from 'react';
import WalletText from '../WalletText/WalletText';
import styles from './WalletTextField.modules.css';

interface WalletTextFieldProps {
    defaultValue?: string;
    helperMessage?: string;
    icon?: ReactElement;
    id?: ComponentProps<'input'>['id'];
    label?: string;
    leftIcon?: React.ReactNode;
    maxLength?: ComponentProps<'input'>['maxLength'];
    onChange?: ComponentProps<'input'>['onChange'];
    showMessage?: boolean;
}

type MessageContainerProps = {
    helperMessage?: WalletTextFieldProps['helperMessage'];
    maxLength?: WalletTextFieldProps['maxLength'];
};

const WalletTextField: React.FC<WalletTextFieldProps> = ({
    defaultValue = '',
    helperMessage,
    icon,
    id = 'wallet-textfield',
    label,
    maxLength,
    onChange,
    showMessage = false,
}) => {
    const [value, setValue] = useState(defaultValue);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setValue(newValue);
        onChange?.(e);
    };

    const MessageContainer: React.FC<MessageContainerProps> = ({ helperMessage, maxLength }) => (
        <>
            {helperMessage && (
                <WalletText color='less-prominent' lineHeight='sm' size='xs' style={{ float: 'left' }}>
                    {helperMessage}
                </WalletText>
            )}
            {maxLength && (
                <WalletText align='right' color='less-prominent' lineHeight='sm' size='xs' style={{ float: 'right' }}>
                    {value.length} / {maxLength}
                </WalletText>
            )}
        </>
    );

    return (
        <div className={styles['wallets-textfield']}>
            <div className={styles['wallets-textfield__content']}>
                <input
                    className={styles['wallets-textfield__field']}
                    id={id}
                    maxLength={maxLength}
                    onChange={handleChange}
                    placeholder={label}
                    type='text'
                    value={value}
                />
                {label && (
                    <label className={styles['wallets-textfield__label']} htmlFor={id}>
                        {label}
                    </label>
                )}
                {icon && <div className={styles['wallets-textfield__icon']}>{icon}</div>}
            </div>
            <div className={styles['wallets-textfield__message-container']}>
                {showMessage && <MessageContainer helperMessage={helperMessage} maxLength={maxLength} />}
            </div>
        </div>
    );
};

export default WalletTextField;

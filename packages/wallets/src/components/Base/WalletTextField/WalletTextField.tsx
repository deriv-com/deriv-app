import React, { ChangeEvent, InputHTMLAttributes, ReactElement, useState } from 'react';
import classNames from 'classnames';
import WalletText from '../WalletText/WalletText';
import styles from './WalletTextField.modules.css';

interface WalletTextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    defaultValue?: string;
    helperMessage?: string;
    icon?: ReactElement;
    label?: string;
    leftIcon?: React.ReactNode;
    showMessage?: boolean;
}

const WalletTextField: React.FC<WalletTextFieldProps> = ({
    defaultValue = '',
    helperMessage,
    icon,
    label,
    showMessage = false,
    ...rest
}) => {
    const [value, setValue] = useState(defaultValue);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setValue(newValue);

        if (rest.onChange) {
            rest.onChange(e);
        }
    };

    const MessageContainer: React.FC<{ helperMessage?: string; maxLength?: number }> = ({
        helperMessage,
        maxLength,
    }) => (
        <>
            {helperMessage && (
                <WalletText color='less-prominent' lineHeight='sm' size='xs' style={{ float: 'left' }}>
                    {helperMessage}
                </WalletText>
            )}
            {maxLength !== undefined && (
                <WalletText align='right' color='less-prominent' lineHeight='sm' size='xs' style={{ float: 'right' }}>
                    {value.length} / {maxLength}
                </WalletText>
            )}
        </>
    );

    return (
        <div className={classNames(styles['wallets-textfield'])}>
            <div className={styles['wallets-textfield__content']}>
                <input
                    className={styles['wallets-textfield__field']}
                    onChange={handleChange}
                    placeholder={label}
                    type='text'
                    value={value}
                    {...rest}
                />
                {label && (
                    <label className={styles['wallets-textfield__label']} htmlFor={rest.id}>
                        {label}
                    </label>
                )}
                {icon && <div className={styles['wallets-textfield__icon']}>{icon}</div>}
            </div>
            <div className={styles['wallets-textfield__message-container']}>
                {showMessage && <MessageContainer helperMessage={helperMessage} maxLength={rest.maxLength} />}
            </div>
        </div>
    );
};

export default WalletTextField;

import React, { InputHTMLAttributes, useState } from 'react';
import classNames from 'classnames';
import WalletText from '../WalletText/WalletText';
import styles from './WalletTextField.modules.css';

interface WalletTextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    defaultValue?: string;
    helperMessage?: string;
    id: string;
    label?: string;
    leftIcon?: React.ReactNode;
    showHelperMessage?: boolean;
}

const WalletTextField: React.FC<WalletTextFieldProps> = ({
    defaultValue = '',
    helperMessage,
    id,
    label,
    leftIcon,
    showHelperMessage = false,
}) => {
    const [value, setValue] = useState(defaultValue);
    return (
        <div className={styles[`wallets-textfield`]}>
            <div className={styles[`wallets-textfield__content`]}>
                {leftIcon && <div className={styles[`wallets-textfield__icon`]}>{leftIcon}</div>}
                <input
                    className={styles['wallets-textfield__field']}
                    id={id}
                    onChange={e => setValue(e.target.value)}
                    placeholder={label}
                    type='text'
                    value={value}
                />
                {label && (
                    <label
                        className={classNames(styles[`wallets-textfield__label`], {
                            [styles[`wallets-textfield__label--with-icon`]]: !!leftIcon,
                        })}
                        htmlFor={id}
                    >
                        {label}
                    </label>
                )}
            </div>
            {showHelperMessage && (
                <div className={styles['wallets-textfield__message']}>
                    <WalletText color='less-prominent' size='xs'>
                        {helperMessage}
                    </WalletText>
                </div>
            )}
        </div>
    );
};

export default WalletTextField;

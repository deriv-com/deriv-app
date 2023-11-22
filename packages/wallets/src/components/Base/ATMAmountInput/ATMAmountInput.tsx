import React, { useCallback, useEffect, useRef, useState } from 'react';
import unFormatLocaleString from '@deriv/utils/src/unFormatLocaleString';
import useInputATMFormatter from '../../../hooks/useInputATMFormatter';
import { WalletText } from '../..';
import './ATMAmountInput.scss';

type TProps = {
    currency?: string;
    disabled?: boolean;
    fractionDigits?: number;
    label: string;
    locale?: Intl.LocalesArgument;
    maxDigits?: number;
    onChange?: (value: number) => void;
    onFocus?: VoidFunction;
    value: number;
};

const WalletTransferFormInputField: React.FC<TProps> = ({
    currency,
    disabled,
    fractionDigits = 0,
    label,
    locale,
    maxDigits,
    onChange,
    onFocus,
    value,
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isFocused, setIsFocused] = useState<boolean>(false);

    const {
        onChange: formatOnChange,
        onPaste: formatOnPaste,
        value: formattedValue,
    } = useInputATMFormatter(inputRef, value, {
        fractionDigits,
        locale,
        maxDigits,
    });

    useEffect(() => {
        onChange?.(Number(unFormatLocaleString(formattedValue, locale)));
    }, [formattedValue, locale, onChange]);

    const onFocusHandler = useCallback(() => {
        setIsFocused(true);
        onFocus?.();
    }, [onFocus]);

    return (
        <div className='wallets-atm-amount-input'>
            <WalletText size='sm'>{label}</WalletText>
            <div className='wallets-atm-amount-input__input-container'>
                <WalletText size='lg' weight='bold'>
                    <input
                        className='wallets-atm-amount-input__input'
                        disabled={disabled || isFocused}
                        value={`${formattedValue} ${currency || ''}`}
                    />
                    <input
                        className='wallets-atm-amount-input__input'
                        disabled={disabled}
                        onBlur={() => setIsFocused(false)}
                        onChange={formatOnChange}
                        onFocus={onFocusHandler}
                        onPaste={formatOnPaste}
                        ref={inputRef}
                        type='numeric'
                        value={formattedValue}
                    />
                </WalletText>
            </div>
        </div>
    );
};

export default WalletTransferFormInputField;

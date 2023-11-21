import React, { useEffect, useRef, useState } from 'react';
import unFormatLocaleString from '../../../../../../../../utils/src/unFormatLocaleString';
import { WalletText } from '../../../../../../components';
import useInputATMFormatter from '../../../../../../hooks/useInputATMFormatter';
import './TransferFormInputField.scss';

type TProps = {
    currency?: string;
    disabled?: boolean;
    fractionDigits?: number;
    label: string;
    locale?: Intl.LocalesArgument;
    maxDigits?: number;
    onChange?: (value: number) => void;
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

    return (
        <div className='wallets-transfer-form-input-field'>
            <WalletText size='sm'>{label}</WalletText>
            <div className='wallets-transfer-form-input-field__input-container'>
                <WalletText size='lg' weight='bold'>
                    <input
                        className='wallets-transfer-form-input-field__input'
                        disabled={disabled || isFocused}
                        value={`${formattedValue} ${currency || ''}`}
                    />
                    <input
                        className='wallets-transfer-form-input-field__input'
                        disabled={disabled}
                        onBlur={() => setIsFocused(false)}
                        onChange={formatOnChange}
                        onFocus={() => setIsFocused(true)}
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

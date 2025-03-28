import React, { useCallback } from 'react';
import classnames from 'classnames';
import { Text } from '@deriv-com/ui';
import './WalletTransferAmountInput.scss';

type TProps = {
    currency?: string;
    disabled?: boolean;
    fractionDigits?: number;
    isError?: boolean;
    label: string;
    maxDigits?: number;
    onBlur?: VoidFunction;
    onChange: (value: string) => void;
    onFocus?: VoidFunction;
    value: string;
};

const WalletTransferFormInputField: React.FC<TProps> = ({
    currency,
    disabled,
    fractionDigits = 0,
    isError,
    label,
    maxDigits,
    onBlur,
    onChange,
    onFocus,
    value,
}) => {
    const placeholder = currency ? `${(0).toFixed(fractionDigits)} ${currency}` : '0';

    const onBlurHandler = useCallback(() => {
        onBlur?.();

        // Show proper value with decimal point
        const displayValue =
            value === '.' || Number(value) === 0 ? '' : Number.parseFloat(value).toFixed(fractionDigits ?? 0);
        onChange(displayValue);
    }, [onBlur, onChange, value, fractionDigits]);

    return (
        <div className='wallets-atm-amount-input'>
            <Text align='start' className='wallets-atm-amount-input__label' size='sm'>
                {label}
            </Text>
            <div className='wallets-atm-amount-input__input-container'>
                <Text align='start' size='lg' weight='bold'>
                    {value !== '' ? (
                        <input
                            className={classnames('wallets-atm-amount-input__input', {
                                'wallets-atm-amount-input__input--error': isError,
                            })}
                            disabled={disabled}
                            maxLength={maxDigits}
                            readOnly
                            value={`${value} ${currency ?? ''}`}
                        />
                    ) : null}
                    <input
                        className={classnames('wallets-atm-amount-input__input', {
                            'wallets-atm-amount-input__input--error': isError,
                        })}
                        disabled={disabled}
                        maxLength={maxDigits}
                        onBlur={onBlurHandler}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            onChange(e.currentTarget.value);
                        }}
                        onFocus={onFocus}
                        onPaste={(e: React.ClipboardEvent<HTMLInputElement>) => {
                            e.preventDefault();
                            let pastedValue = e.clipboardData.getData('text');
                            // Remove commas
                            pastedValue = pastedValue.replace(/,/g, '');
                            onChange(pastedValue);
                        }}
                        placeholder={placeholder}
                        type='tel'
                        value={value}
                    />
                </Text>
            </div>
        </div>
    );
};

export default WalletTransferFormInputField;

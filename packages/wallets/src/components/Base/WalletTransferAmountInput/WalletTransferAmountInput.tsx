import React, { useCallback } from 'react';
import classnames from 'classnames';
import { Text } from '@deriv-com/ui';
import './WalletTransferAmountInput.scss';

const DASH_VALUE = '--';

type TProps = {
    currency?: string;
    disabled?: boolean;
    fractionDigits?: number;
    isError?: boolean;
    isLastFocusedField?: boolean;
    label: string;
    maxDigits: number;
    onBlur: VoidFunction;
    onChange: (value: string) => void;
    onFocus: (e: React.FocusEvent<HTMLInputElement>) => void;
    value: string;
};

const WalletTransferFormInputField: React.FC<TProps> = ({
    currency,
    disabled,
    fractionDigits = 0,
    isError,
    isLastFocusedField,
    label,
    maxDigits,
    onBlur,
    onChange,
    onFocus,
    value,
}) => {
    const placeholder = currency ? `${(0).toFixed(fractionDigits)} ${currency}` : '0';
    const shouldShowDash = !disabled && isError && !isLastFocusedField && value !== '';
    const displayValue = shouldShowDash ? DASH_VALUE : value.substring(0, maxDigits);

    const onBlurHandler = useCallback(() => {
        onBlur();

        // Show proper value with decimal point on blur
        const isDotOrZero = value === '.' || Number(value) === 0;
        const displayValue = isDotOrZero ? '' : Number.parseFloat(value).toFixed(fractionDigits ?? 0);

        onChange(displayValue);
    }, [onBlur, onChange, value, fractionDigits]);

    const onPasteHandler = useCallback(
        (e: React.ClipboardEvent<HTMLInputElement>) => {
            e.preventDefault();
            let pastedValue = e.clipboardData.getData('text').substring(0, maxDigits);
            pastedValue = pastedValue.replace(/,/g, '');
            onChange(Number(pastedValue).toFixed(fractionDigits));
        },
        [maxDigits, onChange, fractionDigits]
    );

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
                            value={`${displayValue} ${currency ?? ''}`}
                        />
                    ) : null}
                    <input
                        className={classnames('wallets-atm-amount-input__input', {
                            'wallets-atm-amount-input__input--error': !disabled && isError,
                        })}
                        disabled={disabled}
                        maxLength={maxDigits}
                        onBlur={onBlurHandler}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            onChange(e.currentTarget.value);
                        }}
                        onFocus={onFocus}
                        onPaste={onPasteHandler}
                        placeholder={placeholder}
                        type='tel'
                        value={displayValue}
                    />
                </Text>
            </div>
        </div>
    );
};

export default WalletTransferFormInputField;

import React, { useCallback, useRef } from 'react';
import classnames from 'classnames';
// import unFormatLocaleString from '@deriv/utils/src/unFormatLocaleString';
import { Text } from '@deriv-com/ui';
// import useInputATMFormatter from '../../../hooks/useInputATMFormatter';
import './ATMAmountInput.scss';

type TProps = {
    currency?: string;
    disabled?: boolean;
    fractionDigits?: number;
    isError?: boolean;
    label: string;
    maxDigits?: number;
    onBlur?: VoidFunction;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onFocus?: VoidFunction;
    value: number;
};

const WalletTransferFormInputField: React.FC<TProps> = ({
    currency,
    disabled,
    isError,
    label,
    onBlur,
    onChange,
    onFocus,
    value,
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    // const [isFocused, setIsFocused] = useState<boolean>(false);

    // const {
    //     onChange: formatOnChange,
    //     onKeyDown,
    //     onKeyUp,
    //     onPaste: formatOnPaste,
    //     value: formattedValue,
    // } = useInputATMFormatter(inputRef, value, {
    //     fractionDigits,
    //     locale: 'en-US',
    //     maxDigits,
    // });

    // useEffect(() => {
    //     onChange?.(value);
    // }, [value, onChange]);

    const onFocusHandler = useCallback(() => {
        onFocus?.();
    }, [onFocus]);

    const onBlurHandler = useCallback(() => {
        onBlur?.();
    }, [onBlur]);

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange?.(e);
    };

    return (
        <div className='wallets-atm-amount-input'>
            <Text align='start' className='wallets-atm-amount-input__label' size='sm'>
                {label}
            </Text>
            <div className='wallets-atm-amount-input__input-container'>
                <Text align='start' className='wallets-atm-amount-input__field' size='lg' weight='bold'>
                    <input
                        className={classnames('wallets-atm-amount-input__input', {
                            'wallets-atm-amount-input__input--error': isError,
                        })}
                        disabled={disabled}
                        onBlur={onBlurHandler}
                        onChange={onChangeHandler}
                        onFocus={onFocusHandler}
                        // onKeyDown={onKeyDown}
                        // onKeyUp={onKeyUp}
                        // onPaste={formatOnPaste}
                        ref={inputRef}
                        step='any'
                        type='number'
                        value={value}
                    />
                    <div> {currency ?? ''}</div>
                </Text>
            </div>
        </div>
    );
};

export default WalletTransferFormInputField;

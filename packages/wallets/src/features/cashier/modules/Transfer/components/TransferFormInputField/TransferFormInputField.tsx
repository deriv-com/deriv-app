import React, { useEffect, useRef, useState } from 'react';
import { WalletText } from '../../../../../../components/Base';
import useInputATMFormatter from '../../../../../../hooks/useInputATMFormatter';
import './TransferFormInputField.scss';

type TProps = {
    currency?: string;
    disabled?: boolean;
    fractionDigits?: number;
    label: string;
    maxDigits?: number;
    onChange?: (value: number) => void;
    value: number;
};

const WalletTransferFormInputField: React.FC<TProps> = ({
    currency,
    disabled,
    fractionDigits = 0,
    label,
    maxDigits,
    onChange,
    value,
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const input = inputRef.current;

    const [isFocused, setIsFocused] = useState(false);
    const [caret, setCaret] = useState<number>();

    const { onChange: formatOnChange, value: formattedValue } = useInputATMFormatter(value, {
        fractionDigits,
    });
    const [prevFormattedValue, setPrevFormattedValue] = useState<string>(formattedValue);

    useEffect(() => {
        setPrevFormattedValue(formattedValue);
        onChange?.(Number(formattedValue));
    }, [formattedValue, onChange]);

    // keep the caret from jumping
    useEffect(() => {
        if (caret) input?.setSelectionRange(formattedValue.length - 1 - caret, formattedValue.length - 1 - caret);
    }, [caret, formattedValue, input]);

    // override some editing behavior for better UX
    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!input) return;
        if (maxDigits && input.value.replace(/[.,]/g, '').length > maxDigits) return;
        if (
            input.value.length + 1 === prevFormattedValue.length &&
            input.value.replaceAll(/[,.]/g, '') === prevFormattedValue.replaceAll(/[,.]/g, '')
        )
            return;

        setCaret(input.value.length - 1 - (input.selectionStart || 0));
        formatOnChange(e);
    };

    // override some keyboard behavior for better UX
    const onKeyEvent: React.KeyboardEventHandler<HTMLInputElement> = e => {
        // check if it's an arrow key and if selectionStart is to the immediate right of a point/comma
        if (input?.selectionStart && e.key.startsWith('Arrow') && !/^\d$/.test(input.value[input.selectionStart - 1])) {
            // if moving right, move one extra character, otherwise move left one character
            const adjustedSelectionStart = e.key === 'ArrowRight' ? input.selectionStart + 1 : input.selectionStart - 1;
            input.setSelectionRange(adjustedSelectionStart, adjustedSelectionStart);
        }
    };

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
                        onChange={onChangeHandler}
                        onFocus={() => setIsFocused(true)}
                        onKeyDown={onKeyEvent}
                        onKeyUp={onKeyEvent}
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

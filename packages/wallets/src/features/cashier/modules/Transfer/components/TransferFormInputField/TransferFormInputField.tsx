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

    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [caretNeedsRepositioning, setCaretNeedsRepositioning] = useState<boolean>(false);
    const [caret, setCaret] = useState<number>();

    const {
        onChange: formatOnChange,
        onPaste: formatOnPaste,
        value: formattedValue,
    } = useInputATMFormatter(value, {
        fractionDigits,
    });
    const [prevFormattedValue, setPrevFormattedValue] = useState<string>(formattedValue);

    useEffect(() => {
        setPrevFormattedValue(formattedValue);
        onChange?.(Number(formattedValue.replace));
    }, [caretNeedsRepositioning, formattedValue, onChange]);

    // keep the caret from jumping
    useEffect(() => {
        if (caret && caretNeedsRepositioning) {
            input?.setSelectionRange(formattedValue.length - caret, formattedValue.length - caret);
            setCaretNeedsRepositioning(false);
        }
    }, [caret, formattedValue, caretNeedsRepositioning, input]);

    // override some editing behavior for better UX
    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!input) return;
        setCaret(input.value.length - (input.selectionStart || 0));
        setCaretNeedsRepositioning(true);
        if (maxDigits && input.value.replace(/[.,]/g, '').length > maxDigits) return;
        if (
            input.value.length + 1 === prevFormattedValue.length &&
            input.value.replaceAll(/[,.]/g, '') === prevFormattedValue.replaceAll(/[,.]/g, '')
        )
            return;
        formatOnChange(e);
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

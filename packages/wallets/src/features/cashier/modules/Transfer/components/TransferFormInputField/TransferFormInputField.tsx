import React, { useEffect, useRef, useState } from 'react';
import unFormatLocaleString from '../../../../../../../../utils/src/unFormatLocaleString';
import { WalletText } from '../../../../../../components/Base';
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

const separatorRegex = /[,.]/g;

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
        locale,
    });
    const [prevFormattedValue, setPrevFormattedValue] = useState<string>(formattedValue);

    useEffect(() => {
        setPrevFormattedValue(formattedValue);
        onChange?.(Number(unFormatLocaleString(formattedValue, locale)));
    }, [caretNeedsRepositioning, formattedValue, locale, onChange]);

    // keep the caret from jumping
    useEffect(() => {
        if (caret && caretNeedsRepositioning && input) {
            const indexBeforeCaret = formattedValue.length - 1 - caret;

            // if before a comma or period, prefer positioning the caret to the left of it
            const newCaretPosition = separatorRegex.test(formattedValue[indexBeforeCaret])
                ? indexBeforeCaret - 1
                : indexBeforeCaret;

            input.setSelectionRange(newCaretPosition, newCaretPosition);
            setCaretNeedsRepositioning(false);
        }
    }, [caret, formattedValue, caretNeedsRepositioning, input]);

    // override some editing behavior for better UX
    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!input) return;

        const newCaretPosition = input.value.length - (input.selectionStart ?? 0);
        setCaret(newCaretPosition);
        setCaretNeedsRepositioning(true);

        if (maxDigits && input.value.replace(separatorRegex, '').length > maxDigits) return;

        const hasNoChangeInDigits =
            input.value.length + 1 === prevFormattedValue.length &&
            input.value.replaceAll(separatorRegex, '') === prevFormattedValue.replaceAll(separatorRegex, '');
        if (hasNoChangeInDigits) return;
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

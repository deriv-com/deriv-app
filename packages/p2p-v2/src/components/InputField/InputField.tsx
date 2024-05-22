import React, { ChangeEvent, FocusEventHandler, KeyboardEvent, MouseEvent, TouchEvent, useRef, useState } from 'react';
import { LabelPairedMinusSmBoldIcon, LabelPairedPlusSmBoldIcon } from '@deriv/quill-icons';
import { Button, Input, Text, useDevice } from '@deriv-com/ui';
import './InputField.scss';

export type TChangeEvent = ChangeEvent<HTMLInputElement>;

type TInputField = {
    decimalPointChange?: number;
    isError?: boolean;
    name?: string;
    onBlur?: FocusEventHandler<HTMLInputElement>;
    onChange?: (e: TChangeEvent) => void;
    type?: string;
    value: number | string;
};

const InputField = ({ decimalPointChange, isError, name = '', onBlur, onChange, type = '', value }: TInputField) => {
    const { isMobile } = useDevice();
    const [localValue, setLocalValue] = useState<string>();
    const intervalRef = useRef<ReturnType<typeof setInterval>>();
    const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
    const isLongPressRef = useRef(false);

    const handleButtonPress = (
        onChange: (e: MouseEvent<HTMLButtonElement> | TouchEvent<HTMLButtonElement>, step: number) => void
    ) => {
        const handleTimeout = (ev: MouseEvent<HTMLButtonElement> | TouchEvent<HTMLButtonElement>) => {
            timeoutRef.current = setTimeout(() => {
                isLongPressRef.current = true;
                let step = 1;
                onChange(ev, step);
                intervalRef.current = setInterval(() => {
                    onChange(ev, ++step);
                }, 50);
            }, 300);
        };

        return (ev: MouseEvent<HTMLButtonElement> | TouchEvent<HTMLButtonElement>) => {
            handleTimeout(ev);
        };
    };

    const handleButtonRelease = () => {
        clearInterval(intervalRef.current);
        clearTimeout(timeoutRef.current);

        if (onLongPressEnd && isLongPressRef.current) onLongPressEnd();

        isLongPressRef.current = false;
    };

    const getPressEvents = (
        onChange: (e: MouseEvent<HTMLButtonElement> | TouchEvent<HTMLButtonElement>, step: number) => void
    ) => {
        return {
            onContextMenu: (e: MouseEvent<HTMLButtonElement> | TouchEvent<HTMLButtonElement>) => e.preventDefault(),
            onMouseDown: handleButtonPress(onChange),
            onMouseUp: handleButtonRelease,
            onTouchEnd: handleButtonRelease,
            onTouchStart: handleButtonPress(onChange),
        };
    };

    const changeValue = (e: ChangeEvent<HTMLInputElement>, callback?: (evt: ChangeEvent<HTMLInputElement>) => void) => {
        if (e.target.value === value && type !== 'checkbox') {
            return;
        }

        if (type === 'number' || type === 'tel') {
            const isEmpty = !e.target.value || e.target.value === '' || e.target.value === '  ';
            const signedRegex = '^([+-.0-9])';
            e.target.value = e.target.value.replace(',', '.');

            const isNumber = new RegExp(`${signedRegex}(\\d*)?${'(\\.\\d+)?'}$`).test(e.target.value);

            const isNotCompletedNumber = new RegExp(`${signedRegex}(\\.|\\d+\\.)?$`).test(e.target.value);

            if (isNumber || isEmpty) {
                (e.target.value as number | string) = e.target.value;
            } else if (!isNotCompletedNumber) {
                (e.target.value as number | string) = value;
                return;
            }
        }

        onChange?.(e);
        if (callback) {
            callback(e);
        }
    };

    const getDecimals = (val: number | string) => {
        const arrayValue = typeof val === 'string' ? val.split('.') : val.toString().split('.');
        return arrayValue && arrayValue.length > 1 ? arrayValue[1].length : 0;
    };

    const incrementValue = () => {
        const currentValue = localValue || value.toString();

        const decimalPlaces = currentValue ? getDecimals(currentValue) : 0;

        const newValue =
            parseFloat(currentValue || '0') +
            parseFloat((1 * 10 ** (0 - (decimalPointChange ?? decimalPlaces))).toString());
        const incrementValue = parseFloat(newValue.toString()).toFixed(decimalPointChange ?? decimalPlaces);

        updateValue(incrementValue);
    };

    const calculateDecrementedValue = () => {
        const currentValue = localValue || value?.toString();

        const decimalPlaces = currentValue ? getDecimals(currentValue) : 0;
        const newValue =
            parseFloat(currentValue || '0') -
            parseFloat((1 * 10 ** (0 - (decimalPointChange ?? decimalPlaces))).toString());
        const decrementValue = parseFloat(newValue.toString()).toFixed(decimalPointChange ?? decimalPlaces);

        return decrementValue;
    };

    const decrementValue = () => {
        const decrementValue = calculateDecrementedValue();

        updateValue(decrementValue);
    };

    const updateValue = (newValue: string) => {
        let formattedValue = newValue;

        if (/^\d+/.test(formattedValue) && +formattedValue > 0) {
            formattedValue = `+${formattedValue}`;
        }
        onChange?.({ target: { value: formattedValue, name } });
    };

    const onLongPressEnd = () => {
        const newValue = localValue;
        const formattedValue = newValue;
        onChange?.({ target: { value: formattedValue || '', name } });

        setLocalValue('');
    };

    const onKeyPressed = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.keyCode === 38) incrementValue(); // up-arrow pressed
        if (e.keyCode === 40) decrementValue(); // down-arrow pressed
    };

    const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
        if (navigator.userAgent.indexOf('Safari') !== -1 && type !== 'checkbox') {
            const cursor = e.target.selectionStart;
            changeValue(e, evt => {
                evt.target.selectionEnd = cursor; // reset the cursor position in callback
            });
        } else {
            changeValue(e);
        }
    };

    return (
        <div className='p2p-v2-input-field'>
            <div className='p2p-v2-input-field__prefix'>
                <Text size={isMobile ? 'md' : 'sm'}>%</Text>
            </div>
            <Input
                autoComplete='off'
                className='items-center h-16 text-center lg:text-right'
                error={isError}
                hideMessage
                leftPlaceholder={
                    <Button
                        className='px-4 border-none'
                        color='white'
                        onClick={decrementValue}
                        type='button'
                        variant='outlined'
                        {...getPressEvents(decrementValue)}
                    >
                        <LabelPairedMinusSmBoldIcon data-testid='dt_p2p_v2_input_field_decrement' />
                    </Button>
                }
                onBlur={onBlur}
                onChange={onChangeValue}
                onKeyDown={onKeyPressed}
                rightPlaceholder={
                    <Button
                        className='px-4 border-none'
                        color='white'
                        onClick={incrementValue}
                        type='button'
                        variant='outlined'
                        {...getPressEvents(incrementValue)}
                    >
                        <LabelPairedPlusSmBoldIcon data-testid='dt_p2p_v2_input_field_increment' />
                    </Button>
                }
                value={value}
                wrapperClassName='lg:w-auto w-full'
            />
        </div>
    );
};

export default InputField;

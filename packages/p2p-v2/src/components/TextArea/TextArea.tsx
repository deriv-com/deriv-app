import React, { HtmlHTMLAttributes, useState } from 'react';
import clsx from 'clsx';
import { Text } from '@deriv-com/ui/dist/components/Text';
import './TextArea.scss';

type TTextAreaProps = HtmlHTMLAttributes<HTMLTextAreaElement> & {
    hint?: string;
    isInvalid?: boolean;
    label?: string;
    onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
    placeholder?: string;
    shouldShowCounter?: boolean;
    value?: string;
};
const TextArea = ({
    hint,
    isInvalid = false,
    label,
    onChange,
    placeholder,
    shouldShowCounter = false,
    value,
}: TTextAreaProps) => {
    const [currentValue, setCurrentValue] = useState(value);

    return (
        <div
            className={clsx('p2p-v2-textarea', {
                'p2p-v2-textarea--error': isInvalid,
            })}
        >
            <textarea
                onChange={event => {
                    setCurrentValue(event.target.value);
                    onChange?.(event);
                }}
                placeholder={placeholder}
                value={currentValue}
            />
            {label && <label>{label}</label>}
            <div className='p2p-v2-textarea__footer'>
                {hint && (
                    <Text as='p' color={isInvalid ? 'error' : 'less-prominent'} size='xs'>
                        {hint}
                    </Text>
                )}
                {shouldShowCounter && <Text size='xs'>{currentValue?.length || 0}/300</Text>}
            </div>
        </div>
    );
};

export default TextArea;

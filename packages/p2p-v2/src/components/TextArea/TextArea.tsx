import React, { useState } from 'react';
import './TextArea.scss';

type TTextAreaProps = {
    label?: string;
    onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
    placeholder: string;
    shouldShowCounter?: boolean;
    value?: string;
};
const TextArea = ({ label, onChange, placeholder, shouldShowCounter = true, value }: TTextAreaProps) => {
    const [currentValue, setCurrentValue] = useState(value);

    return (
        <div className='p2p-v2-textarea'>
            <textarea
                onChange={event => {
                    setCurrentValue(event.target.value);
                    onChange?.(event);
                }}
                placeholder={placeholder}
            >
                {value}
            </textarea>

            <div className='p2p-v2-textarea__footer'>
                {label && <label>This information will be visible to everyone.</label>}
                {shouldShowCounter && <span>{currentValue?.length || 0}/300</span>}
            </div>
        </div>
    );
};

export default TextArea;

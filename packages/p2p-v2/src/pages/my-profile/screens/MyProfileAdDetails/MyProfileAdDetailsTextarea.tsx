import React, { useState } from 'react';
import './MyProfileAdDetailsTextarea.scss';

type TMyProfileAdDetailsTextareaProps = {
    label?: string;
    onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
    placeholder: string;
    shouldShowCounter?: boolean;
    value?: string;
};
export const MyProfileAdDetailsTextarea = ({
    label,
    onChange,
    placeholder,
    shouldShowCounter = true,
    value,
}: TMyProfileAdDetailsTextareaProps) => {
    const [currentValue, setCurrentValue] = useState(value);

    return (
        <div className='p2p-v2-my-profile-ad-details__textarea'>
            <textarea
                onChange={event => {
                    setCurrentValue(event.target.value);
                    onChange?.(event);
                }}
                placeholder={placeholder}
            >
                {value}
            </textarea>

            <div className='p2p-v2-my-profile-ad-details__textarea-footer'>
                {label && <label>This information will be visible to everyone.</label>}
                {shouldShowCounter && <span>{currentValue?.length || 0}/300</span>}
            </div>
        </div>
    );
};

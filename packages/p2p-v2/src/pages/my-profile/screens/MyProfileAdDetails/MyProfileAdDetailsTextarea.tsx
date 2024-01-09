import React from 'react';
import './MyProfileAdDetailsTextarea.scss';

type TMyProfileAdDetailsTextareaProps = {
    onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
    placeholder: string;
    value?: string;
};
const MyProfileAdDetailsTextarea = ({ onChange, placeholder, value }: TMyProfileAdDetailsTextareaProps) => {
    return (
        <>
            <textarea className='p2p-v2-my-profile-ad-details__textarea' onChange={onChange} placeholder={placeholder}>
                {value}
            </textarea>
            <span className='p2p-v2-my-profile-ad-details__counter'>0/300</span>
        </>
    );
};

export default MyProfileAdDetailsTextarea;

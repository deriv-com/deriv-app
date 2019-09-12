import React from 'react';

const IconMessageContent = ({ children, icon, message, text }) => (
    <div className='account-management__message-content'>
        <div className='account-management__message-icon'>
            {icon}
        </div>
        <div className='account-management__message'>
            {message}
        </div>
        <div className='account-management__text'>
            {text}
        </div>
        {children}
    </div>
);

export default IconMessageContent;

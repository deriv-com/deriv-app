import React from 'react';

const IconMessageContent = ({ children, icon, message }) => (
    <div className='account-management__body'>
        <div className='account-management__message-icon'>
            {icon}
        </div>
        <div className='account-management__message'>
            {message}
        </div>
        {children}
    </div>
);

export default IconMessageContent;

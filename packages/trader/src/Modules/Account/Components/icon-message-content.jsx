import React from 'react';

const IconMessageContent = ({ children, icon, icon_row, message, text }) => (
    <div className='account-management__message-content'>
        {icon &&
            <div className='account-management__message-icon'>
                {icon}
            </div>
        }
        {icon_row &&
            <div>
                {icon_row}
            </div>
        }
        <div className='account-management__message'>
            {message}
        </div>
        {text &&
            <div className='account-management__text-container'>
                <p className='account-management__text'>{text}</p>
            </div>
        }
        {children}
    </div>
);

export default IconMessageContent;

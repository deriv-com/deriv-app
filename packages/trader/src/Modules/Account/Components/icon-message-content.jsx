import React from 'react';
import classNames from 'classnames';

const IconMessageContent = ({ className, children, icon, icon_row, message, text }) => (
    <div className={classNames('account-management__message-content', `${className}__message-content'`)}>
        {icon && (
            <div className={classNames('account-management__message-icon', `${className}__message-icon`)}>{icon}</div>
        )}
        {icon_row && <div>{icon_row}</div>}
        <div className={classNames('account-management__message', `${className}__message`)}>{message}</div>
        {text && (
            <div className='account-management__text-container'>
                <p className={classNames('account-management__text', `${className}__text`)}>{text}</p>
            </div>
        )}
        {children}
    </div>
);

export default IconMessageContent;

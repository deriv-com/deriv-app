import React from 'react';
import classNames from 'classnames';

const IconMessageContent = ({ className, children, icon, icon_row, message, text }) => (
    <div
        className={classNames('account-management__message-content', {
            [`${className}__message-content'`]: className,
        })}
    >
        {icon && (
            <div
                className={classNames('account-management__message-icon', {
                    [`${className}__message-icon`]: className,
                })}
            >
                {icon}
            </div>
        )}
        {icon_row && <div>{icon_row}</div>}
        <div
            className={classNames('account-management__message', {
                [`${className}__message`]: className,
            })}
        >
            {message}
        </div>
        {text && (
            <div className='account-management__text-container'>
                <p className={classNames('account-management__text', { [`${className}__text`]: className })}>{text}</p>
            </div>
        )}
        {children}
    </div>
);

export default IconMessageContent;

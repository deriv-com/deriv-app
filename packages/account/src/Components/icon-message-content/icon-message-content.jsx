import React from 'react';
import classNames from 'classnames';
import { Div100vhContainer, Text } from '@deriv/components';
import { isDesktop } from '@deriv/shared';

const IconMessageContent = ({ className, children, icon, icon_row, message, text }) => (
    <Div100vhContainer className='account-management__message-wrapper' is_disabled={isDesktop()} height_offset='110px'>
        <div
            className={classNames('account-management__message-content', {
                [`${className}__message-content`]: className,
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
                    <Text
                        className={classNames({
                            [`${className}__text`]: className,
                        })}
                        as='p'
                        size='xs'
                        align='center'
                    >
                        {text}
                    </Text>
                </div>
            )}
            {children}
        </div>
    </Div100vhContainer>
);

export default IconMessageContent;

import React from 'react';
import classNames from 'classnames';
import { Div100vhContainer, Text } from '@deriv/components';
import { isDesktop } from '@deriv/shared';

type IconMessageContentProps = {
    children: React.ReactNode;
    className: string;
    full_width: boolean;
    icon: unknown;
    message: unknown | string;
    text: unknown | string;
};

const IconMessageContent = ({
    children,
    className,
    full_width,
    icon,
    icon_row,
    message,
    text,
}: IconMessageContentProps) => (
    <Div100vhContainer
        className={classNames('account-management__message-wrapper', {
            'account-management__message-wrapper-full-width': full_width,
        })}
        is_disabled={isDesktop()}
        height_offset='110px'
    >
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
            <Text
                as='div'
                color='general'
                weight='bold'
                size='s'
                align='center'
                className={classNames('account-management__message', {
                    [`${className}__message`]: className,
                })}
            >
                {message}
            </Text>
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

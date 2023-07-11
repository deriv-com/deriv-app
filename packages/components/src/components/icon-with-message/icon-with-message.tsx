import React from 'react';
import classNames from 'classnames';
import { isDesktop } from '@deriv/shared';
import Text from '../text/text';
import Div100vhContainer from '../div100vh-container';

type TIconWithMessage = {
    className?: string;
    full_width?: boolean;
    icon: React.ReactElement;
    message: React.ReactNode;
    text?: string | React.ReactElement;
};

const IconWithMessage = ({
    children,
    className,
    full_width,
    icon,
    message,
    text,
}: React.PropsWithChildren<TIconWithMessage>) => (
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

export default IconWithMessage;

import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import { Icon, Text } from '@deriv/components';
import FormBody from '../../../../Components/form-body';

type TPasskeysStatus = {
    title: React.ReactElement;
    description?: React.ReactNode;
    icon: string;
    className?: string;
    is_full_screen_overlay?: boolean;
};

const FullScreenOverlay = ({ children }: { children: React.ReactNode }) => {
    const portal_element = document.getElementById('modal_root');
    if (portal_element) {
        return ReactDOM.createPortal(
            <div className='passkeys' style={{ background: 'white', height: '100vh', width: '100vw' }}>
                <div className={classNames('dc-mobile-dialog__header')}>
                    <Text
                        as='h2'
                        size='xs'
                        color='loss-danger'
                        weight='bold'
                        line_height='unset'
                        align='right'
                        className='dc-mobile-dialog__title'
                    >
                        Maybe later
                    </Text>
                </div>

                {children}
            </div>,
            portal_element
        );
    }
    return <React.Fragment>{children}</React.Fragment>;
};

const PasskeysStatus = ({
    title,
    description,
    icon,
    children,
    className,
    is_full_screen_overlay,
}: React.PropsWithChildren<TPasskeysStatus>) => {
    const StatusWrapper = ({ children }: { children: React.ReactNode }) => {
        return is_full_screen_overlay ? (
            <FullScreenOverlay>{children}</FullScreenOverlay>
        ) : (
            <React.Fragment>{children}</React.Fragment>
        );
    };

    return (
        <StatusWrapper>
            <FormBody
                scroll_offset='22rem'
                className={classNames('passkeys-status__wrapper', {
                    [`${className}`]: className,
                })}
            >
                <Icon icon={icon} size={96} />
                <Text as='div' color='general' weight='bold' size='s' align='center' className='passkeys-status__title'>
                    {title}
                </Text>
                {description && (
                    <Text as='div' size='xs' align='center'>
                        {description}
                    </Text>
                )}
            </FormBody>
            {children}
        </StatusWrapper>
    );
};

export default PasskeysStatus;

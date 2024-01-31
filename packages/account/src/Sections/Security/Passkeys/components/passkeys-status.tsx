import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import { Icon, Text } from '@deriv/components';
import FormBody from '../../../../Components/form-body';
import { Localize } from '@deriv/translations';
import { useHistory } from 'react-router';
import { routes } from '@deriv/shared';

type TPasskeysStatus = {
    title: React.ReactElement;
    description?: React.ReactNode;
    icon: string;
    className?: string;
    is_full_screen_overlay?: boolean;
};

type TStatusWrapper = {
    children: React.ReactNode;
    is_full_screen_overlay?: boolean;
};

const StatusWrapper = ({ children, is_full_screen_overlay }: TStatusWrapper) => {
    const portal_element = document.getElementById('modal_root');
    const history = useHistory();

    if (portal_element && is_full_screen_overlay) {
        return ReactDOM.createPortal(
            <div className={classNames('passkeys-status__overlay-container')}>
                <Text
                    as='div'
                    size='xxs'
                    color='loss-danger'
                    weight='bold'
                    line_height='xl'
                    align='right'
                    className='passkeys-status__overlay-header'
                    onClick={() => {
                        history.push(routes.traders_hub);
                    }}
                >
                    <Localize i18n_default_text='Maybe later' />
                </Text>
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
    return (
        <StatusWrapper is_full_screen_overlay={is_full_screen_overlay}>
            <FormBody
                scroll_offset={is_full_screen_overlay ? '15rem' : '22rem'}
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

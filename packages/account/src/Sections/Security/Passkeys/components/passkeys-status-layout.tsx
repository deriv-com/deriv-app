import React, { Fragment } from 'react';
import clsx from 'clsx';

import { Button, Text } from '@deriv/components';
import { useDevice } from '@deriv-com/ui';

import FormBody from '../../../../Components/form-body';
import FormFooter from '../../../../Components/form-footer';
import { TCurrentManagedPasskey } from '../passkeys';

export type TPasskeysButtonOnClicks = {
    onPrimaryButtonClick?: (passkey_data?: Partial<TCurrentManagedPasskey>) => void;
    onSecondaryButtonClick?: () => void;
};

type TPasskeysStatusLayout = {
    className?: string;
    description?: React.ReactNode;
    icon?: React.ReactElement;
    primary_button_disabled?: boolean;
    primary_button_text: React.ReactElement;
    primary_button_type?: 'button' | 'submit';
    scroll_offset?: string;
    secondary_button_text?: React.ReactElement;
    title?: React.ReactElement;
} & TPasskeysButtonOnClicks;

export const PasskeysStatusLayout = ({
    children,
    className,
    description,
    icon,
    onPrimaryButtonClick,
    onSecondaryButtonClick = () => null,
    primary_button_disabled = false,
    primary_button_text,
    primary_button_type = 'button',
    scroll_offset = '',
    secondary_button_text,
    title,
}: React.PropsWithChildren<TPasskeysStatusLayout>) => {
    const { isDesktop } = useDevice();
    return (
        <Fragment>
            <FormBody
                scroll_offset={isDesktop ? scroll_offset : '22rem'}
                className={clsx('passkeys-status__wrapper', className)}
            >
                {icon}
                {title && (
                    <Text as='div' weight='bold' align='center' className='passkeys-status__title'>
                        {title}
                    </Text>
                )}
                {description && (
                    <Text as='div' size='xs' align='center'>
                        {description}
                    </Text>
                )}
                {children}
            </FormBody>
            <FormFooter className='passkeys-status__footer'>
                {secondary_button_text && (
                    <Button type='button' has_effect secondary onClick={onSecondaryButtonClick} large>
                        {secondary_button_text}
                    </Button>
                )}
                <Button
                    type={primary_button_type}
                    has_effect
                    primary
                    onClick={primary_button_type === 'button' ? () => onPrimaryButtonClick?.() : undefined}
                    is_disabled={primary_button_disabled}
                >
                    {primary_button_text}
                </Button>
            </FormFooter>
        </Fragment>
    );
};

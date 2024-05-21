import React, { Fragment } from 'react';
import classNames from 'classnames';
import { Button, Icon, Text } from '@deriv/components';
import FormBody from '../../../../Components/form-body';
import FormFooter from '../../../../Components/form-footer';

export type TPasskeysButtonOnClicks = {
    onPrimaryButtonClick: () => void;
    onSecondaryButtonClick?: () => void;
};

type TPasskeysStatusLayout = {
    className?: string;
    description?: React.ReactNode;
    icon?: React.ReactElement;

    primary_button_disabled?: boolean;
    primary_button_text: React.ReactElement;
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
    onSecondaryButtonClick,
    primary_button_disabled = false,
    primary_button_text,
    scroll_offset = '22rem',
    secondary_button_text,
    title,
}: React.PropsWithChildren<TPasskeysStatusLayout>) => (
    <Fragment>
        <FormBody scroll_offset={scroll_offset} className={classNames('passkeys-status__wrapper', className)}>
            {/*{icon && <Icon icon={icon} size={96} />}*/}
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
                type='button'
                has_effect
                primary
                onClick={onPrimaryButtonClick}
                is_disabled={primary_button_disabled}
            >
                {primary_button_text}
            </Button>
        </FormFooter>
    </Fragment>
);

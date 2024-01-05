import React from 'react';
import classNames from 'classnames';
import { Icon, Text } from '@deriv/components';
import FormBody from '../../../Components/form-body';

type TPasskeysStatus = {
    title: React.ReactElement;
    description?: React.ReactElement;
    icon: string;
    className?: string;
};

const PasskeysStatus = ({
    title,
    description,
    icon,
    children,
    className,
}: React.PropsWithChildren<TPasskeysStatus>) => {
    return (
        <FormBody
            scroll_offset='18rem'
            className={classNames('passkeys-status__wrapper', {
                [`${className}`]: className,
            })}
        >
            <Icon icon={icon} size={96} />
            <Text as='div' color='general' weight='bold' size='s' align='center' className='passkeys-status__title'>
                {title}
            </Text>
            {description && (
                <Text as='p' size='xs' align='center'>
                    {description}
                </Text>
            )}
            {children}
        </FormBody>
    );
};

export default PasskeysStatus;

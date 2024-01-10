import React from 'react';
import classNames from 'classnames';
import { Button, Icon, Text } from '@deriv/components';
import FormBody from '../../../Components/form-body';
import FormFooter from '../../../Components/form-footer';

type TPasskeysStatus = {
    title: React.ReactElement;
    description?: React.ReactElement;
    icon: string;
    className?: string;
    button_text: React.ReactElement;
    onButtonClick: () => void;
};

const PasskeysStatus = ({
    title,
    description,
    icon,
    children,
    className,
    button_text,
    onButtonClick,
}: React.PropsWithChildren<TPasskeysStatus>) => {
    return (
        <React.Fragment>
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
            <FormFooter>
                <Button type='button' has_effect primary onClick={onButtonClick}>
                    {button_text}
                </Button>
            </FormFooter>
        </React.Fragment>
    );
};

export default PasskeysStatus;

import { Fragment } from 'react';
import EmailPasswordTitle from './email-password-title';
import { Button, Text } from '@deriv/components';

type TEmailPasswordSection = {
    title: string;
    title_icon: string;
    description: React.ReactNode;
    should_display_button?: boolean;
    onClick: () => void;
    button_text: string;
    button_icon?: React.ReactNode;
};

const EmailPasswordSection = ({
    title,
    title_icon,
    description,
    should_display_button = true,
    onClick,
    button_text,
    button_icon,
}: TEmailPasswordSection) => {
    return (
        <Fragment>
            <EmailPasswordTitle icon={title_icon} title={title} />
            <Text as='p' color='prominent' size='xs'>
                {description}
            </Text>
            {should_display_button && (
                <Button
                    className='account__passwords-footer-btn'
                    type='button'
                    onClick={onClick}
                    has_effect
                    is_disabled={false}
                    is_loading={false}
                    text={button_text}
                    icon={button_icon}
                    large
                    secondary
                />
            )}
        </Fragment>
    );
};

export default EmailPasswordSection;

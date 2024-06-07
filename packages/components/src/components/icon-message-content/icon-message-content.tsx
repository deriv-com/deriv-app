import React from 'react';
import Button from '../button';
import Icon from '../icon';
import Text from '../text';

type TIconMessageContent = {
    icon: string;
    title: string | React.ReactNode;
    description?: string | React.ReactNode;
    button_text?: string | React.ReactNode;
    onClick?: () => void;
};

const IconMessageContent = ({ icon, title, description, button_text, onClick }: TIconMessageContent) => {
    return (
        <div className='icon-with-message-content'>
            <Icon icon={icon} size={96} />
            <Text className='icon-with-message-content__title' as='p' line_height='xxl' align='center' weight='bold'>
                {title}
            </Text>
            <Text className='icon-with-message-content__desc' as='p' size='xs' line_height='xxs' align='center'>
                {description}
            </Text>
            <Button className='icon-with-message-content__btn' onClick={onClick} has_effect primary large>
                {button_text}
            </Button>
        </div>
    );
};

export default IconMessageContent;

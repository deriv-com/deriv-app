import React from 'react';
import Button from '../button';
import Icon from '../icon';
import Text from '../text';
import { Localize } from '@deriv/translations';

type TMessageObject = {
    message: string;
    toString: () => string;
};

type TErrorModalContent = {
    error_message: Array<TMessageObject | React.ReactNode>;
};

const ErrorModalContent = ({ error_message }: TErrorModalContent) => {
    const error_description = error_message[0]?.toString();

    return (
        <div className='unhandled-error'>
            <Icon icon='IcAccountError' size={96} />
            <Text
                className='da-icon-with-message__text'
                as='p'
                size='s'
                color='general'
                line_height='xxl'
                align='center'
                weight='bold'
            >
                <Localize i18n_default_text='Sorry for the interruption' />
            </Text>
            <Text
                className='da-icon-with-message__text__desc'
                as='p'
                size='xs'
                color='general'
                line_height='xxs'
                align='center'
            >
                {error_description}
            </Text>
            <Button onClick={() => location.reload()} has_effect primary large>
                <Localize i18n_default_text='Refresh' />
            </Button>
        </div>
    );
};

export default ErrorModalContent;

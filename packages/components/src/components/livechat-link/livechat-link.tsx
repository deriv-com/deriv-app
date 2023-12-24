import React from 'react';
import Text from '../text/text';
import { Localize } from '@deriv/translations';

const LiveChatLink = () => {
    return (
        <button type='button' className='livechat__link' onClick={() => window.LC_API.open_chat_window()}>
            <Text size='xs' weight='bold' color='brand-red-coral'>
                <Localize i18n_default_text='live chat' />
            </Text>
        </button>
    );
};

export default LiveChatLink;

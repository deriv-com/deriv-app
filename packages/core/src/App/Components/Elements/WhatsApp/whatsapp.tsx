import React from 'react';
import { Popover, Icon } from '@deriv/components';
import { localize } from '@deriv/translations';
import useLiveChat from 'App/Components/Elements/LiveChat/use-livechat';
import { whatsapp_url } from '@deriv/shared';

const WhatsApp = () => {
    const liveChat = useLiveChat();

    if (!liveChat.isReady) return null;

    return (
        <a
            href={whatsapp_url}
            aria-label={localize('WhatsApp')}
            className='footer__link'
            target='_blank'
            rel='noreferrer'
        >
            <Popover classNameBubble='whatsapp__tooltip' alignment='top' message={localize('WhatsApp')} zIndex={9999}>
                <Icon icon='IcWhatsApp' className='footer__icon' />
            </Popover>
        </a>
    );
};

export default WhatsApp;

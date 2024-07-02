import React from 'react';
import { Popover, Icon } from '@deriv/components';
import { localize } from '@deriv/translations';
import useLiveChat from 'App/Components/Elements/LiveChat/use-livechat';
import { whatsapp_url } from '@deriv/shared';

const WhatsApp = ({ showPopover }: { showPopover?: boolean }) => {
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
            {showPopover ? (
                <Popover
                    classNameBubble='whatsapp__tooltip'
                    alignment='top'
                    message={localize('WhatsApp')}
                    zIndex='9999'
                >
                    <Icon icon='IcWhatsApp' className='footer__icon' />
                </Popover>
            ) : (
                <Icon icon='IcWhatsApp' className='footer__icon' />
            )}
        </a>
    );
};

export default WhatsApp;

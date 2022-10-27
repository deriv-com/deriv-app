import React from 'react';
import { Popover, Icon } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import useLiveChat from 'App/Components/Elements/LiveChat/use-livechat';

type TWhatsAppProps = {
    is_nigeria: boolean;
    is_south_africa: boolean;
};

const WhatsApp = ({ is_nigeria, is_south_africa }: TWhatsAppProps) => {
    const liveChat = useLiveChat();

    if (!liveChat.isReady) return null;

    if (!(is_nigeria || is_south_africa)) return null;

    return (
        <a
            href='https://wa.me/35699578341'
            id='dt_whatsapp'
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

export default connect(({ client }) => ({
    is_nigeria: client.is_nigeria,
    is_south_africa: client.is_south_africa,
}))(WhatsApp);

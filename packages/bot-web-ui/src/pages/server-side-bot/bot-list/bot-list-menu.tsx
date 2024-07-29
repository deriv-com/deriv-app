import React from 'react';
import ReactDom from 'react-dom';
import { Icon, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';

type TBotListMenu = {
    y_position: number;
    is_open: boolean;
    bot_id: string;
    botAction: (action: string, bot_id: string) => void;
};

const BotListMenu: React.FC<TBotListMenu> = ({ is_open, y_position, botAction, bot_id }) => {
    if (!is_open) return null;
    const el_portal = document.getElementById('ssb-bot-list-menu');
    if (!el_portal) return null;

    return ReactDom.createPortal(
        <div
            className='ssb-list__menu'
            style={{
                top: `${y_position}px`,
            }}
        >
            <div className='ssb-list__menu__item' onClick={() => botAction('OPEN', bot_id)}>
                <Icon icon='IcOpen' />
                <Text size='xxs' weight='bold'>
                    <Localize i18n_default_text='Open' />
                </Text>
            </div>
            <div className='ssb-list__menu__item' onClick={() => botAction('DELETE', bot_id)}>
                <Icon icon='IcDelete' />
                <Text size='xxs' weight='bold'>
                    <Localize i18n_default_text='Delete' />
                </Text>
            </div>
        </div>,
        el_portal
    );
};

export default BotListMenu;

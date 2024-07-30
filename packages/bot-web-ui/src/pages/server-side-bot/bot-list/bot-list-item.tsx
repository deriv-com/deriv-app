import React from 'react';
import { Button, Icon, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { TServerBotItem } from 'Stores/server-side-bot-store';

type TBotListItem = {
    handleMenuClick: (e: React.MouseEvent<HTMLDivElement>, id: string) => void;
    item: TServerBotItem;
    botAction: (action: string, bot_id: string) => void;
    active_bot: Partial<TServerBotItem>;
    setActiveBotId?: (bot_id: string) => void;
};

const BotListItem: React.FC<TBotListItem> = ({ handleMenuClick, item, botAction, active_bot, setActiveBotId }) => {
    const is_running = item.status === 'running';
    let is_stopping = false;
    let is_starting = false;

    if (item.bot_id === active_bot?.bot_id) {
        is_starting = active_bot?.status === 'starting';
        is_stopping = active_bot?.status === 'stopping';
    }

    return (
        <div
            className='ssb-list__item'
            id={item.bot_id}
            onClick={() => {
                setActiveBotId?.(item.bot_id);
            }}
        >
            <div className='ssb-list__item__title'>
                <Icon
                    icon='IcMenuDots'
                    onClick={e => {
                        e.stopPropagation();
                        handleMenuClick(e, item.bot_id);
                    }}
                />
                <Text size='xs' weight='bold'>
                    {item.name}
                </Text>
            </div>
            <div className='ssb-list__item__action'>
                {!is_running && (
                    <Button
                        green
                        onClick={e => {
                            e.stopPropagation();
                            botAction('RUN', item.bot_id);
                        }}
                        disabled={is_starting}
                    >
                        {is_starting ? <Localize i18n_default_text='Starting' /> : <Localize i18n_default_text='Run' />}
                    </Button>
                )}
                {is_running && (
                    <Button
                        primary
                        onClick={e => {
                            e.stopPropagation();
                            botAction('STOP', item.bot_id);
                        }}
                        disabled={is_stopping}
                    >
                        {is_stopping ? (
                            <Localize i18n_default_text='Stopping' />
                        ) : (
                            <Localize i18n_default_text='Stop' />
                        )}
                    </Button>
                )}
            </div>
        </div>
    );
};

export default BotListItem;

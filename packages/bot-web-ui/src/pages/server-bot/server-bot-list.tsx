import React from 'react';
import { Icon, Text } from '@deriv/components';
import { useDBotStore } from 'Stores/useDBotStore';
import { TBotListItem } from './request_schema';

const ServerBotList = () => {
    const DBotStores = useDBotStore();
    const {
        server_bot: { bot_list, removeBot, startBot, stopBot, notifyBot },
    } = DBotStores;
    const is_bot_filled_list = !!bot_list[0];

    React.useEffect(() => {
        if (is_bot_filled_list) {
            subscribeToBot();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [is_bot_filled_list]);

    const subscribeToBot = () => {
        if (bot_list && bot_list.length > 0) {
            bot_list.forEach((bot: TBotListItem) => {
                if (bot.status === 'running') {
                    notifyBot(bot.bot_id, false);
                }
            });
        }
    };

    return (
        <div className='server-bot__list__wrapper'>
            {bot_list?.map((bot: TBotListItem) => {
                const { name, bot_id, status } = bot;
                return (
                    <div key={bot_id} className='server-bot__list__item'>
                        <div className='label'>
                            <Text size='xs' weight='bold'>
                                {name}
                            </Text>
                            <Text size='xxs'>Created at: 10-07-2024 10:31 AM</Text>
                        </div>
                        <div className='actions'>
                            {status === 'started' || status === 'running' ? (
                                <span onClick={() => stopBot(bot_id)}>
                                    <Icon icon='IcBotStop' />
                                </span>
                            ) : (
                                <span onClick={() => startBot(bot_id)}>
                                    <Icon icon='IcPlay' />
                                </span>
                            )}
                            <span onClick={() => removeBot(bot_id)}>
                                <Icon icon='IcDelete' />
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ServerBotList;

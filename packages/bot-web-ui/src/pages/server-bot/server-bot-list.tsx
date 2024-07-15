import React from 'react';
import classNames from 'classnames';
import { Icon, Text } from '@deriv/components';
import { observer } from '@deriv/stores';
import { useDBotStore } from 'Stores/useDBotStore';
import { TBotListItem } from './request_schema';

const ServerBotList = observer(() => {
    const DBotStores = useDBotStore();
    const { server_bot } = DBotStores;
    const { bot_list, notifyBot, startBot, stopBot, removeBot, bot_running_list, bot_starting_list } = server_bot;

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
                const { name, bot_id } = bot;
                const is_running = bot_running_list.includes(bot_id);
                const is_starting = bot_starting_list.includes(bot_id);

                return (
                    <div
                        key={bot_id}
                        className={classNames('server-bot__list__item', {
                            'server-bot__list__item--active': is_running,
                            'server-bot__list__item--starting': is_starting,
                        })}
                    >
                        <div className='label'>
                            <Text size='xs' weight='bold'>
                                {name}
                            </Text>
                        </div>
                        <div className='actions'>
                            {is_running || is_starting ? (
                                <span
                                    onClick={() => stopBot(bot_id)}
                                    className={classNames('stop', { disabled: is_starting })}
                                >
                                    <Icon icon='IcBotStop' />
                                </span>
                            ) : (
                                <span
                                    onClick={() => startBot(bot_id)}
                                    className={classNames({ disabled: is_running || is_starting })}
                                >
                                    <Icon icon='IcPlay' />
                                </span>
                            )}
                            <span
                                onClick={() => removeBot(bot_id)}
                                className={classNames({ disabled: is_running || is_starting })}
                            >
                                <Icon icon='IcDelete' />
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
});

export default ServerBotList;

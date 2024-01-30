import React from 'react';
import { useStore } from '@deriv/stores';
import { Button, Text } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import { TBotListItem } from 'Stores/server-bot-store';

type THeader = {
    label: string;
    className: string;
};

const default_class_name = 'bot-list-contract__label';

const HEADERS: THeader[] = [
    {
        label: localize('Bot name'),
        className: default_class_name,
    },
    {
        label: localize('Strategy parameters'),
        className: default_class_name,
    },
    {
        label: localize('Actions'),
        className: default_class_name,
    },
    {
        label: localize('Last modified'),
        className: default_class_name,
    },
    {
        label: localize('Status'),
        className: default_class_name,
    },
];

type TServerBotList = {
    bot_list: Array<TBotListItem>;
    removeBot: (bot_id: string) => void;
};

const ServerBotList = ({ bot_list, removeBot }: TServerBotList) => {
    const { ui } = useStore();
    const { is_mobile } = ui;
    return (
        <div className='bot-list__wrapper'>
            {bot_list && (
                <>
                    <div className='load-strategy__title'>
                        <Text size={is_mobile ? 'xs' : 's'} weight='bold'>
                            <Localize i18n_default_text='Your bots:' />
                        </Text>
                    </div>
                    <div className='bot-list-contract__header'>
                        {HEADERS.map(({ label, className }) => {
                            return (
                                <div className={className} key={label}>
                                    <Text size={is_mobile ? 'xxs' : 'xs'} weight='bold'>
                                        {label}
                                    </Text>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
            <div className='bot-list-contract__wrapper'>
                {bot_list?.map((bot: TBotListItem, index: number) => {
                    const { name, bot_id, status } = bot;
                    return (
                        <div key={index} className='bot-list-contract__item'>
                            <div className='bot-list-contract__item__label'>{name}</div>
                            <div>
                                <p>{localize('[ Strategy parameters ]')}</p>
                            </div>
                            <div className='bot-list-contract__actions'>
                                <Button green>{localize('Start')}</Button>
                                <Button primary>{localize('Stop')}</Button>
                                <Button green>{localize('Pause')}</Button>
                                <Button primary onClick={() => removeBot(bot_id)}>
                                    {localize('Remove')}
                                </Button>
                            </div>
                            <div>{localize('last modified: [ Date ]')}</div>
                            <div>{`status: ${status}`}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ServerBotList;

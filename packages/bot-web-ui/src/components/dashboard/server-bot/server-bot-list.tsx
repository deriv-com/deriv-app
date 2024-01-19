import React from 'react';
import { useStore } from '@deriv/stores';
import { Button, Text } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import { HEADERS } from '../dashboard-component/load-bot-preview/recent';

const ServerBotList = ({ bot_list }) => {
    const { ui } = useStore();
    const { is_mobile } = ui;
    return (
        <div className='bot-list__wrapper'>
            <div className='load-strategy__title'>
                <Text size={is_mobile ? 'xs' : 's'} weight='bold'>
                    <Localize i18n_default_text='Your bots:' />
                </Text>
            </div>
            <div className='bot-list__header'>
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
            <div className='server-bot-btn'>
                <Button green>{localize('Start')}</Button>
                <Button primary>{localize('Stop')}</Button>
                <Button green>{localize('Pause')}</Button>
                <Button primary>{localize('Remove')}</Button>
            </div>
            <div className='bot-list__wrapper'>
                <div className='bot-list__item bot-list__item--loaded'>
                    {bot_list?.map((bot, index) => {
                        return (
                            <div key={index}>
                                <div className='bot-list__item__label'>{bot.name}</div>
                                <div>{bot.status}</div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default ServerBotList;
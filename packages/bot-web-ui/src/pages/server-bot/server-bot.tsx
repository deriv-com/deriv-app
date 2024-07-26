import React, { useState } from 'react';
import classNames from 'classnames';
import { Button, Icon, Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';
import { useDBotStore } from 'Stores/useDBotStore';
import Notifications from './notifications';
import ServerBotList from './server-bot-list';
import ServerQSForm from './server-qs-form';
import './server-bot.scss';

const ServerBot = observer(() => {
    const { server_bot } = useDBotStore();
    const { createBot, getBotList } = server_bot;
    const [add_btn_active, setAddBtnActive] = useState(false);
    const { client, ui } = useStore();
    const { is_mobile } = ui;
    const { is_virtual, is_logged_in } = client;

    const [has_refresh, setHasRefresh] = useState(false);

    React.useEffect(() => {
        if (is_logged_in) {
            setTimeout(async () => {
                await getBotList();
                setHasRefresh(true);
            }, 1000);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [is_virtual]);

    return (
        <>
            <div className='server-bot'>
                <div className='server-bot__list'>
                    <div className='server-bot__list__actions'>
                        <Text size={is_mobile ? 'xs' : 's'} weight='bold'>
                            <Localize i18n_default_text='Your bots' />
                        </Text>
                        <div className='server-bot__list__actions__right'>
                            {has_refresh && (
                                <span onClick={() => getBotList(false)} className='btn-refresh'>
                                    <Icon icon='IcReset' />
                                </span>
                            )}
                            <Button onClick={() => setAddBtnActive(true)} green>
                                {localize('+ Create Bot')}
                            </Button>
                        </div>
                    </div>
                    <ServerBotList />
                </div>
                <div className='server-bot__item'>
                    <div className='server-bot__item__content'>
                        <ServerBotSummary />
                    </div>
                    <Notifications />
                </div>
            </div>
            <ServerQSForm add_btn_active={add_btn_active} setAddBtnActive={setAddBtnActive} createBot={createBot} />
        </>
    );
});

export default ServerBot;

const ServerBotSummary = observer(() => {
    const { server_bot } = useDBotStore();
    const { contracts } = server_bot;

    return (
        <div className='server-bot__summary'>
            <div className='server-bot__summary__header'>
                <Text size='s' weight='bold'>
                    <Localize i18n_default_text='Contract Summary' />
                </Text>
            </div>
            <div className='server-bot__contract-card-wrapper'>
                {Object.keys(contracts).map((contract_id: string) => {
                    const contract = contracts[contract_id as keyof typeof contracts];
                    const { status, entry_spot = '', exit_spot = '...', buy_price = '', profit = '' } = contract;

                    const pnl = Math.sign(Number(profit || '')) === 1 ? 'Profit' : 'Loss';
                    return (
                        <div
                            key={contract_id}
                            className={classNames('server-bot__contract-card', {
                                'server-bot__contract-card--active': status === 'open',
                                'server-bot__contract-card--closed': status === 'closed',
                            })}
                        >
                            <div className='server-bot__contract-card__card entry-spot'>
                                <Text size='xxs' weight='bold'>
                                    Entry spot :
                                </Text>{' '}
                                <Text size='xxs'>{entry_spot}</Text>
                            </div>
                            <div className='server-bot__contract-card__card buy-price'>
                                <Text size='xxs' weight='bold'>
                                    Buy price :
                                </Text>{' '}
                                <Text size='xxs'>{buy_price}</Text>
                            </div>
                            <div className='server-bot__contract-card__card exit-spot'>
                                <Text size='xxs' weight='bold'>
                                    Exit spot :
                                </Text>{' '}
                                <Text size='xxs'>{exit_spot}</Text>
                            </div>
                            <div className='server-bot__contract-card__card profit-loss'>
                                <Text size='xxs' weight='bold'>
                                    {pnl} :
                                </Text>{' '}
                                <Text size='xxs'>{profit}</Text>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
});

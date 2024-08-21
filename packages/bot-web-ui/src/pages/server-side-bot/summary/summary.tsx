import React from 'react';
import classNames from 'classnames';
import { Button, Icon, Money, Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import { useDBotStore } from 'Stores/useDBotStore';

const STATUS = Object.freeze({
    open: {
        text: <Localize i18n_default_text='Running' />,
        icon: 'IcClockOutline',
        icon_size: 14,
        class_name: 'ssb-summary__item__header__result--progress',
        color: '',
    },
    won: {
        text: <Localize i18n_default_text='Won' />,
        icon: 'IcServerBotProfit',
        icon_size: 20,
        class_name: 'ssb-summary__item__header__result--won',
        color: 'green',
    },
    lost: {
        text: <Localize i18n_default_text='Lost' />,
        icon: 'IcServerBotLoss',
        icon_size: 20,
        class_name: 'ssb-summary__item__header__result--lost',
        color: 'red',
    },
});

const Summary: React.FC = observer(() => {
    const { server_bot } = useDBotStore();
    const { client } = useStore();
    const { currency } = client;
    const { transactions, active_bot, performance, resetTransactions } = server_bot;
    const { bot_id } = active_bot;
    const bot_transactions = bot_id ? transactions[bot_id] : {};

    const txns = bot_transactions ? Object.values(bot_transactions) : [];
    const has_summary = !!txns?.length;
    return (
        <div className='ssb-summary'>
            <div className='ssb-summary__content'>
                {has_summary ? (
                    <>
                        {[...txns]?.reverse()?.map((txn, index) => {
                            const status = STATUS[txn.status as keyof typeof STATUS];
                            const should_animate = index === 0;
                            return (
                                <div
                                    className={classNames('ssb-summary__item', {
                                        'slide-in': should_animate,
                                    })}
                                    key={txn.contract_id}
                                >
                                    <div className='ssb-summary__item__header'>
                                        <Text size='xs' weight='bold'>
                                            {txn.display_name}
                                        </Text>
                                        <span className={`ssb-summary__item__header__result ${status.class_name}`}>
                                            <Icon icon={status.icon} color={status.color} size={status.icon_size} />
                                            <Text size='xxs'>{status.text}</Text>
                                        </span>
                                    </div>
                                    <div className='ssb-summary__item__content'>
                                        <Text size='xxs'>
                                            <Localize i18n_default_text='Buy Price' />:{' '}
                                            <Money amount={txn.buy_price} currency={currency} show_currency />
                                        </Text>
                                        <Text size='xxs'>
                                            <Localize i18n_default_text='Profit' />:{' '}
                                            <Money amount={txn.profit} currency={currency} show_currency has_sign />
                                        </Text>
                                    </div>
                                    <div className='ssb-summary__item__content'>
                                        <Text size='xxs'>
                                            <Localize i18n_default_text='Entry spot' />: {txn.entry_tick}
                                        </Text>
                                        <Text size='xxs'>
                                            <Localize i18n_default_text='Exit spot' />: {txn.sell_spot || '......'}
                                        </Text>
                                    </div>
                                </div>
                            );
                        })}
                    </>
                ) : (
                    <div className='ssb-summary__content__empty'>
                        <Text size='xs'>
                            <Localize i18n_default_text='You’ll be able to track your server bot’s performance here.' />
                        </Text>
                    </div>
                )}
            </div>
            <div className='ssb-summary__footer'>
                <div className='ssb-summary__footer__performance'>
                    <ul>
                        <li>
                            <div>
                                <Text size='xxs' weight='bold'>
                                    <Localize i18n_default_text='Total stake' />
                                </Text>
                            </div>
                            <div>
                                <Text size='xs'>
                                    <Money amount={performance.total_stake} currency={currency} />
                                </Text>
                            </div>
                        </li>
                        <li>
                            <div>
                                <Text size='xxs' weight='bold'>
                                    <Localize i18n_default_text='Total payout' />
                                </Text>
                            </div>
                            <div>
                                <Text size='xs'>
                                    <Money amount={performance.total_payout} currency={currency} />
                                </Text>
                            </div>
                        </li>
                        <li>
                            <div>
                                <Text size='xxs' weight='bold'>
                                    <Localize i18n_default_text='Total profit/loss' />
                                </Text>
                            </div>
                            <div>
                                <Text
                                    size='xs'
                                    className={classNames({
                                        'ssb-summary__footer__performance--profit': performance?.total_profit > 0,
                                        'ssb-summary__footer__performance--loss':
                                            performance?.total_profit !== 0 && !(performance?.total_profit > 0),
                                    })}
                                >
                                    <Money
                                        amount={performance.total_profit}
                                        currency={currency}
                                        has_sign
                                        show_currency
                                    />
                                </Text>
                            </div>
                        </li>
                    </ul>
                </div>
                <div className='ssb-summary__footer__actions'>
                    <Button secondary disabled={!has_summary} onClick={() => resetTransactions()}>
                        <Localize i18n_default_text='Reset' />
                    </Button>
                </div>
            </div>
        </div>
    );
});

export default Summary;

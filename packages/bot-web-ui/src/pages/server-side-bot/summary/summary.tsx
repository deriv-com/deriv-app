import React from 'react';
import classNames from 'classnames';
import { Button, Icon, Money, Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import { useDBotStore } from 'Stores/useDBotStore';

const Summary: React.FC = observer(() => {
    const { server_bot } = useDBotStore();
    const { client } = useStore();
    const { currency } = client;
    const { transactions, active_bot, performance } = server_bot;
    const { bot_id } = active_bot;
    const bot_transactions = bot_id ? transactions[bot_id] : {};

    const txns = bot_transactions ? Object.values(bot_transactions) : [];
    const has_summary = !!txns?.length;

    return (
        <div className='ssb-summary'>
            <div className='ssb-summary__content'>
                {has_summary ? (
                    <>
                        {[...txns]?.reverse()?.map(txn => {
                            const has_profit = txn.profit > 0;
                            return (
                                <div className='ssb-summary__item' key={txn.contract_id}>
                                    <div className='ssb-summary__item__header'>
                                        <Text size='xs' weight='bold'>
                                            {txn.display_name}
                                        </Text>
                                        <span
                                            className={classNames('ssb-summary__item__header__result', {
                                                'ssb-summary__item__header__result--won': has_profit,
                                                'ssb-summary__item__header__result--lost': !has_profit,
                                            })}
                                        >
                                            <Icon
                                                icon={has_profit ? 'IcServerBotProfit' : 'IcServerBotLoss'}
                                                color={has_profit ? 'green' : 'red'}
                                                size={20}
                                            />
                                            <Text size='xxs'>
                                                {has_profit ? (
                                                    <Localize i18n_default_text='Won' />
                                                ) : (
                                                    <Localize i18n_default_text='Lost' />
                                                )}
                                            </Text>
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
                                            <Localize i18n_default_text='Entry spot' />: {txn.entry_spot}
                                        </Text>
                                        <Text size='xxs'>
                                            <Localize i18n_default_text='Exit spot' />: {txn.exit_spot || '......'}
                                        </Text>
                                    </div>
                                </div>
                            );
                        })}

                        {/* <div className='ssb-summary__item'>
                            <div className='ssb-summary__item__header'>
                                <Text size='xs' weight='bold'>
                                    Volatility 100 (1s) Index
                                </Text>
                                <span className='ssb-summary__item__header__result ssb-summary__item__header__result--lost'>
                                    <Icon icon='IcServerBotLoss' color='red' size={20} />
                                    <Text size='xxs'>
                                        <Localize i18n_default_text='Lost' />
                                    </Text>
                                </span>
                            </div>
                            <div className='ssb-summary__item__content'>
                                <Text size='xxs'>Buy Price: 10.00</Text>
                                <Text size='xxs'>Profit: 9.53 USD</Text>
                            </div>
                            <div className='ssb-summary__item__content'>
                                <Text size='xxs'>Entry spot: 356.86</Text>
                                <Text size='xxs'>Exit spot: 356:93</Text>
                            </div>
                        </div>

                        <div className='ssb-summary__item'>
                            <div className='ssb-summary__item__header'>
                                <Text size='xs' weight='bold'>
                                    Volatility 100 (1s) Index
                                </Text>
                                <span className='ssb-summary__item__header__result ssb-summary__item__header__result--progress'>
                                    <Icon icon='IcClockOutline' />
                                    <Text size='xxs'>
                                        <Localize i18n_default_text='Purchasing' />
                                    </Text>
                                </span>
                            </div>
                            <div className='ssb-summary__item__content'>
                                <Text size='xxs'>Buy Price: 10.00</Text>
                                <Text size='xxs'>Profit: 9.53 USD</Text>
                            </div>
                            <div className='ssb-summary__item__content'>
                                <Text size='xxs'>Entry spot: 356.86</Text>
                                <Text size='xxs'>Exit spot: 356:93</Text>
                            </div>
                        </div> */}
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
                    <Button disabled={!has_summary}>
                        <Localize i18n_default_text='Reset' />
                    </Button>
                </div>
            </div>
        </div>
    );
});

export default Summary;

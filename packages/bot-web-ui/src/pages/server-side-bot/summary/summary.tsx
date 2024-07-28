import React from 'react';
import { Button, Icon, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';

const Summary: React.FC = () => {
    const has_summary = true;
    return (
        <div className='ssb-summary'>
            <div className='ssb-summary__content'>
                {has_summary ? (
                    <>
                        <div className='ssb-summary__item'>
                            <div className='ssb-summary__item__header'>
                                <Text size='xs' weight='bold'>
                                    Volatility 100 (1s) Index
                                </Text>
                                <span className='ssb-summary__item__header__result ssb-summary__item__header__result--won'>
                                    <Icon icon='IcCheckmarkCircle' color='green' />
                                    <Text size='xxs'>
                                        <Localize i18n_default_text='Won' />
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
                                <span className='ssb-summary__item__header__result ssb-summary__item__header__result--lost'>
                                    <Icon icon='IcCrossCircle' color='red' />
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
                        </div>
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
                                <Text size='xs'>0.00 USD</Text>
                            </div>
                        </li>
                        <li>
                            <div>
                                <Text size='xxs' weight='bold'>
                                    <Localize i18n_default_text='Total payout' />
                                </Text>
                            </div>
                            <div>
                                <Text size='xs'>0.00 USD</Text>
                            </div>
                        </li>
                        <li>
                            <div>
                                <Text size='xxs' weight='bold'>
                                    <Localize i18n_default_text='No. of runs' />
                                </Text>
                            </div>
                            <div>
                                <Text size='xs'>0</Text>
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
};

export default Summary;

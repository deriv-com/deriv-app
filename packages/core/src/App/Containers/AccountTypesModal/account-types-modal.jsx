import classNames from 'classnames';
import { Icon, Modal, Tabs } from '@deriv/components';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
import { localize, Localize } from '@deriv/translations';
import AccountCard from './account-card.jsx';

import 'Sass/app/modules/account-types.scss';

const Box = ({ title, description, footer_text, icons, cards }) => {
    return (
        <div className='account-types__box'>
            <div className='account-types__box__left'>
                <h2 className='account-types__box__title'>{title}</h2>
                <p className='account-types__box__description'>{description}</p>
                {footer_text && <p className='account-types__box__footer'>{footer_text}</p>}
                <div className='account-types__box__icons'>
                    {icons.map((icon, index) => {
                        return <Icon className='account-types__box__icon' icon={icon} key={index} />;
                    })}
                </div>
            </div>
            {cards}
        </div>
    );
};

Box.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    footer_text: PropTypes.string,
    icons: PropTypes.arrayOf(PropTypes.string),
    cards: PropTypes.array,
};

const Financial = ({ is_demo = false }) => {
    return (
        <Box
            title={localize('Financial account ({{type}})', { type: is_demo ? localize('Demo') : localize('Real') })}
            description={localize(
                'Financial accounts offer you to trade financial assets such as Forex, commodities and indices.'
            )}
            footer_text={localize('Over 50 tradable financial assets')}
            icons={['IcUnderlyingFRXNZDJPY', 'IcUnderlyingOTC_NDX', 'IcUnderlyingFRXXAUUSD', 'IcUnderlyingFRXBROUSD']}
            cards={[
                <AccountCard
                    key={0}
                    title={localize('Trade on Deriv')}
                    subtitle={localize('Option trading account')}
                    button_text={is_demo ? localize('Add demo account') : localize('Add real account')}
                    buttonOnClick={() => {
                        console.log('clicked');
                    }}
                    items={[
                        {
                            label: localize('Multiplier'),
                            value: localize('Up to X1000'),
                        },
                        {
                            label: localize('Stop loss'),
                            value: localize('Flexible'),
                        },
                        {
                            label: localize('Take profit'),
                            value: localize('Flexible'),
                        },
                        {
                            label: localize('Cancel Trade'),
                            value: localize('Allow'),
                        },
                        {
                            label: localize('Currency'),
                            value: localize('USD/GBP/EUR'),
                        },
                    ]}
                    learn_more={[
                        {
                            text: localize('Option Trading'),
                            path: '/0',
                        },
                        {
                            text: localize('Dtrader'),
                            path: '/1',
                        },
                        {
                            text: localize('DBot'),
                            path: '/2',
                        },
                    ]}
                >
                    {localize(
                        'Options are contracts that give the owner the right to buy or sell an asset at a fixed price for a specific period of time. That period could be as short as a day or as long as a couple of years, depending on the type of option contract.'
                    )}
                    <br />
                    {localize('Supported platform:')} <br />
                    {localize('DTrader and Dbot')} <br />
                </AccountCard>,
                <AccountCard
                    key={1}
                    title={localize('Trade on MT5')}
                    subtitle={localize('Margin trading account')}
                    button_text={is_demo ? localize('Add demo account') : localize('Add real account')}
                    buttonOnClick={() => {
                        console.log('clicked');
                    }}
                    items={[
                        {
                            label: localize('Leverage'),
                            value: localize('Up to 1:1000'),
                        },
                        {
                            label: localize('Margin call'),
                            value: localize('150%'),
                        },
                        {
                            label: localize('Stop out level'),
                            value: localize('75%'),
                        },
                        {
                            label: localize('Currency'),
                            value: localize('USD'),
                        },
                    ]}
                    learn_more={[
                        {
                            text: localize('Margin Trading'),
                            path: '/3',
                        },
                        {
                            text: localize('DMT5'),
                            path: '/4',
                        },
                    ]}
                >
                    {localize(
                        'Margin trading is a method of trading assets using funds provided by Deriv.com. It allow you to access greater sums of capital to leverage your positions and realize larger profits on successful trades.'
                    )}
                    <br />
                    {localize('Supported platform:')} <br />
                    {localize('DMT5')} <br />
                </AccountCard>,
            ]}
        />
    );
};

const Gaming = ({ is_demo = false }) => {
    return (
        <Box
            title={localize('Gaming account ({{type}})', { type: is_demo ? localize('Demo') : localize('Real') })}
            description={localize(
                'Gaming account offers you to trade Gaming assets like synthetic indices that simulates simulated markets with constant volatilities of 10%, 25%, 50%,75% and 100%.'
            )}
            icons={[
                'IcUnderlying1HZ10V',
                'IcUnderlying1HZ100V',
                'IcUnderlyingR_10',
                'IcUnderlyingR_25',
                'IcUnderlyingR_50',
                'IcUnderlyingR_75',
                'IcUnderlyingR_100',
            ]}
            cards={[
                <AccountCard
                    key={0}
                    title={localize('Trade on Deriv')}
                    subtitle={localize('Option trading account')}
                    button_text={is_demo ? localize('Add demo account') : localize('Add real account')}
                    buttonOnClick={() => {
                        console.log('clicked');
                    }}
                    items={[
                        {
                            label: localize('Trade type'),
                            value: localize('10+'),
                        },
                        {
                            label: localize('Min duration'),
                            value: localize('1 tick'),
                        },
                        {
                            label: localize('Max duration'),
                            value: localize('365 days'),
                        },
                        {
                            label: localize('Availability'),
                            value: localize('24/7'),
                        },
                        {
                            label: localize('Currency'),
                            value: localize('USD/GBP/EUR'),
                        },
                    ]}
                    learn_more={[
                        {
                            text: localize('Option Trading'),
                            path: '/0',
                        },
                        {
                            text: localize('Dtrader'),
                            path: '/1',
                        },
                        {
                            text: localize('DBot'),
                            path: '/2',
                        },
                    ]}
                >
                    {localize(
                        'Options are contracts that give the owner the right to buy or sell an asset at a fixed price for a specific period of time. That period could be as short as a day or as long as a couple of years, depending on the type of option contract.'
                    )}
                    <br />
                    {localize('Supported platform:')} <br />
                    {localize('DTrader and Dbot')} <br />
                </AccountCard>,
                <AccountCard
                    key={1}
                    title={localize('Trade on MT5')}
                    subtitle={localize('Margin trading account')}
                    button_text={is_demo ? localize('Add demo account') : localize('Add real account')}
                    buttonOnClick={() => {
                        console.log('clicked');
                    }}
                    items={[
                        {
                            label: localize('Leverage'),
                            value: localize('Up to 1:1000'),
                        },
                        {
                            label: localize('Margin call'),
                            value: localize('100%'),
                        },
                        {
                            label: localize('Stop out level'),
                            value: localize('50%'),
                        },
                        {
                            label: localize('Currency'),
                            value: localize('USD'),
                        },
                    ]}
                    learn_more={[
                        {
                            text: localize('Margin Trading'),
                            path: '/3',
                        },
                        {
                            text: localize('DMT5'),
                            path: '/4',
                        },
                    ]}
                >
                    {localize(
                        'Margin trading is a method of trading assets using funds provided by Deriv.com. It allow you to access greater sums of capital to leverage your positions and realize larger profits on successful trades.'
                    )}
                    <br />
                    {localize('Supported platform:')} <br />
                    {localize('DMT5')} <br />
                </AccountCard>,
            ]}
        />
    );
};

const AccountTypesModal = ({ nothing }) => {
    const [account_type_tab_index, setAccountTypeTabIndex] = useState(0);
    return (
        <Modal
            title={localize('Account types')}
            width='904px'
            is_open={true}
            // toggleModal={toggleLoadModal}
            // onMount={onMount}
            // onUnmount={onUnmount}
        >
            <div className='account-types'>
                <p className='account-types__intro'>
                    <Localize
                        i18n_default_text='Deriv offer various accounts based on 2 account types that suites different need. You can have all of them whenever you want. To view this page again, simply press any of the <0/> icon in Account Swithcer.'
                        components={[<Icon key={0} className='account-types__intro__icon' icon='IcInfoOutline' />]}
                    />
                </p>
                <Tabs
                    className='account-types__tabs'
                    active_index={account_type_tab_index}
                    onTabItemClick={setAccountTypeTabIndex}
                    top
                    header_fit_content
                >
                    <div label={localize('Real accounts')}>
                        <Financial />
                        <Gaming />
                    </div>
                    <div label={localize('Demo accounts')}>
                        <Financial is_demo />
                        <Gaming is_demo />
                    </div>
                </Tabs>
            </div>
        </Modal>
    );
};

AccountTypesModal.propTypes = {};

export default AccountTypesModal;

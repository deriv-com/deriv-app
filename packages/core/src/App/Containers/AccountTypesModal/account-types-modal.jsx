import { Icon, Modal, Tabs, ThemedScrollbars } from '@deriv/components';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import AccountCard from './account-card.jsx';

import 'Sass/app/modules/account-types.scss';

const boxGenerator = (standpoint, has_demo, state, setAccountTypeTabIndex) => {
    // MLT/MF
    if (standpoint.malta && standpoint.maltainvest) {
        return has_demo ? (
            <Tabs
                active_index={state.account_type_tab_index}
                className='account-types__tabs'
                fit_content
                onTabItemClick={setAccountTypeTabIndex}
                top
            >
                <div label={localize('Real accounts')}>
                    <FinancialBox />
                    <GamingBox />
                </div>
                <div label={localize('Demo accounts')}>
                    <FinancialBox is_demo />
                    <GamingBox is_demo />
                </div>
            </Tabs>
        ) : (
            <div>
                <FinancialBox />
                <GamingBox />
            </div>
        );
    } // MX/MF
    else if (standpoint.iom && standpoint.maltainvest) {
        return has_demo ? (
            <Tabs
                active_index={state.account_type_tab_index}
                className='account-types__tabs'
                fit_content
                onTabItemClick={setAccountTypeTabIndex}
                top
            >
                <div label={localize('Real accounts')}>
                    <FinancialBox />
                    <GamingBox no_mt5 />
                </div>
                <div label={localize('Demo accounts')}>
                    <FinancialBox is_demo />
                    <GamingBox is_demo no_mt5 />
                </div>
            </Tabs>
        ) : (
            <div>
                <FinancialBox />
                <GamingBox no_mt5 />
            </div>
        );
    } // Only MLT
    else if (standpoint.malta) {
        return has_demo ? (
            <Tabs
                active_index={state.account_type_tab_index}
                className='account-types__tabs'
                fit_content
                onTabItemClick={setAccountTypeTabIndex}
                top
            >
                <div label={localize('Real accounts')}>
                    <SyntheticBox />
                </div>
                <div label={localize('Demo accounts')}>
                    <SyntheticBox is_demo />
                </div>
            </Tabs>
        ) : (
            <div>
                <SyntheticBox />
            </div>
        );
    } // Only MX
    else if (standpoint.iom) {
        return has_demo ? (
            <Tabs
                active_index={state.account_type_tab_index}
                className='account-types__tabs'
                fit_content
                onTabItemClick={setAccountTypeTabIndex}
                top
            >
                <div label={localize('Real accounts')}>
                    <FinancialBox />
                    <GamingBox no_mt5 />
                </div>
                <div label={localize('Demo accounts')}>
                    <FinancialBox is_demo />
                    <GamingBox is_demo no_mt5 />
                </div>
            </Tabs>
        ) : (
            <div>
                <FinancialBox />
                <GamingBox no_mt5 />
            </div>
        );
    } //only MF
    else if (standpoint.maltainvest) {
        return has_demo ? (
            <Tabs
                active_index={state.account_type_tab_index}
                className='account-types__tabs'
                fit_content
                onTabItemClick={setAccountTypeTabIndex}
                top
            >
                <div label={localize('Real accounts')}>
                    <FinancialBox />
                </div>
                <div label={localize('Demo accounts')}>
                    <FinancialBox is_demo />
                </div>
            </Tabs>
        ) : (
            <div>
                <FinancialBox />
            </div>
        );
    } else {
        throw new Error('Unknown standpoint');
    }
};

const Box = ({ title, description, footer_text, icons, cards }) => {
    return (
        <div className='account-types__box'>
            <div className='account-types__box-left'>
                <h2 className='account-types__box-title'>{title}</h2>
                <p className='account-types__box-description'>{description}</p>
                {footer_text && <p className='account-types__box-footer'>{footer_text}</p>}
                <div className='account-types__box-icons'>
                    {icons.map((icon, index) => {
                        return <Icon className='account-types__box-icon' icon={icon} key={index} />;
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

const FinancialBox = ({ is_demo = false }) => {
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
                    // TODO: Add click handler
                    buttonOnClick={() => {}}
                    items={{
                        [localize('Multiplier')]: localize('Up to X1000'),
                        [localize('Stop loss')]: localize('Flexible'),
                        [localize('Take profit')]: localize('Flexible'),
                        [localize('Cancel Trade')]: localize('Allow'),
                        [localize('Currency')]: localize('USD/GBP/EUR'),
                    }}
                    // TODO: Update paths
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
                    <p className='account-card__description-text'>
                        {localize(
                            'Options are contracts that give the owner the right to buy or sell an asset at a fixed price for a specific period of time. That period could be as short as a day or as long as a couple of years, depending on the type of option contract.'
                        )}
                    </p>
                    <p className='account-card__description-text--small'>{localize('Supported platform:')}</p>
                    <p className='account-card__description-text--small'>{localize('DTrader and Dbot')}</p>
                </AccountCard>,
                <AccountCard
                    key={1}
                    title={localize('Trade on MT5')}
                    subtitle={localize('Margin trading account')}
                    button_text={is_demo ? localize('Add demo account') : localize('Add real account')}
                    // TODO: Add click handler
                    buttonOnClick={() => {}}
                    items={{
                        [localize('Leverage')]: localize('Up to 1:1000'),
                        [localize('Margin call')]: localize('150%'),
                        [localize('Stop out level')]: localize('75%'),
                        [localize('Currency')]: localize('USD'),
                    }}
                    // TODO: Update paths
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
                    <p className='account-card__description-text'>
                        {localize(
                            'Margin trading is a method of trading assets using funds provided by Deriv.com. It allow you to access greater sums of capital to leverage your positions and realize larger profits on successful trades.'
                        )}
                    </p>
                    <p className='account-card__description-text--small'>{localize('Supported platform:')} </p>
                    <p className='account-card__description-text--small'>
                        {localize('DMT5')} <br />
                    </p>
                </AccountCard>,
            ]}
        />
    );
};

const GamingBox = ({ is_demo = false, no_mt5 = false }) => {
    const cards = [
        <AccountCard
            key={0}
            title={localize('Trade on Deriv')}
            subtitle={localize('Option trading account')}
            button_text={is_demo ? localize('Add demo account') : localize('Add real account')}
            // TODO: Add click handler
            buttonOnClick={() => {}}
            items={{
                [localize('Trade type')]: localize('10+'),
                [localize('Min duration')]: localize('1 tick'),
                [localize('Max duration')]: localize('365 days'),
                [localize('Availability')]: localize('24/7'),
                [localize('Currency')]: localize('USD/GBP/EUR'),
            }}
            // TODO: Update paths
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
            <p className='account-card__description-text'>
                {localize(
                    'Options are contracts that give the owner the right to buy or sell an asset at a fixed price for a specific period of time. That period could be as short as a day or as long as a couple of years, depending on the type of option contract.'
                )}
            </p>
            <p className='account-card__description-text--small'>{localize('Supported platform:')}</p>
            <p className='account-card__description-text--small'>{localize('DTrader and Dbot')}</p>
        </AccountCard>,
        <AccountCard
            key={1}
            title={localize('Trade on MT5')}
            subtitle={localize('Margin trading account')}
            button_text={is_demo ? localize('Add demo account') : localize('Add real account')}
            // TODO: Add click handler
            buttonOnClick={() => {}}
            items={{
                [localize('Leverage')]: localize('Up to 1:1000'),
                [localize('Margin call')]: localize('100%'),
                [localize('Stop out level')]: localize('50%'),
                [localize('Currency')]: localize('USD'),
            }}
            // TODO: Update paths
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
            <p className='account-card__description-text'>
                {localize(
                    'Margin trading is a method of trading assets using funds provided by Deriv.com. It allow you to access greater sums of capital to leverage your positions and realize larger profits on successful trades.'
                )}
            </p>
            <p className='account-card__description-text--small'>{localize('Supported platform:')}</p>
            <p className='account-card__description-text--small'>{localize('DMT5')}</p>
        </AccountCard>,
    ];

    if (no_mt5) {
        cards.pop();
    }
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
            cards={cards}
        />
    );
};

const SyntheticBox = ({ is_demo = false }) => {
    return (
        <Box
            title={localize('Synthetic account')}
            description={localize('ADD LATER')}
            footer_text={localize('ADD LATER')}
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
                    // TODO: Add click handler
                    buttonOnClick={() => {}}
                    items={{
                        [localize('Trade type')]: localize('10+'),
                        [localize('Min duration')]: localize('1 Tick'),
                        [localize('Max duration')]: localize('365 days'),
                        [localize('Availability')]: localize('24/7'),
                        [localize('Currency')]: localize('USD/GBP/EUR'),
                    }}
                    // TODO: Update paths
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
                    <p className='account-card__description-text'>
                        {localize(
                            'Options are contracts that give the owner the right to buy or sell an asset at a fixed price for a specific period of time. That period could be as short as a day or as long as a couple of years, depending on the type of option contract.'
                        )}
                    </p>
                    <p className='account-card__description-text--small'>{localize('Supported platform:')}</p>
                    <p className='account-card__description-text--small'>{localize('DTrader and Dbot')}</p>
                </AccountCard>,
                <AccountCard
                    key={1}
                    title={localize('Trade on MT5')}
                    subtitle={localize('Margin trading account')}
                    button_text={is_demo ? localize('Add demo account') : localize('Add real account')}
                    // TODO: Add click handler
                    buttonOnClick={() => {}}
                    items={{
                        [localize('Leverage')]: localize('Up to 1:1000'),
                        [localize('Margin call')]: localize('100%'),
                        [localize('Stop out level')]: localize('50%'),
                        [localize('Currency')]: localize('USD'),
                    }}
                    // TODO: Update paths
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
                    <p className='account-card__description-text'>
                        {localize(
                            'Margin trading is a method of trading assets using funds provided by Deriv.com. It allow you to access greater sums of capital to leverage your positions and realize larger profits on successful trades.'
                        )}
                    </p>
                    <p className='account-card__description-text--small'>{localize('Supported platform:')} </p>
                    <p className='account-card__description-text--small'>
                        {localize('DMT5')} <br />
                    </p>
                </AccountCard>,
            ]}
        />
    );
};

class AccountTypesModal extends Component {
    state = {
        account_type_tab_index: 0,
    };

    setAccountTypeTabIndex = tab_index => {
        this.setState({
            account_type_tab_index: tab_index,
        });
    };

    closeModal = () => {
        this.props.toggleAccountTypesModal(false);
    };

    render() {
        return (
            <Modal
                title={localize('Account types')}
                width='904px'
                is_open={this.props.is_account_types_modal_visible}
                toggleModal={this.closeModal}
                // has_close_icon={false}
            >
                <ThemedScrollbars autoHide style={{ height: '63.5rem' }}>
                    <div className='account-types'>
                        <p className='account-types__intro'>
                            <Localize
                                i18n_default_text='Deriv offer various accounts based on 2 account types that suites different need. You can have all of them whenever you want. To view this page again, simply press any of the <0/> icon in Account Swithcer.'
                                components={[
                                    <Icon key={0} className='account-types__text-icon' icon='IcInfoOutline' />,
                                ]}
                            />
                        </p>
                        {boxGenerator(
                            this.props.standpoint,
                            this.props.has_demo,
                            this.state,
                            this.setAccountTypeTabIndex
                        )}
                    </div>
                </ThemedScrollbars>
            </Modal>
        );
    }
}

AccountTypesModal.propTypes = {
    has_demo: PropTypes.bool,
    is_account_types_modal_visible: PropTypes.bool,
    toggleAccountTypesModal: PropTypes.func,
};

export default connect(({ ui, client }) => ({
    is_account_types_modal_visible: ui.is_account_types_modal_visible,
    toggleAccountTypesModal: ui.toggleAccountTypesModal,
    client: client,
    upgradeable_landing_companies: client.upgradeable_landing_companies,
    landing_company_shortcode: client.landing_company_shortcode,
    standpoint: client.standpoint,
    // TODO: add this later
    has_demo: (client.standpoint.malta || client.standpoint.maltainvest) && !client.standpoint.iom,
}))(AccountTypesModal);

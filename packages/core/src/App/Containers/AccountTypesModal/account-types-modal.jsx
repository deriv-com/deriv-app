import { Icon, Modal, Tabs, ThemedScrollbars } from '@deriv/components';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { urlFor } from '_common/url';
import routes from 'Constants/routes';
import AccountCard from './account-card.jsx';

import 'Sass/app/modules/account-types.scss';

// TODO: this function is needed to be updated after end of all landing companies design
const boxGenerator = ({
    standpoint,
    has_demo,
    state,
    setAccountTypeTabIndex,
    redirectToMt5Real,
    redirectToMt5Demo,
}) => {
    if (standpoint.malta && standpoint.maltainvest) {
        // MLT/MF
        return has_demo ? (
            <Tabs
                active_index={state.account_type_tab_index}
                className='account-types__tabs'
                fit_content
                onTabItemClick={setAccountTypeTabIndex}
                top
            >
                <div label={localize('Real accounts')}>
                    <FinancialBox mt5OnClick={redirectToMt5Real} />
                    <GamingBox mt5OnClick={redirectToMt5Real} />
                </div>
                <div label={localize('Demo accounts')}>
                    <FinancialBox is_demo mt5OnClick={redirectToMt5Demo} />
                    <GamingBox is_demo mt5OnClick={redirectToMt5Demo} />
                </div>
            </Tabs>
        ) : (
            <div>
                <FinancialBox mt5OnClick={redirectToMt5Real} />
                <GamingBox mt5OnClick={redirectToMt5Real} />
            </div>
        );
    } else if (standpoint.iom && standpoint.maltainvest) {
        // MX/MF
        return has_demo ? (
            <Tabs
                active_index={state.account_type_tab_index}
                className='account-types__tabs'
                fit_content
                onTabItemClick={setAccountTypeTabIndex}
                top
            >
                <div label={localize('Real accounts')}>
                    <FinancialBox mt5OnClick={redirectToMt5Real} />
                    <GamingBox no_mt5 mt5OnClick={redirectToMt5Real} />
                </div>
                <div label={localize('Demo accounts')}>
                    <FinancialBox is_demo mt5OnClick={redirectToMt5Demo} />
                    <GamingBox is_demo no_mt5 mt5OnClick={redirectToMt5Demo} />
                </div>
            </Tabs>
        ) : (
            <div>
                <FinancialBox mt5OnClick={redirectToMt5Real} />
                <GamingBox no_mt5 mt5OnClick={redirectToMt5Real} />
            </div>
        );
    } else if (standpoint.malta) {
        // Only MLT
        return has_demo ? (
            <Tabs
                active_index={state.account_type_tab_index}
                className='account-types__tabs'
                fit_content
                onTabItemClick={setAccountTypeTabIndex}
                top
            >
                <div label={localize('Real accounts')}>
                    <SyntheticBox mt5OnClick={redirectToMt5Real} />
                </div>
                <div label={localize('Demo accounts')}>
                    <SyntheticBox is_demo mt5OnClick={redirectToMt5Demo} />
                </div>
            </Tabs>
        ) : (
            <div>
                <SyntheticBox mt5OnClick={redirectToMt5Real} />
            </div>
        );
    } else if (standpoint.iom) {
        // Only MX
        return has_demo ? (
            <Tabs
                active_index={state.account_type_tab_index}
                className='account-types__tabs'
                fit_content
                onTabItemClick={setAccountTypeTabIndex}
                top
            >
                <div label={localize('Real accounts')}>
                    <FinancialBox mt5OnClick={redirectToMt5Real} />
                    <GamingBox no_mt5 mt5OnClick={redirectToMt5Real} />
                </div>
                <div label={localize('Demo accounts')}>
                    <FinancialBox is_demo mt5OnClick={redirectToMt5Demo} />
                    <GamingBox is_demo no_mt5 mt5OnClick={redirectToMt5Demo} />
                </div>
            </Tabs>
        ) : (
            <div>
                <FinancialBox mt5OnClick={redirectToMt5Real} />
                <GamingBox no_mt5 mt5OnClick={redirectToMt5Real} />
            </div>
        );
    } else if (standpoint.maltainvest) {
        // only MF
        return has_demo ? (
            <Tabs
                active_index={state.account_type_tab_index}
                className='account-types__tabs'
                fit_content
                onTabItemClick={setAccountTypeTabIndex}
                top
            >
                <div label={localize('Real accounts')}>
                    <FinancialBox mt5OnClick={redirectToMt5Real} />
                </div>
                <div label={localize('Demo accounts')}>
                    <FinancialBox is_demo mt5OnClick={redirectToMt5Demo} />
                </div>
            </Tabs>
        ) : (
            <div>
                <FinancialBox mt5OnClick={redirectToMt5Real} />
            </div>
        );
    }
    throw new Error('Unknown box');
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

const FinancialBox = ({ is_demo = false, mt5OnClick }) => {
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
                            path: '/#',
                        },
                        {
                            text: localize('Dtrader'),
                            path: '/#',
                        },
                        {
                            text: localize('DBot'),
                            path: '/#',
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
                    buttonOnClick={mt5OnClick}
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
                            path: '/#',
                        },
                        {
                            text: localize('DMT5'),
                            path: '/#',
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

const GamingBox = ({ is_demo = false, no_mt5 = false, mt5OnClick }) => {
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
                    path: '/#',
                },
                {
                    text: localize('Dtrader'),
                    path: '/#',
                },
                {
                    text: localize('DBot'),
                    path: '/#',
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
            buttonOnClick={mt5OnClick}
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
                    path: '/#',
                },
                {
                    text: localize('DMT5'),
                    path: '/#',
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

const SyntheticBox = ({ is_demo = false, mt5OnClick }) => {
    return (
        <Box
            title={localize('Synthetic account')}
            description={localize(
                'Synthetic account offers you to trade Synthetic assets like synthetic indices that simulates simulated markets with constant volatilities of 10%, 25%, 50%,75% and 100%.'
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
                            path: '/#',
                        },
                        {
                            text: localize('Dtrader'),
                            path: '/#',
                        },
                        {
                            text: localize('DBot'),
                            path: '/#',
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
                    buttonOnClick={mt5OnClick}
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
                            path: '/#',
                        },
                        {
                            text: localize('DMT5'),
                            path: '/#',
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

    redirectToMt5 = account_type => {
        this.closeModal();
        this.props.history.push(`${routes.mt5}#${account_type}`);
    };

    redirectToMt5Real = () => {
        if (!this.props.is_logged_in || this.props.is_mt5_allowed) {
            this.redirectToMt5('real');
            // TODO: Update this after EU account sign-up completion
        } else {
            window.open(urlFor('user/metatrader', undefined, undefined, true));
        }
    };

    redirectToMt5Demo = () => {
        this.redirectToMt5('demo');
    };

    // TODO: Update and use it after EU account sign-up completion
    createRealAccount = () => {
        if (this.props.can_upgrade_to === 'svg') {
            this.props.openRealAccountSignup();
        } else {
            window.open(urlFor('new_account/maltainvestws', undefined, undefined, true));
        }
    };

    render() {
        return (
            <Modal
                title={localize('Account types')}
                width='904px'
                is_open={this.props.is_account_types_modal_visible}
                toggleModal={this.closeModal}
                has_close_icon={this.props.is_dismissible}
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
                        {boxGenerator({
                            standpoint: this.props.standpoint,
                            has_demo: this.props.has_demo,
                            state: this.state,
                            setAccountTypeTabIndex: this.setAccountTypeTabIndex,
                            redirectToMt5Real: this.redirectToMt5Real,
                            redirectToMt5Demo: this.redirectToMt5Demo,
                        })}
                    </div>
                </ThemedScrollbars>
            </Modal>
        );
    }
}

AccountTypesModal.propTypes = {
    has_any_real_account: PropTypes.bool,
    has_demo: PropTypes.bool,
    is_account_types_modal_visible: PropTypes.bool,
    is_dismissible: PropTypes.bool,
    is_logged_in: PropTypes.bool,
    is_mt5_allowed: PropTypes.bool,
    residence: PropTypes.string,
    standpoint: PropTypes.object,
    toggleAccountTypesModal: PropTypes.func,
};

export default withRouter(
    connect(({ ui, client }) => ({
        can_upgrade: client.can_upgrade,
        can_upgrade_to: client.can_upgrade_to,
        has_any_real_account: client.has_any_real_account,
        // TODO: Change this later and make it a separate computed
        has_demo: (client.standpoint.malta || client.standpoint.maltainvest) && !client.standpoint.iom,
        is_account_types_modal_visible: ui.is_account_types_modal_visible,
        is_dismissible: !client.should_have_real_account,
        is_logged_in: client.is_logged_in,
        is_mt5_allowed: client.is_mt5_allowed,
        openRealAccountSignup: ui.openRealAccountSignup,
        residence: client.residence,
        standpoint: client.standpoint,
        toggleAccountTypesModal: ui.toggleAccountTypesModal,
    }))(AccountTypesModal)
);

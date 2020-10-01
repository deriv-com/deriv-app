import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router';
import {
    MobileWrapper,
    MobileCarousel,
    DesktopWrapper,
    Div100vhContainer,
    Icon,
    Modal,
    ThemedScrollbars,
} from '@deriv/components';
import { isDesktop, isMobile, routes, getStaticUrl, urlFor, PlatformContext } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import AccountCard from './account-card.jsx';

import 'Sass/app/modules/account-types.scss';

const getTargetLoginid = (accounts, target_landing_company_shortcode) =>
    Object.entries(accounts).reduce((acc, [loginid, { landing_company_shortcode }]) => {
        if (landing_company_shortcode === target_landing_company_shortcode) {
            // eslint-disable-next-line no-param-reassign
            acc += loginid;
        }
        return acc;
    }, '');

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
            <MobileWrapper>
                <MobileCarousel>{cards}</MobileCarousel>
            </MobileWrapper>
            <DesktopWrapper>{cards}</DesktopWrapper>
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

const FinancialBox = ({ derivOnClick, is_deriv_crypto, mt5OnClick, has_maltainvest_account, add_account_label }) => {
    return (
        <Box
            title={localize('Financial')}
            description={localize(
                'Trade commodities, cryptocurrencies, major and minor currency pairs with high leverage and variable spreads for maximum flexibility.'
            )}
            footer_text={localize('Over 50 tradable financial assets')}
            icons={['IcUnderlyingFRXNZDJPY', 'IcUnderlyingOTC_NDX', 'IcUnderlyingFRXXAUUSD', 'IcUnderlyingFRXBROUSD']}
            cards={[
                <AccountCard
                    key={0}
                    title={localize('Trade Options')}
                    subtitle={localize('with a Deriv Financial account')}
                    button_text={has_maltainvest_account ? add_account_label[0] : add_account_label[1]}
                    buttonOnClick={derivOnClick}
                    items={{
                        [localize('Multiplier')]: localize('Up to X1000'),
                        [localize('Stop loss')]: localize('Flexible'),
                        [localize('Take profit')]: localize('Flexible'),
                        [localize('Cancel trade')]: localize('Allowed'),
                        [localize('Currency')]: localize('USD/GBP/EUR'),
                    }}
                    platforms={[
                        {
                            icon: 'IcBrandDtrader',
                            name: 'DTrader',
                            path: getStaticUrl('/dtrader', { is_deriv_crypto }),
                        },
                        {
                            icon: 'IcBrandDbot',
                            name: 'DBot',
                            path: getStaticUrl('/dbot', { is_deriv_crypto }),
                        },
                        {
                            icon: 'IcBrandSmarttrader',
                            name: 'SmartTrader',
                            path: 'https://smarttrader.deriv.app/en/trading.html',
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
                    title={localize('Trade on Margin')}
                    subtitle={localize('with a DMT5 Financial account')}
                    button_text={!has_maltainvest_account ? add_account_label[2] : add_account_label[0]}
                    buttonOnClick={mt5OnClick}
                    is_button_disabled={!has_maltainvest_account}
                    items={{
                        [localize('Leverage')]: localize('Up to 1:30'),
                        [localize('Margin call')]: localize('100%'),
                        [localize('Stop out level')]: localize('50%'),
                        [localize('Currency')]: localize('EUR/GBP'),
                    }}
                    platforms={[
                        {
                            icon: 'IcBrandDMT5',
                            name: 'MetaTrader 5',
                            path: getStaticUrl('/dmt5', { is_deriv_crypto }),
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

const SyntheticBox = ({ derivOnClick, add_account_label, is_deriv_crypto }) => {
    return (
        <Box
            title={localize('Synthetic')}
            description={localize(
                'Trade synthetic indices that are available 24/7, have constant volatility, and are free of market and liquidity risks.'
            )}
            icons={[
                'IcUnderlying1HZ10V',
                'IcUnderlying1HZ25V',
                'IcUnderlying1HZ50V',
                'IcUnderlying1HZ75V',
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
                    title={localize('Trade Options')}
                    subtitle={localize('with a Deriv Synthetic account')}
                    button_text={add_account_label}
                    buttonOnClick={derivOnClick}
                    items={{
                        [localize('Trade type')]: localize('10+'),
                        [localize('Min duration')]: localize('1 tick'),
                        [localize('Max duration')]: localize('365 days'),
                        [localize('Availability')]: localize('24/7'),
                        [localize('Currency')]: localize('USD/GBP'),
                    }}
                    platforms={[
                        {
                            icon: 'IcBrandDtrader',
                            name: 'DTrader',
                            path: getStaticUrl('dtrader', { is_deriv_crypto }),
                        },
                        {
                            icon: 'IcBrandDbot',
                            name: 'DBot',
                            path: getStaticUrl('dbot', { is_deriv_crypto }),
                        },
                        {
                            icon: 'IcBrandSmarttrader',
                            name: 'SmartTrader',
                            path: 'https://smarttrader.deriv.app',
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
            ]}
        />
    );
};

class AccountTypesModal extends React.Component {
    static contextType = PlatformContext;
    closeModal = () => {
        this.props.toggleAccountTypesModal(false);
    };

    redirectToMt5 = account_type => {
        this.closeModal();
        this.props.history.push(`${routes.mt5}#${account_type}`);
    };

    redirectToMt5Real = () => {
        this.closeModal();
        if (!this.props.is_logged_in || this.props.is_mt5_allowed) {
            this.redirectToMt5('real');
        } else {
            window.open(urlFor('user/metatrader', { legacy: true }));
        }
    };

    createRealAccount = target => {
        this.closeModal();
        this.props.openRealAccountSignup(target);
    };

    render() {
        return (
            <Modal
                title={localize('Account types')}
                width='904px'
                className='account-types'
                is_open={this.props.is_account_types_modal_visible}
                toggleModal={this.closeModal}
                has_close_icon={this.props.is_dismissible}
            >
                <ThemedScrollbars is_bypassed={isMobile()} autohide={false} height={'calc(100vh - 84px'}>
                    <Div100vhContainer
                        height_offset='120px'
                        is_disabled={isDesktop()}
                        className='account-types__container'
                    >
                        <div className='account-types'>
                            <p className='account-types__intro'>
                                {localize('Choose an account that suits your needs.')}
                            </p>
                            <div>
                                <SyntheticBox
                                    derivOnClick={() => {
                                        if (this.props.has_iom_account) {
                                            if (this.props.landing_company_shortcode !== 'iom') {
                                                this.props.switchAccount(getTargetLoginid(this.props.accounts, 'iom'));
                                            }
                                            this.closeModal();
                                        } else {
                                            this.createRealAccount(this.props.standpoint.gaming_company);
                                        }
                                    }}
                                    add_account_label={
                                        this.props.has_iom_account
                                            ? localize('Trade with this account')
                                            : localize('Add this real account')
                                    }
                                    is_deriv_crypto={this.context.is_deriv_crypto}
                                />
                                <FinancialBox
                                    derivOnClick={() => {
                                        if (this.props.has_maltainvest_account) {
                                            if (this.props.landing_company_shortcode !== 'maltainvest') {
                                                this.props.switchAccount(
                                                    getTargetLoginid(this.props.accounts, 'maltainvest')
                                                );
                                            }
                                            this.closeModal();
                                        } else {
                                            this.createRealAccount(this.props.standpoint.financial_company);
                                        }
                                    }}
                                    mt5OnClick={this.redirectToMt5Real}
                                    has_maltainvest_account={this.props.has_maltainvest_account}
                                    add_account_label={[
                                        localize('Trade with this account'),
                                        localize('Add this real account'),
                                        localize('Deriv Financial required'),
                                    ]}
                                    is_deriv_crypto={this.context.is_deriv_crypto}
                                />
                            </div>
                        </div>
                    </Div100vhContainer>
                </ThemedScrollbars>
            </Modal>
        );
    }
}

AccountTypesModal.propTypes = {
    has_any_real_account: PropTypes.bool,
    is_account_types_modal_visible: PropTypes.bool,
    is_dismissible: PropTypes.bool,
    is_logged_in: PropTypes.bool,
    is_mt5_allowed: PropTypes.bool,
    is_virtual: PropTypes.bool,
    residence: PropTypes.string,
    standpoint: PropTypes.object,
    toggleAccountTypesModal: PropTypes.func,
};

export default withRouter(
    connect(({ ui, client }) => ({
        can_upgrade: client.can_upgrade,
        can_upgrade_to: client.can_upgrade_to,
        has_any_real_account: client.has_any_real_account,
        is_account_types_modal_visible: ui.is_account_types_modal_visible,
        accounts: client.accounts,
        landing_company_shortcode: client.landing_company_shortcode,
        has_iom_account: client.has_iom_account,
        has_maltainvest_account: client.has_maltainvest_account,
        is_dismissible: !client.should_have_real_account,
        is_logged_in: client.is_logged_in,
        is_mt5_allowed: client.is_mt5_allowed,
        is_virtual: client.is_virtual,
        openRealAccountSignup: ui.openRealAccountSignup,
        residence: client.residence,
        standpoint: client.standpoint,
        switchAccount: client.switchAccount,
        toggleAccountTypesModal: ui.toggleAccountTypesModal,
    }))(AccountTypesModal)
);

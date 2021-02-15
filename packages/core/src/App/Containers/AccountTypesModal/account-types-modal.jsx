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
    Text,
} from '@deriv/components';
import { isDesktop, isMobile, routes, getStaticUrl, PlatformContext } from '@deriv/shared';
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
                <Text as='p' size='xs' line_height='s' className='account-types__box-description'>
                    {description}
                </Text>
                {footer_text && (
                    <Text as='p' size='xxs' weight='bold' className='account-types__box-footer'>
                        {footer_text}
                    </Text>
                )}
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

const FinancialBox = ({ derivOnClick, is_dashboard, mt5OnClick, has_maltainvest_account, add_account_label }) => {
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
                            path: getStaticUrl('/dtrader', { is_dashboard }),
                        },
                        {
                            icon: 'IcBrandDbot',
                            name: 'DBot',
                            path: getStaticUrl('/dbot', { is_dashboard }),
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
                            path: getStaticUrl('/dmt5', { is_dashboard }),
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

const SyntheticBox = ({ derivOnClick, add_account_label, is_dashboard }) => {
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
                'IcUnderlyingBOOM1000',
                'IcUnderlyingBOOM500',
                'IcUnderlyingCRASH1000',
                'IcUnderlyingCRASH500',
                'IcUnderlyingSTPRNG',
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
                            path: getStaticUrl('dtrader', { is_dashboard }),
                        },
                        {
                            icon: 'IcBrandDbot',
                            name: 'DBot',
                            path: getStaticUrl('dbot', { is_dashboard }),
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

const AccountTypesModal = ({
    accounts,
    has_iom_account,
    has_maltainvest_account,
    history,
    is_account_types_modal_visible,
    is_dismissible,
    landing_company_shortcode,
    openRealAccountSignup,
    standpoint,
    switchAccount,
    toggleAccountTypesModal,
}) => {
    const { is_dashboard } = React.useContext(PlatformContext);

    const closeModal = () => {
        toggleAccountTypesModal(false);
    };

    const redirectToMt5 = account_type => {
        closeModal();
        history.push(`${routes.mt5}#${account_type}`);
    };

    const redirectToMt5Real = () => {
        closeModal();
        redirectToMt5('real');
    };

    const createRealAccount = target => {
        closeModal();
        openRealAccountSignup(target);
    };

    return (
        <Modal
            title={localize('Account types')}
            width='904px'
            className='account-types'
            is_open={is_account_types_modal_visible}
            toggleModal={closeModal}
            has_close_icon={is_dismissible}
        >
            <ThemedScrollbars is_bypassed={isMobile()} autohide={false} height={'calc(100vh - 84px'}>
                <Div100vhContainer height_offset='120px' is_disabled={isDesktop()} className='account-types__container'>
                    <div className='account-types'>
                        <Text as='p' size='xs' line_height='s' className='account-types__intro'>
                            {localize('Choose an account that suits your needs.')}
                        </Text>
                        <div>
                            <SyntheticBox
                                derivOnClick={() => {
                                    if (has_iom_account) {
                                        if (landing_company_shortcode !== 'iom') {
                                            switchAccount(getTargetLoginid(accounts, 'iom'));
                                        }
                                        closeModal();
                                    } else {
                                        createRealAccount(standpoint.gaming_company);
                                    }
                                }}
                                add_account_label={
                                    has_iom_account
                                        ? localize('Trade with this account')
                                        : localize('Add this real account')
                                }
                                is_dashboard={is_dashboard}
                            />
                            <FinancialBox
                                derivOnClick={() => {
                                    if (has_maltainvest_account) {
                                        if (landing_company_shortcode !== 'maltainvest') {
                                            switchAccount(getTargetLoginid(accounts, 'maltainvest'));
                                        }
                                        closeModal();
                                    } else {
                                        createRealAccount(standpoint.financial_company);
                                    }
                                }}
                                mt5OnClick={redirectToMt5Real}
                                has_maltainvest_account={has_maltainvest_account}
                                add_account_label={[
                                    localize('Trade with this account'),
                                    localize('Add this real account'),
                                    localize('Deriv Financial required'),
                                ]}
                                is_dashboard={is_dashboard}
                            />
                        </div>
                    </div>
                </Div100vhContainer>
            </ThemedScrollbars>
        </Modal>
    );
};

AccountTypesModal.propTypes = {
    accounts: PropTypes.object,
    has_iom_account: PropTypes.bool,
    has_maltainvest_account: PropTypes.bool,
    history: PropTypes.any,
    is_account_types_modal_visible: PropTypes.bool,
    is_dismissible: PropTypes.bool,
    landing_company_shortcode: PropTypes.string,
    standpoint: PropTypes.object,
    switchAccount: PropTypes.func,
    toggleAccountTypesModal: PropTypes.func,
};

export default withRouter(
    connect(({ ui, client }) => ({
        accounts: client.accounts,
        can_upgrade: client.can_upgrade,
        can_upgrade_to: client.can_upgrade_to,
        has_iom_account: client.has_iom_account,
        has_maltainvest_account: client.has_maltainvest_account,
        is_account_types_modal_visible: ui.is_account_types_modal_visible,
        is_dismissible: !client.should_have_real_account,
        landing_company_shortcode: client.landing_company_shortcode,
        openRealAccountSignup: ui.openRealAccountSignup,
        standpoint: client.standpoint,
        switchAccount: client.switchAccount,
        toggleAccountTypesModal: ui.toggleAccountTypesModal,
    }))(AccountTypesModal)
);

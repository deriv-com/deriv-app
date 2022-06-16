import PropTypes from 'prop-types';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { getStaticUrl, isCryptocurrency, routes } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import { Loading, MobileWrapper, ThemedScrollbars, Text } from '@deriv/components';
import { connect } from 'Stores/connect';
import Providers from 'Config/cashier-default-providers';
import CashierDefaultDetails from 'Components/CashierDefault/cashier-default-details.jsx';
import CashierDefaultSideNote from 'Components/CashierDefault/cashier-default-side-note.jsx';

const CashierDefault = ({
    available_crypto_currencies,
    accounts_list,
    can_change_fiat_currency,
    currency,
    has_set_currency,
    is_dark_mode_on,
    is_landing_company_loaded,
    is_mobile,
    is_from_derivgo,
    is_payment_agent_visible_in_onboarding,
    is_switching,
    onMountCashierDefault,
    openRealAccountSignup,
    shouldNavigateAfterChooseCrypto,
    shouldNavigateAfterPrompt,
    setIsCashierDefault,
    setIsDeposit,
    setDepositTarget,
    setShouldShowAllAvailableCurrencies,
    setSideNotes,
    showP2pInCashierDefault,
    show_p2p_in_cashier_default,
    toggleSetCurrencyModal,
}) => {
    const history = useHistory();
    const is_crypto = !!currency && isCryptocurrency(currency);
    const has_crypto_account = accounts_list.some(x => x.is_crypto);
    const has_fiat_account = accounts_list.some(x => !x.is_crypto);
    const is_currency_banner_visible =
        (!is_crypto && !can_change_fiat_currency) || (is_crypto && available_crypto_currencies.length > 0);

    React.useEffect(() => {
        onMountCashierDefault();
        return () => {
            setIsCashierDefault(false);
            if (!has_set_currency && window.location.pathname.includes(routes.cashier)) {
                history.push(routes.trade);
                toggleSetCurrencyModal();
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        if (
            typeof setSideNotes === 'function' &&
            !is_switching &&
            accounts_list.length > 0 &&
            is_landing_company_loaded &&
            is_currency_banner_visible
        ) {
            setSideNotes([<CashierDefaultSideNote key={0} is_crypto={is_crypto} />]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [is_switching, accounts_list, is_landing_company_loaded]);

    const openRealAccount = target => {
        openRealAccountSignup('choose');
        shouldNavigateAfterChooseCrypto(target);
    };

    const openTarget = target => {
        setDepositTarget(target);
        if (is_crypto || has_crypto_account) {
            openRealAccount(target);
        } else {
            openRealAccountSignup('add_crypto');
        }
    };

    const fiatAccountConditions = (next_location, current_location) => {
        if (has_fiat_account) {
            shouldNavigateAfterPrompt(next_location, current_location);
        } else {
            openRealAccountSignup('add_fiat');
        }
    };

    const onClickDepositCash = () => {
        setDepositTarget(routes.cashier_deposit);

        if (is_crypto) {
            fiatAccountConditions(routes.cashier_deposit, 'deposit');
        } else {
            setIsDeposit(true);
        }
    };

    const onClickDepositCrypto = () => {
        openTarget(routes.cashier_deposit);
    };

    const onClickOnramp = () => {
        openTarget(routes.cashier_onramp);
    };

    const onClickPaymentAgent = () => {
        setShouldShowAllAvailableCurrencies(true);
        setDepositTarget(routes.cashier_pa);
        openRealAccount(routes.cashier_pa);
    };

    const onClickDp2p = () => {
        setDepositTarget(routes.cashier_p2p);

        if (is_crypto) {
            fiatAccountConditions(routes.cashier_p2p, 'DP2P');
        } else {
            history.push(routes.cashier_p2p);
        }
    };

    const getDepositOptions = () => {
        showP2pInCashierDefault();
        const options = [];
        options.push(Providers.createCashProvider(onClickDepositCash));
        options.push(Providers.createCryptoProvider(onClickDepositCrypto));
        options.push(Providers.createOnrampProvider(onClickOnramp, is_crypto));
        if (is_payment_agent_visible_in_onboarding) {
            options.push(Providers.createPaymentAgentProvider(onClickPaymentAgent));
        }

        if (show_p2p_in_cashier_default) {
            options.push(Providers.createDp2pProvider(onClickDp2p));
        }
        return options;
    };

    if (is_switching || accounts_list.length === 0 || !is_landing_company_loaded)
        return <Loading className='cashier-default__loader' is_fullscreen />;

    return (
        <div>
            {is_currency_banner_visible && (
                <MobileWrapper>
                    <CashierDefaultSideNote is_crypto={is_crypto} />
                </MobileWrapper>
            )}
            <div className='cashier-default'>
                <div className='cashier-default-header'>
                    <Text size={is_mobile ? 's' : 'sm'} line_height='xxl'>
                        <Localize i18n_default_text='Choose a way to fund your account' />
                    </Text>
                    <Text size={is_mobile ? 'xs' : 's'} line_height={is_mobile ? 'xl' : 'xxl'} align='center'>
                        <Localize i18n_default_text='Please note that some payment methods might not be available in your country.' />
                    </Text>
                </div>
                {is_mobile && !is_from_derivgo && (
                    <div
                        className='cashier-default-header-learn-more'
                        onClick={() => window.open(getStaticUrl('/payment-methods'))}
                    >
                        <Text size='xs' color='red'>
                            <Localize i18n_default_text='Learn more about payment methods' />
                        </Text>
                    </div>
                )}
                <ThemedScrollbars className='cashier-default-content'>
                    <div className='cashier-default-content__description'>
                        {getDepositOptions()?.map((deposit, idx) => (
                            <CashierDefaultDetails
                                key={`${deposit.detail_header}${idx}`}
                                detail_click={deposit.detail_click}
                                detail_contents={deposit.detail_contents}
                                detail_description={deposit.detail_description}
                                detail_header={deposit.detail_header}
                                is_dark_mode_on={is_dark_mode_on}
                                is_mobile={is_mobile}
                            />
                        ))}
                    </div>
                </ThemedScrollbars>
            </div>
        </div>
    );
};

CashierDefault.propTypes = {
    accounts_list: PropTypes.array,
    available_crypto_currencies: PropTypes.array,
    can_change_fiat_currency: PropTypes.bool,
    currency: PropTypes.string,
    has_set_currency: PropTypes.bool,
    is_dark_mode_on: PropTypes.bool,
    is_landing_company_loaded: PropTypes.bool,
    is_mobile: PropTypes.bool,
    is_from_derivgo: PropTypes.bool,
    is_payment_agent_visible_in_onboarding: PropTypes.bool,
    is_switching: PropTypes.bool,
    onMountCashierDefault: PropTypes.func,
    openRealAccountSignup: PropTypes.func,
    shouldNavigateAfterChooseCrypto: PropTypes.func,
    shouldNavigateAfterPrompt: PropTypes.func,
    setIsCashierDefault: PropTypes.func,
    setIsDeposit: PropTypes.func,
    setDepositTarget: PropTypes.func,
    setShouldShowAllAvailableCurrencies: PropTypes.func,
    setSideNotes: PropTypes.func,
    showP2pInCashierDefault: PropTypes.func,
    show_p2p_in_cashier_default: PropTypes.bool,
    toggleSetCurrencyModal: PropTypes.func,
};

export default connect(({ client, common, modules, ui }) => ({
    accounts_list: modules.cashier.account_transfer.accounts_list,
    available_crypto_currencies: client.available_crypto_currencies,
    can_change_fiat_currency: client.can_change_fiat_currency,
    currency: client.currency,
    has_set_currency: modules.cashier.general_store.has_set_currency,
    is_dark_mode_on: ui.is_dark_mode_on,
    is_landing_company_loaded: client.is_landing_company_loaded,
    is_mobile: ui.is_mobile,
    is_from_derivgo: common.is_from_derivgo,
    is_payment_agent_visible_in_onboarding: modules.cashier.payment_agent.is_payment_agent_visible_in_onboarding,
    is_switching: client.is_switching,
    onMountCashierDefault: modules.cashier.general_store.onMountCashierDefault,
    openRealAccountSignup: ui.openRealAccountSignup,
    shouldNavigateAfterChooseCrypto: ui.shouldNavigateAfterChooseCrypto,
    shouldNavigateAfterPrompt: modules.cashier.account_prompt_dialog.shouldNavigateAfterPrompt,
    setIsCashierDefault: modules.cashier.general_store.setIsCashierDefault,
    setIsDeposit: modules.cashier.general_store.setIsDeposit,
    setDepositTarget: modules.cashier.general_store.setDepositTarget,
    setShouldShowAllAvailableCurrencies: modules.cashier.general_store.setShouldShowAllAvailableCurrencies,
    showP2pInCashierDefault: modules.cashier.general_store.showP2pInCashierDefault,
    show_p2p_in_cashier_default: modules.cashier.general_store.show_p2p_in_cashier_default,
    toggleSetCurrencyModal: ui.toggleSetCurrencyModal,
}))(CashierDefault);

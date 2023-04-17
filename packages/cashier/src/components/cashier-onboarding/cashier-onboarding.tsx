import React from 'react';
import { useHistory } from 'react-router-dom';
import { getStaticUrl, isCryptocurrency, routes } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import { Loading, ThemedScrollbars, Text } from '@deriv/components';
import { useStore, observer } from '@deriv/stores';
import Providers from './cashier-onboarding-providers';
import CashierOnboardingDetails from './cashier-onboarding-details';
import CashierOnboardingSideNote from './cashier-onboarding-side-note';
import SideNote from 'Components/side-note';
import type { TCashierOnboardingProvider } from './cashier-onboarding-providers';
import { useCashierStore } from '../../stores/useCashierStores';

type TCashierOnboardingProps = {
    setSideNotes?: (component: React.ReactElement[]) => void;
};

const CashierOnboarding = observer(({ setSideNotes }: TCashierOnboardingProps) => {
    const { client, ui, common } = useStore();
    const { general_store, payment_agent, account_prompt_dialog } = useCashierStore();
    const {
        accounts,
        available_crypto_currencies,
        can_change_fiat_currency,
        currency,
        is_landing_company_loaded,
        is_switching,
    } = client;
    const { is_from_derivgo } = common;
    const {
        has_set_currency,
        onMountCashierOnboarding,
        is_cashier_onboarding,
        setIsCashierOnboarding,
        setIsDeposit,
        setDepositTarget,
        setShouldShowAllAvailableCurrencies,
        showP2pInCashierOnboarding,
        show_p2p_in_cashier_onboarding,
    } = general_store;
    const {
        app_contents_scroll_ref,
        is_dark_mode_on,
        is_mobile,
        openRealAccountSignup,
        shouldNavigateAfterChooseCrypto,
        toggleSetCurrencyModal,
    } = ui;
    const { is_payment_agent_visible_in_onboarding } = payment_agent;
    const { shouldNavigateAfterPrompt } = account_prompt_dialog;

    const history = useHistory();
    const is_crypto = !!currency && isCryptocurrency(currency);
    const has_crypto_account = React.useMemo(
        () => Object.values(accounts).some(acc_settings => isCryptocurrency(acc_settings.currency || '')),
        [accounts]
    );
    const has_fiat_account = React.useMemo(
        () =>
            Object.values(accounts).some(
                acc_settings => !acc_settings.is_virtual && !isCryptocurrency(acc_settings.currency || '')
            ),
        [accounts]
    );

    const is_currency_banner_visible =
        (!is_crypto && !can_change_fiat_currency) || (is_crypto && available_crypto_currencies.length > 0);

    React.useEffect(() => {
        onMountCashierOnboarding();
        return () => {
            setIsCashierOnboarding(false);
            if (!has_set_currency && window.location.pathname.includes(routes.cashier)) {
                history.push(routes.trade);
                toggleSetCurrencyModal();
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        return () => {
            if (app_contents_scroll_ref.current) app_contents_scroll_ref.current.scrollTop = 0;
        };
    }, [app_contents_scroll_ref]);

    React.useEffect(() => {
        if (
            typeof setSideNotes === 'function' &&
            !is_switching &&
            Object.keys(accounts).length > 0 &&
            is_landing_company_loaded &&
            is_currency_banner_visible
        ) {
            setSideNotes([<CashierOnboardingSideNote key={0} is_crypto={is_crypto} />]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [is_switching, accounts, is_landing_company_loaded, is_cashier_onboarding]);

    const openRealAccount = (target: string) => {
        openRealAccountSignup('choose');
        shouldNavigateAfterChooseCrypto(target);
    };

    const openTarget = (target: string) => {
        setDepositTarget(target);
        if (is_crypto || has_crypto_account) {
            openRealAccount(target);
        } else {
            openRealAccountSignup('add_crypto');
        }
    };

    const fiatAccountConditions = (next_location: string, current_location: string) => {
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
        showP2pInCashierOnboarding();
        const options: TCashierOnboardingProvider[] = [];
        options.push(Providers.createCashProvider(onClickDepositCash));
        options.push(Providers.createCryptoProvider(onClickDepositCrypto));
        options.push(Providers.createOnrampProvider(onClickOnramp, is_crypto));
        if (is_payment_agent_visible_in_onboarding) {
            options.push(Providers.createPaymentAgentProvider(onClickPaymentAgent));
        }

        if (show_p2p_in_cashier_onboarding) {
            options.push(Providers.createDp2pProvider(onClickDp2p));
        }
        return options;
    };

    if (is_switching || Object.keys(accounts).length === 0 || !is_landing_company_loaded)
        return <Loading className='cashier-onboarding__loader' is_fullscreen />;

    return (
        <div>
            {is_currency_banner_visible && (
                <SideNote is_mobile has_title={false} className='outside-wrapper'>
                    <CashierOnboardingSideNote is_crypto={is_crypto} />
                </SideNote>
            )}
            <div className='cashier-onboarding'>
                <div className='cashier-onboarding-header'>
                    <Text size={is_mobile ? 's' : 'sm'} line_height='xxl'>
                        <Localize i18n_default_text='Choose a way to fund your account' />
                    </Text>
                    <Text size={is_mobile ? 'xs' : 's'} line_height={is_mobile ? 'xl' : 'xxl'} align='center'>
                        <Localize i18n_default_text='Please note that some payment methods might not be available in your country.' />
                    </Text>
                </div>
                {is_mobile && !is_from_derivgo && (
                    <div
                        className='cashier-onboarding-header-learn-more'
                        data-testid='dt_cashier_onboarding_header_learn_more'
                        onClick={() => window.open(getStaticUrl('/payment-methods'))}
                    >
                        <Text size='xs' color='red'>
                            <Localize i18n_default_text='Learn more about payment methods' />
                        </Text>
                    </div>
                )}
                <ThemedScrollbars className='cashier-onboarding-content'>
                    <div className='cashier-onboarding-content__description'>
                        {getDepositOptions()?.map((deposit, idx) => (
                            <CashierOnboardingDetails
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
});

export default CashierOnboarding;

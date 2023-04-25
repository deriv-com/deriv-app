import React from 'react';
import { useHistory } from 'react-router-dom';
import { isCryptocurrency, routes } from '@deriv/shared';
import { Loading } from '@deriv/components';
import { useStore, observer } from '@deriv/stores';
import CashierOnboardingSideNote from './cashier-onboarding-side-note';
import SideNote from 'Components/side-note';
import { useCashierStore } from '../../stores/useCashierStores';

type TCashierOnboardingProps = {
    setSideNotes?: (component: React.ReactElement[]) => void;
};

const CashierOnboarding = observer(({ setSideNotes }: TCashierOnboardingProps) => {
    const { client, ui } = useStore();
    const { general_store } = useCashierStore();
    const {
        accounts,
        available_crypto_currencies,
        can_change_fiat_currency,
        currency,
        is_landing_company_loaded,
        is_switching,
    } = client;
    const { has_set_currency, onMountCashierOnboarding, is_cashier_onboarding, setIsCashierOnboarding } = general_store;
    const { app_contents_scroll_ref, toggleSetCurrencyModal } = ui;

    const history = useHistory();
    const is_crypto = !!currency && isCryptocurrency(currency);

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

    if (is_switching || Object.keys(accounts).length === 0 || !is_landing_company_loaded)
        return <Loading className='cashier-onboarding__loader' is_fullscreen />;

    return (
        <div>
            {is_currency_banner_visible && (
                <SideNote is_mobile has_title={false} className='outside-wrapper'>
                    <CashierOnboardingSideNote is_crypto={is_crypto} />
                </SideNote>
            )}
        </div>
    );
});

export default CashierOnboarding;

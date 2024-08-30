import React from 'react';
import { getUrlSmartTrader } from '@deriv/shared';
import MarketUnavailableModal from 'App/Components/Elements/Modals/MarketUnavailableModal';
import ServicesErrorModal from 'App/Components/Elements/Modals/ServicesErrorModal';
import AccountVerificationPendingModal from 'App/Components/Elements/Modals/AccountVerificationPendingModal';
import TradingDisabledByResidenceModal from 'App/Components/Elements/Modals/TradingDisabledByResidenceModal';
import { observer, useStore } from '@deriv/stores';
import { useTraderStore } from 'Stores/useTraderStores';

const TradeModals = observer(() => {
    const { ui, client, common } = useStore();
    const { resetPreviousSymbol, clearPurchaseInfo, requestProposal: resetPurchase } = useTraderStore();
    const { is_virtual, is_logged_in } = client;

    const { services_error } = common;
    const {
        is_services_error_visible,
        is_mf_verification_pending_modal_visible,
        setHasOnlyForwardingContracts,
        toggleServicesErrorModal,
        setIsMFVericationPendingModal,
    } = ui;
    const resetToPreviousMarket = () => {
        setHasOnlyForwardingContracts(false);
        resetPreviousSymbol();
    };

    const marketUnavailableOnConfirm = () => {
        resetToPreviousMarket();
    };

    const marketUnavailableOnCancel = () => {
        window.open(getUrlSmartTrader());
        resetToPreviousMarket();
    };

    const servicesErrorModalOnConfirm = () => {
        toggleServicesErrorModal(false);
        if (services_error.type === 'buy') {
            clearPurchaseInfo();
            resetPurchase();
        }
    };

    return (
        <React.Fragment>
            <MarketUnavailableModal onConfirm={marketUnavailableOnConfirm} onCancel={marketUnavailableOnCancel} />

            <ServicesErrorModal
                onConfirm={servicesErrorModalOnConfirm}
                services_error={services_error}
                is_visible={is_services_error_visible}
                is_virtual={is_virtual}
                is_logged_in={is_logged_in}
            />

            <AccountVerificationPendingModal
                is_visible={is_mf_verification_pending_modal_visible}
                onConfirm={() => setIsMFVericationPendingModal(false)}
            />

            <TradingDisabledByResidenceModal />
        </React.Fragment>
    );
});

export default TradeModals;

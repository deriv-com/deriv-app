import React from 'react';
import { getUrlSmartTrader, urlFor } from '@deriv/shared';
import UnsupportedContractModal from 'App/Components/Elements/Modals/UnsupportedContractModal';
import MarketUnavailableModal from 'App/Components/Elements/Modals/MarketUnavailableModal';
import ServicesErrorModal from 'App/Components/Elements/Modals/ServicesErrorModal';
import { observer, useStore } from '@deriv/stores';
import { useTraderStore } from 'Stores/useTraderStores';

const TradeModals = observer(() => {
    const { ui, client, common } = useStore();
    const { resetPreviousSymbol, clearPurchaseInfo, requestProposal: resetPurchase } = useTraderStore();
    const { is_virtual, is_logged_in } = client;
    const { services_error } = common;
    const {
        is_services_error_visible,
        setHasOnlyForwardingContracts,
        toggleServicesErrorModal,
        toggleUnsupportedContractModal,
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

    const unsupportedContractOnConfirm = () => {
        toggleUnsupportedContractModal(false);
    };

    const unsupportedContractOnClose = () => {
        const portfoliows_url = urlFor('user/portfoliows', { legacy: true });
        window.open(portfoliows_url, '_blank');
        unsupportedContractOnConfirm(false);
    };

    return (
        <React.Fragment>
            <UnsupportedContractModal onConfirm={unsupportedContractOnConfirm} onClose={unsupportedContractOnClose} />

            <MarketUnavailableModal onConfirm={marketUnavailableOnConfirm} onCancel={marketUnavailableOnCancel} />

            <ServicesErrorModal
                onConfirm={servicesErrorModalOnConfirm}
                services_error={services_error}
                is_visible={is_services_error_visible}
                is_virtual={is_virtual}
                is_logged_in={is_logged_in}
            />
        </React.Fragment>
    );
});

export default TradeModals;

import React       from 'react';
import { connect } from 'Stores/connect';
import { urlFor }  from '_common/url';
import 'Sass/app/modules/modals.scss';

const DenialOfServiceModal     = React.lazy(() => import(/* webpackChunkName: "DenialOfServiceModal" */'../DenialOfServiceModal'));
const MarketUnavailableModal   = React.lazy(() => import(/* webpackChunkName: "MarketUnavailableModal" */'../MarketUnavailableModal'));
const ServicesErrorModal       = React.lazy(() => import(/* webpackChunkName: "ServicesErrorModal" */'../ServicesErrorModal'));
const UnsupportedContractModal = React.lazy(() => import(/* webpackChunkName: "UnsupportedContractModal" */'../UnsupportedContractModal'));

const Modals = ({
    is_denial_of_service_modal_visible,
    is_unsupported_contract_modal_visible,
    is_market_unavailable_visible,
    is_services_error_visible,
    toggleUnsupportedContractModal,
    setHasOnlyForwardingContracts,
    resetPreviousSymbol,
    toggleServicesErrorModal,
    resetPurchase,
    services_error,
}) => {
    const unsupportedContractOnConfirm = () => {
        window.open(urlFor('user/portfoliows', undefined, undefined, true), '_blank');
        unsupportedContractOnClose();
    };

    const unsupportedContractOnClose = () => {
        toggleUnsupportedContractModal(false);
    };
    const denialOfServiceOnCancel = () => {
        window.open(urlFor('trading', undefined, undefined, true));
    };
    const denialOfServiceOnConfirm = async (client) => {
        await client.switchAccount(client.virtual_account_loginid);
    };

    const marketUnavailableOnConfirm = () => {
        setHasOnlyForwardingContracts(false);
        resetPreviousSymbol();
    };

    const marketUnavailableOnCancel = () => window.open(urlFor('trading', undefined, undefined, true)) &&
        setHasOnlyForwardingContracts(false);

    const servicesErrorModalOnConfirm = () => {
        toggleServicesErrorModal(false);
        if (services_error.type === 'buy') {
            resetPurchase();
        }
    };

    return (
        <React.Fragment>
            {is_unsupported_contract_modal_visible &&
            <UnsupportedContractModal
                is_visible={is_unsupported_contract_modal_visible}
                onConfirm={unsupportedContractOnConfirm}
                onClose={unsupportedContractOnClose}
            />
            }
            {is_denial_of_service_modal_visible &&
            <DenialOfServiceModal
                is_visible={is_denial_of_service_modal_visible}
                onCancel={denialOfServiceOnCancel}
                onConfirm={denialOfServiceOnConfirm}
            /> }
            {is_market_unavailable_visible &&
            <MarketUnavailableModal
                is_visible={is_market_unavailable_visible}
                onCancel={marketUnavailableOnCancel}
                onConfirm={marketUnavailableOnConfirm}
            /> }
            {is_services_error_visible && <ServicesErrorModal
                is_visible={is_services_error_visible}
                onConfirm={servicesErrorModalOnConfirm}
                services_error={services_error}
            /> }
        </React.Fragment>
    );
};

export default connect(({ ui, client, modules, common }) => ({
    is_unsupported_contract_modal_visible: ui.is_unsupported_contract_modal_visible,
    is_denial_of_service_modal_visible   : !client.is_client_allowed_to_visit,
    is_market_unavailable_visible        : ui.has_only_forward_starting_contracts,
    is_services_error_visible            : ui.is_services_error_visible,
    resetPreviousSymbol                  : modules.trade.resetPreviousSymbol,
    setHasOnlyForwardingContracts        : ui.setHasOnlyForwardingContracts,
    resetPurchase                        : modules.trade.requestProposal,
    services_error                       : common.services_error,
    toggleServicesErrorModal             : ui.toggleServicesErrorModal,
}))(Modals);

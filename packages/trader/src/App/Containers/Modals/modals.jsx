import React       from 'react';
import { connect } from 'Stores/connect';
import { urlFor }  from '_common/url';
import Lazy        from '../Lazy';
import 'Sass/app/modules/modals.scss';

// const AccountSignupModal       = React.lazy(() => import(/* webpackChunkName: "AccountSignupModal" */'./Containers/AccountSignupModal'));

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
            <Lazy
                ctor={() => import(/* webpackChunkName: "UnsupportedContractModal" */'../UnsupportedContractModal')}
                should_load={is_unsupported_contract_modal_visible}
                onConfirm={unsupportedContractOnConfirm}
                onClose={unsupportedContractOnClose}
                is_visible={is_unsupported_contract_modal_visible}
                is='UnsupportedContractModal'
            />
            <Lazy
                ctor={() => import(/* webpackChunkName: "DenialOfServiceModal" */'../DenialOfServiceModal')}
                should_load={is_denial_of_service_modal_visible}
                onConfirm={denialOfServiceOnConfirm}
                onCancel={denialOfServiceOnCancel}
                is_visible={is_denial_of_service_modal_visible}
                is='DenialOfServiceModal'
            />
            <Lazy
                ctor={() => import(/* webpackChunkName: "MarketUnavailableModal" */'../MarketUnavailableModal')}
                should_load={is_denial_of_service_modal_visible}
                onConfirm={marketUnavailableOnConfirm}
                onCancel={marketUnavailableOnCancel}
                is_visible={is_market_unavailable_visible}
                is='MarketUnavailableModal'
            />
            <Lazy
                ctor={() => import(/* webpackChunkName: "ServicesErrorModal" */'../ServicesErrorModal')}
                should_load={is_services_error_visible}
                onConfirm={servicesErrorModalOnConfirm}
                services_error={services_error}
                is='ServicesErrorModal'
            />
            {/* TODO: Enable AccountSignupModal once its UI component is ready */}
            {/* <AccountSignupModal /> */}
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

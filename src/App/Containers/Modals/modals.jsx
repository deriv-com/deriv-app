import React       from 'react';
import { connect } from 'Stores/connect';

const DenialOfServiceModal = React.lazy(() => import(/* webpackChunkName: "DenialOfServiceModal" */'../DenialOfServiceModal'));
const MarketUnavailableModal = React.lazy(() => import(/* webpackChunkName: "MarketUnavailableModal" */'../MarketUnavailableModal'));
const ServicesErrorModal = React.lazy(() => import(/* webpackChunkName: "ServicesErrorModal" */'../ServicesErrorModal'));
const UnsupportedContractModal = React.lazy(() => import(/* webpackChunkName: "UnsupportedContractModal" */'../UnsupportedContractModal'));

const Modals = ({
    is_denial_of_service_modal_visible,
    is_unsupported_contract_modal_visible,
    is_market_unavailable_visible,
    is_services_error_visible,
}) => (
    <React.Fragment>
        {is_unsupported_contract_modal_visible && <UnsupportedContractModal /> }
        {is_denial_of_service_modal_visible && <DenialOfServiceModal /> }
        {is_market_unavailable_visible && <MarketUnavailableModal /> }
        {is_services_error_visible && <ServicesErrorModal /> }
    </React.Fragment>
);

export default connect(({ ui, client }) => ({
    is_unsupported_contract_modal_visible: ui.is_unsupported_contract_modal_visible,
    is_denial_of_service_modal_visible   : !client.is_client_allowed_to_visit,
    is_market_unavailable_visible        : ui.has_only_forward_starting_contracts,
    is_services_error_visible            : ui.is_services_error_visible
}))(Modals);

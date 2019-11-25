import PropTypes         from 'prop-types';
import React             from 'react';
import { withRouter }    from 'react-router-dom';
import { Modal }         from 'deriv-components';
import { localize }      from 'App/i18n';
// import Lazy              from 'App/Containers/Lazy';
import VerticalTab       from 'App/Components/Elements/VerticalTabs';
import WalletInformation from 'Modules/Reports/Containers/wallet-information.jsx';
import { connect }       from 'Stores/connect';

// const modal_content = [
//     {
//         container: 'deposit',
//         icon     : 'IconDepositSmall',
//         label    : localize('Deposit'),
//         // eslint-disable-next-line react/display-name
//         value    : () => (
//             <Lazy
//                 ctor={Deposit}
//                 should_load={true}
//                 has_progress={true}
//             />
//         ),
//     }, {
//         container: 'withdraw',
//         icon     : 'IconWithdrawalSmall',
//         label    : localize('Withdrawal'),
//         // eslint-disable-next-line react/display-name
//         value    : () => (
//             <Lazy
//                 ctor={Withdrawal}
//                 should_load={true}
//                 has_progress={true}
//             />
//         ),
//     }, {
//         container: 'payment_agent',
//         icon     : 'IconPaymentAgent',
//         label    : localize('Payment agent'),
//         // eslint-disable-next-line react/display-name
//         value    : () => (
//             <Lazy
//                 ctor={PaymentAgent}
//                 should_load={true}
//                 has_progress={true}
//             />
//         ),
//     }, {
//         container: 'account_transfer',
//         icon     : 'IconAccountTransfer',
//         label    : localize('Transfer between accounts'),
//         // eslint-disable-next-line react/display-name
//         value    : () => (
//             <Lazy
//                 ctor={AccountTransfer}
//                 should_load={true}
//                 has_progress={true}
//             />
//         ),
//     }, {
//         container: 'payment_agent_transfer',
//         icon     : 'IconAccountTransfer',
//         label    : localize('Transfer to client'),
//         // eslint-disable-next-line react/display-name
//         value    : () => (
//             <Lazy
//                 ctor={PaymentAgentTransfer}
//                 should_load={true}
//                 has_progress={true}
//             />
//         ),
//     },
// ];

class Cashier extends React.Component {
    // onClickDeposit = () => {
    //     this.props.setCashierActiveTab('deposit');
    //     this.props.toggleCashier();
    // };

    constructor(props) {
        super(props);

        this.props.setCashierActiveTab('deposit');
        this.props.toggleCashier();
    }

    render() {
        const {
            active_tab,
            disableApp,
            enableApp,
            is_cashier_visible,
            is_payment_agent_visible,
            is_payment_agent_transfer_visible,
            toggleCashier,
        } = this.props;

        const visible_items = [];

        const menu_options = () => {
            const options = [];

            this.props.routes.forEach(route => {
                options.push({
                    default  : route.default,
                    icon     : route.icon_component,
                    label    : route.title,
                    value    : route.component,
                    path     : route.path,
                    container: route.path,
                });
            });

            return options;
        };

        menu_options().forEach(content => {
            if ((content.container !== 'payment_agent' || is_payment_agent_visible) &&
                (content.container !== 'payment_agent_transfer' || is_payment_agent_transfer_visible)) {
                visible_items.push(content.container);
            }
        });

        const selected_tab = menu_options().find(tab => tab.container === active_tab) || {};

        return (
            <Modal
                id='dt_cashier_modal'
                className='modal-cashier'
                disableApp={disableApp}
                enableApp={enableApp}
                header={<WalletInformation />}
                is_open={is_cashier_visible}
                title={localize('Cashier')}
                toggleModal={toggleCashier}
                height='664px'
                width='904px'
            >
                <VerticalTab
                    alignment='center'
                    classNameHeader='cashier__modal-tab'
                    id='modal'
                    list={menu_options()}
                    selected_index={menu_options().indexOf(selected_tab)}
                    visible_items={visible_items}
                    current_path={ this.props.location.pathname }
                    is_routed
                />
            </Modal>
        );
    }
}

Cashier.propTypes = {
    active_tab                       : PropTypes.string,
    disableApp                       : PropTypes.func,
    enableApp                        : PropTypes.func,
    is_open                          : PropTypes.bool,
    is_payment_agent_transfer_visible: PropTypes.bool,
    is_payment_agent_visible         : PropTypes.bool,
    setCashierActiveTab              : PropTypes.func,
    toggleCashier                    : PropTypes.func,
    toggleModal                      : PropTypes.func,
};

export default connect(({ modules, ui }) => ({
    active_cashier_tab               : ui.active_cashier_tab,
    toggleCashier                    : ui.toggleCashierModal,
    is_cashier_visible               : ui.is_cashier_modal_on,
    setCashierActiveTab              : ui.setCashierActiveTab,
    is_payment_agent_transfer_visible: modules.cashier.config.payment_agent_transfer.is_payment_agent,
    is_payment_agent_visible         : !!(modules.cashier.config.payment_agent.filtered_list.length
        || modules.cashier.config.payment_agent.agents.length),
}))(withRouter(Cashier));

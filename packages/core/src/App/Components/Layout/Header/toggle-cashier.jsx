import PropTypes         from 'prop-types';
import React             from 'react';
import { Button, Modal } from 'deriv-components';
import { localize }      from 'deriv-translations';
import Lazy              from 'App/Containers/Lazy';
import VerticalTab       from 'App/Components/Elements/VerticalTabs';
import WalletInformation from 'Modules/Reports/Containers/wallet-information.jsx';
import UILoader          from '../../Elements/ui-loader.jsx';

const Deposit              = () => import(/* webpackChunkName: "cashier-deposit" */ 'App/Containers/CashierModal/deposit.jsx');
const Withdrawal           = () => import(/* webpackChunkName: "cashier-withdrawal" */ 'App/Containers/CashierModal/withdrawal.jsx');
const PaymentAgent         = () => import(/* webpackChunkName: "cashier-pa" */ 'App/Containers/CashierModal/payment-agent.jsx');
const AccountTransfer      = () => import(/* webpackChunkName: "cashier-account-transfer" */ 'App/Containers/CashierModal/account-transfer.jsx');
const PaymentAgentTransfer = () => import(/* webpackChunkName: "cashier-pa-transfer" */ 'App/Containers/CashierModal/payment-agent-transfer.jsx');
// To work with P2P please uncomment this line
// const P2PCashier           = () => import(/* webpackChunkName: "cashier-otc-payment" */ 'App/Containers/CashierModal/p2p-cashier.jsx');

const modal_content = [
    {
        container: 'deposit',
        icon     : 'IconDepositSmall',
        label    : localize('Deposit'),
        // eslint-disable-next-line react/display-name
        value    : () => (
            <Lazy
                ctor={Deposit}
                should_load={true}
                has_progress={true}
            />
        ),
    }, {
        container: 'withdraw',
        icon     : 'IconWithdrawalSmall',
        label    : localize('Withdrawal'),
        // eslint-disable-next-line react/display-name
        value    : () => (
            <Lazy
                ctor={Withdrawal}
                should_load={true}
                has_progress={true}
            />
        ),
    }, {
        container: 'payment_agent',
        icon     : 'IconPaymentAgent',
        label    : localize('Payment agent'),
        // eslint-disable-next-line react/display-name
        value    : () => (
            <Lazy
                ctor={PaymentAgent}
                should_load={true}
                has_progress={true}
            />
        ),
    }, {
        container: 'account_transfer',
        icon     : 'IconAccountTransfer',
        label    : localize('Transfer between accounts'),
        // eslint-disable-next-line react/display-name
        value    : () => (
            <Lazy
                ctor={AccountTransfer}
                should_load={true}
                has_progress={true}
            />
        ),
    }, {
        container: 'payment_agent_transfer',
        icon     : 'IconAccountTransfer',
        label    : localize('Transfer to client'),
        // eslint-disable-next-line react/display-name
        value    : () => (
            <Lazy
                ctor={PaymentAgentTransfer}
                should_load={true}
                has_progress={true}
            />
        ),
    },
    // To work with P2P please uncomment this line
    // {
    //     container: 'p2p_cashier',
    //     icon     : 'IconP2PCashier',
    //     label    : localize('P2P Cashier'),
    //     // eslint-disable-next-line react/display-name
    //     value    : () => (
    //         <Lazy
    //             ctor={P2PCashier}
    //             should_load={true}
    //             has_progress={true}
    //         />
    //     ),
    // },
];

const ModalContent = ({
    selected_index,
    visible_items,
}) => {
    return (
        <VerticalTab
            alignment='center'
            classNameHeader='cashier__modal-tab'
            id='modal'
            list={modal_content}
            selected_index={selected_index}
            visible_items={visible_items}
        />
    );
};

class ToggleCashier extends React.Component {
    onClickDeposit = () => {
        this.props.setCashierActiveTab('deposit');
        this.props.toggleCashier();
    };

    render() {
        const {
            active_tab,
            className,
            disableApp,
            enableApp,
            is_cashier_visible,
            is_payment_agent_visible,
            is_payment_agent_transfer_visible,
            toggleCashier,
        } = this.props;

        const visible_items = [];

        modal_content.forEach(content => {
            if ((content.container !== 'payment_agent' || is_payment_agent_visible) &&
            (content.container !== 'payment_agent_transfer' || is_payment_agent_transfer_visible)) {
                visible_items.push(content.container);
            }
        });

        const selected_tab = modal_content.find(tab => tab.container === active_tab) || {};

        return (
            <React.Fragment>
                <Button
                    className={className}
                    has_effect
                    text={localize('Deposit')}
                    onClick={this.onClickDeposit}
                    primary
                />
                <React.Suspense fallback={<UILoader />}>
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
                        <ModalContent
                            visible_items={visible_items}
                            selected_index={modal_content.indexOf(selected_tab)}
                        />
                    </Modal>
                </React.Suspense>
            </React.Fragment>
        );
    }
}

ToggleCashier.propTypes = {
    active_tab                       : PropTypes.string,
    className                        : PropTypes.string,
    disableApp                       : PropTypes.func,
    enableApp                        : PropTypes.func,
    is_open                          : PropTypes.bool,
    is_payment_agent_transfer_visible: PropTypes.bool,
    is_payment_agent_visible         : PropTypes.bool,
    setCashierActiveTab              : PropTypes.func,
    toggleCashier                    : PropTypes.func,
    toggleModal                      : PropTypes.func,
};

export default ToggleCashier;

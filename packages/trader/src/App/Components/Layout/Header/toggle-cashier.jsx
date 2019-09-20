import classNames        from 'classnames';
import PropTypes         from 'prop-types';
import React             from 'react';
import { Button, Modal } from 'deriv-components';
import { localize }      from 'App/i18n';
import Lazy              from 'App/Containers/Lazy';
import VerticalTab       from 'App/Components/Elements/VerticalTabs';
import WalletInformation from 'Modules/Reports/Containers/wallet-information.jsx';
import UILoader          from '../../Elements/ui-loader.jsx';

const Deposit      = () => import('App/Containers/CashierModal/deposit.jsx');
const Withdrawal   = () => import('App/Containers/CashierModal/withdrawal.jsx');
const PaymentAgent = () => import('App/Containers/CashierModal/payment-agent.jsx');

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
    },
];

const ModalContent = ({
    selected_index,
    visible_items,
}) => {
    return (
        <VerticalTab
            alignment='center'
            classNameHeader='modal__tab-header'
            id='modal'
            list={modal_content}
            selected_index={selected_index}
            visible_items={visible_items}
        />
    );
};

class ToggleCashier extends React.Component {
    onClickDeposit = () => { this.props.toggleCashier('deposit'); };

    render() {
        const {
            active_tab,
            className,
            disableApp,
            enableApp,
            is_cashier_visible,
            is_payment_agent_visible,
            toggleCashier,
        } = this.props;

        const visible_items = [];

        modal_content.forEach(content => {
            if (content.container !== 'payment_agent' || is_payment_agent_visible) {
                visible_items.push(content.container);
            }
        });

        const selected_tab = modal_content.find(tab => tab.container === active_tab) || {};

        return (
            <React.Fragment>
                <Button
                    className={classNames(className, 'btn--primary--default')}
                    has_effect
                    text={localize('Deposit')}
                    onClick={this.onClickDeposit}
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
    active_tab              : PropTypes.string,
    className               : PropTypes.string,
    disableApp              : PropTypes.func,
    enableApp               : PropTypes.func,
    is_open                 : PropTypes.bool,
    is_payment_agent_visible: PropTypes.bool,
    toggleModal             : PropTypes.func,
};

export default ToggleCashier;

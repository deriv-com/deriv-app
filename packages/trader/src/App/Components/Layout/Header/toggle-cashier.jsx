import classNames        from 'classnames';
import PropTypes         from 'prop-types';
import React             from 'react';
import { Button, Modal } from 'deriv-components';
import { localize }      from 'App/i18n';
import Lazy              from 'App/Containers/Lazy';
import VerticalTab       from 'App/Components/Elements/VerticalTabs';
import UILoader          from '../../Elements/ui-loader.jsx';

const WalletInformation = React.lazy(() => import(/* webpackChunkName: "wallet-information" */'Modules/Reports/Containers/wallet-information.jsx'));
const tabs = {
    deposit : 0,
    withdraw: 1,
};

const Deposit    = () => import('App/Containers/CashierModal/deposit.jsx');
const Withdrawal = () => import('App/Containers/CashierModal/withdrawal.jsx');

const ModalContent = () => {
    const content = [
        {
            icon : 'IconDepositSmall',
            label: localize('Deposit'),
            // eslint-disable-next-line react/display-name
            value: () => (
                <Lazy
                    ctor={Deposit}
                    should_load={true}
                    has_progress={true}
                />
            ),
        }, {
            icon : 'IconWithdrawalSmall',
            label: localize('Withdrawal'),
            // eslint-disable-next-line react/display-name
            value: () => (
                <Lazy
                    ctor={Withdrawal}
                    should_load={true}
                    has_progress={true}
                />
            ),
        },
    ];
    return (
        <VerticalTab
            alignment='center'
            classNameHeader='modal__tab-header'
            id='modal'
            list={content}
        />
    );
};

class ToggleCashier extends React.PureComponent {
    onClickDeposit = () => { this.props.toggleCashier('deposit'); };

    render() {
        const {
            active_tab,
            className,
            disableApp,
            enableApp,
            is_cashier_visible,
            toggleCashier,
        } = this.props;

        return (
            <React.Fragment>
                <Button
                    className={classNames(className, 'btn--primary btn--primary--orange')}
                    has_effect
                    text={localize('Deposit')}
                    onClick={this.onClickDeposit}
                />
                <React.Suspense fallback={<UILoader />}>
                    <Modal
                        className='cashier'
                        disableApp={disableApp}
                        enableApp={enableApp}
                        header={<WalletInformation />}
                        is_open={is_cashier_visible}
                        selected_index={tabs[active_tab]}
                        title={localize('Cashier')}
                        toggleModal={toggleCashier}
                    >
                        <ModalContent />
                    </Modal>
                </React.Suspense>
            </React.Fragment>
        );
    }
}

ToggleCashier.propTypes = {
    active_tab : PropTypes.string,
    className  : PropTypes.string,
    disableApp : PropTypes.func,
    enableApp  : PropTypes.func,
    is_open    : PropTypes.bool,
    toggleModal: PropTypes.func,
};

export default ToggleCashier;

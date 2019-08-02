import classNames   from 'classnames';
import PropTypes    from 'prop-types';
import React        from 'react';
import { localize } from 'App/i18n';
import Lazy         from 'App/Containers/Lazy';
import { Modal }    from 'App/Components/Elements/modal.jsx';
import Button       from '../../Form/button.jsx';
import UILoader     from '../../Elements/ui-loader.jsx';

const WalletInformation = React.lazy(() => import(/* webpackChunkName: "wallet-information" */'Modules/Reports/Containers/wallet-information.jsx'));
const tabs = {
    deposit : 0,
    withdraw: 1,
};
const modal_content = [
    {
        icon : 'IconDepositSmall',
        label: localize('Deposit'),
        // eslint-disable-next-line react/display-name
        value: () => (
            <Lazy
                ctor={() => import('App/Containers/CashierModal/deposit.jsx')}
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
                ctor={() => import('App/Containers/CashierModal/withdrawal.jsx')}
                should_load={true}
                has_progress={true}
            />
        ),
    },
];

class ToggleCashier extends React.PureComponent {
    onClickDeposit = () => { this.props.toggleCashier('deposit'); };

    render() {
        const {
            active_tab,
            className,
            hideFullBlur,
            is_cashier_visible,
            showFullBlur,
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
                        modal_content={modal_content}
                        header={<WalletInformation />}
                        hideFullBlur={hideFullBlur}
                        is_open={is_cashier_visible}
                        selected_index={tabs[active_tab]}
                        showFullBlur={showFullBlur}
                        title={localize('Cashier')}
                        toggleModal={toggleCashier}
                    />
                </React.Suspense>
            </React.Fragment>
        );
    }
}

ToggleCashier.propTypes = {
    active_tab  : PropTypes.string,
    className   : PropTypes.string,
    hideFullBlur: PropTypes.func,
    is_open     : PropTypes.bool,
    showFullBlur: PropTypes.func,
    toggleModal : PropTypes.func,
};

export default ToggleCashier;

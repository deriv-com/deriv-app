import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router';
import { Button, Icon } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import routes from 'Constants/routes';

class AccountTransferReceipt extends React.Component {
    componentWillUnmount() {
        this.props.resetAccountTransfer();
    }

    navigateToStatement = () => {
        this.props.history.push(routes.statement);
    };

    render() {
        const { receipt, selected_from, selected_to } = this.props;

        return (
            <div className='cashier__wrapper account-transfer__receipt'>
                <h2 className='cashier__header'>
                    <Localize i18n_default_text='Your funds have been transferred.' />
                </h2>
                <div className='cashier__transferred-amount cashier__text--bold'>
                    <span className={classNames('symbols', `symbols--${selected_from.currency.toLowerCase()}`)} />
                    {receipt.amount_transferred}
                </div>
                <div className='cashier__transferred-details-wrapper'>
                    <span className='account-transfer__transfer-details-from'>
                        <div className='cashier__transferred-details cashier__transferred-details-from'>
                            <span className='cashier__text--bold'>{selected_from.text}</span>
                            <span className='cashier__text--bold'>{selected_from.value}</span>
                        </div>
                        <Icon
                            icon={
                                selected_from.mt_icon
                                    ? `IcMt5-${selected_from.mt_icon}`
                                    : `IcCurrency-${selected_from.currency.toLowerCase()}`
                            }
                            size={32}
                        />
                    </span>
                    <Icon className='cashier__transferred-icon' icon='IcArrowLeftBold' />
                    <span className='account-transfer__transfer-details-to'>
                        <Icon
                            icon={
                                selected_to.mt_icon
                                    ? `IcMt5-${selected_to.mt_icon}`
                                    : `IcCurrency-${selected_to.currency.toLowerCase()}`
                            }
                            size={32}
                        />
                        <div className='cashier__transferred-details'>
                            <span className='cashier__text--bold'>{selected_to.text}</span>
                            <span className='cashier__text--bold'>{selected_to.value}</span>
                        </div>
                    </span>
                </div>
                <div className='account-transfer__actions'>
                    <Button
                        className='account-transfer__actions-statement'
                        has_effect
                        text={localize('View in statement')}
                        onClick={this.navigateToStatement}
                        secondary
                        large
                    />
                    <Button
                        className='account-transfer__actions-new-withdrawal'
                        has_effect
                        text={localize('New transfer')}
                        onClick={this.props.resetAccountTransfer}
                        primary
                        large
                    />
                </div>
            </div>
        );
    }
}

AccountTransferReceipt.propTypes = {
    receipt: PropTypes.object,
    resetAccountTransfer: PropTypes.func,
    selected_from: PropTypes.object,
    selected_to: PropTypes.object,
};

export default withRouter(
    connect(({ modules }) => ({
        receipt: modules.cashier.config.account_transfer.receipt,
        resetAccountTransfer: modules.cashier.resetAccountTransfer,
        selected_from: modules.cashier.config.account_transfer.selected_from,
        selected_to: modules.cashier.config.account_transfer.selected_to,
    }))(AccountTransferReceipt)
);

import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router';
import { Button, Icon } from '@deriv/components';
import routes from '@deriv/shared/utils/routes';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';

class AccountTransferReceipt extends React.Component {
    openStatement = () => {
        this.props.history.push(routes.statement);
        this.props.resetAccountTransfer();
    };

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
                    <Localize i18n_default_text='Your funds have been transferred' />
                </h2>
                <div className='cashier__transferred-amount cashier__text--bold'>
                    <span className={classNames('symbols', `symbols--${selected_from.currency?.toLowerCase()}`)} />
                    {receipt.amount_transferred}
                </div>
                <div className='cashier__transferred-details-wrapper'>
                    <span className='account-transfer__transfer-details-from'>
                        <div className='cashier__transferred-details'>
                            <div className='cashier__text--bold cashier__text--right'>{selected_from.text}</div>
                            <div className='cashier__text--faint'>
                                {selected_from.value?.replace(/^(MT[DR]?)/i, '')}
                            </div>
                        </div>
                        <Icon
                            icon={
                                selected_from.mt_icon
                                    ? `IcMt5-${selected_from.mt_icon}`
                                    : `IcCurrency-${selected_from.currency?.toLowerCase()}`
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
                                    : `IcCurrency-${selected_to.currency?.toLowerCase()}`
                            }
                            size={32}
                        />
                        <div className='cashier__transferred-details'>
                            <div className='cashier__text--bold'>{selected_to.text}</div>
                            <div className='cashier__text--faint'>{selected_to.value?.replace(/^(MT[DR]?)/i, '')}</div>
                        </div>
                    </span>
                </div>
                <div className='account-transfer__form-submit'>
                    <Button
                        className='account-transfer__button'
                        has_effect
                        text={localize('View in statement')}
                        onClick={this.openStatement}
                        secondary
                        large
                    />
                    <Button
                        className='account-transfer__button'
                        has_effect
                        text={localize('Make a new transfer')}
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

import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router';
import { Button, Modal, Icon } from '@deriv/components';
import { formatMoney, getCurrencyDisplayCode, routes } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';

class AccountTransferReceipt extends React.Component {
    state = {
        is_switch_visible: false,
        switch_to: {},
    };

    openStatement = () => {
        this.props.history.push(routes.statement);
        this.props.resetAccountTransfer();
    };

    checkAccount = () => {
        const { loginid, selected_from, selected_to } = this.props;
        // we should always show the statement of the account transferred to
        // unless if the account transferred to is your logged in account, or
        // the account transferred to is a DMT5 account that can't be switched to and from account is your logged in account
        if (selected_to.value === loginid || (selected_to.is_mt && selected_from.value === loginid)) {
            this.openStatement();
        } else {
            // if the account transferred to is a DMT5 account that can't be switched to, switch to from account instead
            // otherwise switch to the account transferred to
            this.setState({ switch_to: selected_to.is_mt ? selected_from : selected_to });
            this.toggleSwitchAlert();
        }
    };

    switchAndRedirect = async () => {
        await this.props.switchAccount(this.state.switch_to.value);
        this.openStatement();
    };

    toggleSwitchAlert = () => {
        this.setState({ is_switch_visible: !this.state.is_switch_visible });
    };

    componentWillUnmount() {
        this.props.resetAccountTransfer();
    }

    navigateToStatement = () => {
        this.props.history.push(routes.statement);
    };

    render() {
        const { disableApp, enableApp, receipt, selected_from, selected_to } = this.props;

        return (
            <div className='cashier__wrapper account-transfer__receipt'>
                <h2 className='cashier__header'>
                    <Localize i18n_default_text='Your funds have been transferred' />
                </h2>
                <div className='cashier__transferred-amount cashier__text--bold'>
                    {formatMoney(selected_from.currency, receipt.amount_transferred, true)}
                    <span className={classNames('symbols', `symbols--${selected_from.currency?.toLowerCase()}`)}>
                        {getCurrencyDisplayCode(selected_from.currency)}
                    </span>
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
                <div className='account-transfer__receipt-form-submit'>
                    <Button
                        className='account-transfer__button'
                        has_effect
                        text={localize('View in statement')}
                        onClick={this.checkAccount}
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

                <Modal
                    is_open={this.state.is_switch_visible}
                    toggleModal={this.toggleSwitchAlert}
                    enableApp={enableApp}
                    disableApp={disableApp}
                    has_close_icon
                    id='account_transfer_switch_modal'
                    small
                    title={localize('Switching accounts')}
                >
                    <Modal.Body>
                        <Localize
                            i18n_default_text='We’re switching over to your {{currency}} account to view the statement.'
                            values={{ currency: this.state.switch_to.currency }}
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button has_effect text={localize('OK')} onClick={this.switchAndRedirect} primary large />
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

AccountTransferReceipt.propTypes = {
    disableApp: PropTypes.func,
    enableApp: PropTypes.func,
    loginid: PropTypes.string,
    receipt: PropTypes.object,
    resetAccountTransfer: PropTypes.func,
    selected_from: PropTypes.object,
    selected_to: PropTypes.object,
    switchAccount: PropTypes.func,
};

export default withRouter(
    connect(({ client, modules, ui }) => ({
        loginid: client.loginid,
        switchAccount: client.switchAccount,
        receipt: modules.cashier.config.account_transfer.receipt,
        resetAccountTransfer: modules.cashier.resetAccountTransfer,
        selected_from: modules.cashier.config.account_transfer.selected_from,
        selected_to: modules.cashier.config.account_transfer.selected_to,
        disableApp: ui.disableApp,
        enableApp: ui.enableApp,
    }))(AccountTransferReceipt)
);

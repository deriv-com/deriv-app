import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router';
import { Button, Modal, Icon, Text } from '@deriv/components';
import { formatMoney, getCurrencyDisplayCode, isMobile, routes } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import './account-transfer-receipt.scss';

const AccountTransferReceipt = ({
    disableApp,
    enableApp,
    history,
    is_from_derivgo,
    loginid,
    receipt,
    resetAccountTransfer,
    selected_from,
    selected_to,
    switchAccount,
}) => {
    const [is_switch_visible, setIsSwitchVisible] = React.useState(false);
    const [switch_to, setSwitchTo] = React.useState({});

    React.useEffect(() => {
        return () => {
            resetAccountTransfer();
        };
    }, [resetAccountTransfer]);

    const openStatement = () => {
        history.push(routes.statement);
        resetAccountTransfer();
    };

    const switchAndRedirect = async () => {
        await switchAccount(switch_to.value);
        openStatement();
    };

    const toggleSwitchAlert = () => {
        setIsSwitchVisible(!is_switch_visible);
    };

    const checkAccount = () => {
        // we should always show the statement of the account transferred to
        // unless if the account transferred to is your logged in account, or
        // the account transferred to is a DMT5 account that can't be switched to and from account is your logged in account
        if (
            selected_to.value === loginid ||
            ((selected_to.is_mt || selected_to.is_dxtrade) && selected_from.value === loginid)
        ) {
            openStatement();
        } else {
            // if the account transferred to is a DMT5 account that can't be switched to, switch to from account instead
            // otherwise switch to the account transferred to
            setSwitchTo(selected_to.is_mt ? selected_from : selected_to);
            toggleSwitchAlert();
        }
    };

    return (
        <div className='account-transfer-receipt__crypto'>
            <Text as='h2' color='prominent' align='center' weight='bold' className='cashier__header'>
                <Localize i18n_default_text='Your funds have been transferred' />
            </Text>
            <div className='account-transfer-receipt__crypto--amount'>
                <Text as='p' size='l' weight='bold' color='profit-success'>
                    <Localize
                        i18n_default_text='{{amount}} {{currency}}'
                        values={{
                            amount: formatMoney(selected_from.currency, receipt.amount_transferred, true),
                            currency: getCurrencyDisplayCode(selected_from.currency),
                        }}
                    />
                </Text>
            </div>
            <div className='account-transfer-receipt__crypto--details-wrapper'>
                <div className='crypto-transfer-from'>
                    <div className='crypto-transfer-from-details'>
                        <Icon
                            icon={selected_from.platform_icon || `IcCurrency-${selected_from.currency?.toLowerCase()}`}
                            size={32}
                        />
                        <Text as='p' size='s' weight='bold'>
                            <Localize i18n_default_text={selected_from.text} />
                        </Text>
                    </div>
                    <Text as='p' size='s' color='less-prominent' align='center'>
                        {selected_from.value}
                    </Text>
                </div>
                <Icon className='crypto-transferred-icon' icon='IcArrowDownBold' />
                <div className='crypto-transfer-to'>
                    <div className='crypto-transfer-to-details'>
                        <Icon
                            icon={selected_to.platform_icon || `IcCurrency-${selected_to.currency?.toLowerCase()}`}
                            size={32}
                        />
                        <Text as='p' size='s' weight='bold'>
                            <Localize i18n_default_text={selected_to.text} />
                        </Text>
                    </div>
                    <Text as='p' size='s' color='less-prominent' align='center'>
                        {selected_to.value}
                    </Text>
                </div>
            </div>
            <div className='account-transfer-receipt__crypto--form-submit'>
                {!is_from_derivgo && (
                    <Button
                        className='account-transfer-receipt__button'
                        has_effect
                        text={localize('View transaction details')}
                        onClick={checkAccount}
                        secondary
                        large
                    />
                )}
                <Button
                    className='account-transfer-receipt__button'
                    has_effect
                    text={localize('Make a new transfer')}
                    onClick={resetAccountTransfer}
                    primary
                    large
                />
            </div>
            <Modal
                is_open={is_switch_visible}
                toggleModal={toggleSwitchAlert}
                enableApp={enableApp}
                disableApp={disableApp}
                has_close_icon={isMobile()}
                className='account_transfer_switch_modal'
                small
                title={localize(`Switch to ${switch_to.currency} account?`)}
            >
                <Modal.Body>
                    <Localize
                        i18n_default_text='We’re switching over to your {{currency}} account to view the transaction.'
                        values={{ currency: switch_to.currency }}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button has_effect text={localize('Cancel')} onClick={toggleSwitchAlert} secondary large />
                    <Button
                        has_effect
                        text={localize(`Switch to ${switch_to.currency} account`)}
                        onClick={switchAndRedirect}
                        primary
                        large
                    />
                </Modal.Footer>
            </Modal>
        </div>
    );
};

AccountTransferReceipt.propTypes = {
    disableApp: PropTypes.func,
    enableApp: PropTypes.func,
    history: PropTypes.object,
    is_from_derivgo: PropTypes.bool,
    loginid: PropTypes.string,
    receipt: PropTypes.object,
    resetAccountTransfer: PropTypes.func,
    selected_from: PropTypes.object,
    selected_to: PropTypes.object,
    switchAccount: PropTypes.func,
};

export default withRouter(
    connect(({ client, common, modules, ui }) => ({
        disableApp: ui.disableApp,
        enableApp: ui.enableApp,
        is_from_derivgo: common.is_from_derivgo,
        loginid: client.loginid,
        receipt: modules.cashier.account_transfer.receipt,
        resetAccountTransfer: modules.cashier.account_transfer.resetAccountTransfer,
        selected_from: modules.cashier.account_transfer.selected_from,
        selected_to: modules.cashier.account_transfer.selected_to,
        switchAccount: client.switchAccount,
    }))(AccountTransferReceipt)
);

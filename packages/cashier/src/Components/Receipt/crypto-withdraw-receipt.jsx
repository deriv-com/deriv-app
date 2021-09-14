import PropTypes from 'prop-types';
import React from 'react';
import { Button, Clipboard, Icon, Text } from '@deriv/components';
import { isCryptocurrency, isMobile } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import RecentTransaction from 'Components/recent-transaction.jsx';
import { getAccountText } from '../../_common/utility';
import '../../Sass/withdraw.scss';

const Status = () => {
    return (
        <Text as='p' color='prominent' weight='bold' align='center' className='withdraw__receipt-status'>
            <Icon icon='IcCircleDynamicColor' color='orange' size={8} className='withdraw__receipt-status-icon' />
            <Localize i18n_default_text='In review' />
        </Text>
    );
};

const AcountInformation = ({ account }) => {
    return (
        <div className='withdraw__account-info'>
            <div className='withdraw__account-info-detail'>
                <Icon icon={account?.platform_icon || `IcCurrency-${account?.currency?.toLowerCase()}`} size={32} />
                <Text
                    color='prominent'
                    weight='bold'
                    size={isMobile() ? 'xxs' : 's'}
                    align='center'
                    className='withdraw__account-info-detail-text'
                >
                    {account?.currency?.toUpperCase()}
                </Text>
            </div>
            <Text
                color='less-prominent'
                size={isMobile() ? 'xs' : 's'}
                align='center'
                className='withdraw__account-info-detail-text'
            >
                {account?.value}
            </Text>
        </div>
    );
};

const WalletInformation = ({ account, blockchain_address }) => {
    const text = getAccountText(account);
    return (
        <div className='withdraw__account-info'>
            <div className='withdraw__account-info-detail'>
                <Icon icon='IcCashierWithdrawWallet' size={32} />
                <Text color='prominent' weight='bold' align='center' className='withdraw__account-info-detail-text'>
                    <Localize
                        i18n_default_text='{{account_text}} wallet'
                        values={{
                            account_text: text,
                        }}
                    />
                </Text>
            </div>
            <div className='withdraw__account-info-address'>
                <Text
                    color='less-prominent'
                    as='p'
                    size={isMobile() ? 'xxs' : 'xs'}
                    align='center'
                    className='withdraw__account-info-detail-text'
                >
                    {blockchain_address}
                </Text>
                <Clipboard
                    text_copy={blockchain_address}
                    info_message={isMobile() ? '' : localize('copy')}
                    icon='IcCashierClipboard'
                    success_message={localize('copied!')}
                    popoverAlignment={isMobile() ? 'left' : 'bottom'}
                />
            </div>
        </div>
    );
};

const CryptoWithdrawReceipt = ({
    account,
    blockchain_address,
    withdraw_amount,
    crypto_transactions,
    currency,
    resetWithrawForm,
    recentTransactionOnMount,
    setIsCryptoTransactionsVisible,
    setIsWithdrawConfirmed,
}) => {
    React.useEffect(() => {
        recentTransactionOnMount();
    }, [recentTransactionOnMount]);

    React.useEffect(() => {
        return () => {
            setIsWithdrawConfirmed(false);
            resetWithrawForm();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className='cashier__wrapper withdraw__wrapper'>
            <Text
                as='h2'
                color='prominent'
                weight='bold'
                align='center'
                className='cashier__header cashier__content-header'
            >
                <Localize i18n_default_text='Your withdrawal will be processed within 24 hours' />
            </Text>
            <div className='withdraw__receipt-detail'>
                {!isMobile() && <Status />}
                <Text
                    as='p'
                    color='prominent'
                    weight='bold'
                    align='center'
                    size={isMobile() ? 'm' : 'l'}
                    className='withdraw__receipt-crypto'
                >
                    <Localize
                        i18n_default_text='{{withdraw_amount}} {{currency_symbol}}'
                        values={{
                            withdraw_amount,
                            currency_symbol: currency?.toUpperCase(),
                        }}
                    />
                </Text>
                {isMobile() && <Status />}
                <AcountInformation account={account} />
                <Icon className='withdraw__receipt-icon' icon='IcArrowDown' size={30} />
                <WalletInformation account={account} blockchain_address={blockchain_address} />
            </div>
            <div className='withdraw__receipt-button-wrapper'>
                <Button
                    id='withdraw_transaction'
                    className='withdraw__receipt-button withdraw__receipt-button-left'
                    text={localize('View transaction history')}
                    onClick={() => setIsCryptoTransactionsVisible(true)}
                    secondary
                />
                <Button
                    id='withdraw_receipt'
                    className='withdraw__receipt-button'
                    has_effect
                    text={localize('Make a new withdrawal')}
                    onClick={() => setIsWithdrawConfirmed(false)}
                    primary
                />
            </div>
            {isMobile() && isCryptocurrency(currency) && crypto_transactions?.length ? <RecentTransaction /> : null}
        </div>
    );
};

CryptoWithdrawReceipt.propTypes = {
    account: PropTypes.object,
    crypto_transactions: PropTypes.array,
    blockchain_address: PropTypes.string,
    currency: PropTypes.string,
    resetWithrawForm: PropTypes.func,
    recentTransactionOnMount: PropTypes.func,
    setIsCryptoTransactionsVisible: PropTypes.func,
    setIsWithdrawConfirmed: PropTypes.func,
};

export default connect(({ client, modules }) => ({
    account: modules.cashier.config.account_transfer.selected_from,
    blockchain_address: modules.cashier.blockchain_address,
    withdraw_amount: modules.cashier.withdraw_amount,
    crypto_transactions: modules.cashier.transaction_history.crypto_transactions,
    currency: client.currency,
    resetWithrawForm: modules.cashier.resetWithrawForm,
    recentTransactionOnMount: modules.cashier.transaction_history.onMount,
    setIsCryptoTransactionsVisible: modules.cashier.transaction_history.setIsCryptoTransactionsVisible,
    setIsWithdrawConfirmed: modules.cashier.setIsWithdrawConfirmed,
}))(CryptoWithdrawReceipt);

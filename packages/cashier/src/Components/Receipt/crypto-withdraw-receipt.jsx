import PropTypes from 'prop-types';
import React from 'react';
import { Button, Clipboard, Icon, Text } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
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
                <Text color='prominent' weight='bold' align='center' className='withdraw__account-info-detail-text'>
                    {getAccountText(account)}
                </Text>
            </div>
            <Text color='less-prominent' align='center' className='withdraw__account-info-detail-text'>
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
                <Text color='less-prominent' align='center' className='withdraw__account-info-detail-text'>
                    {blockchain_address}
                </Text>
                <Clipboard text_copy={blockchain_address} popoverAlignment='top' />
            </div>
        </div>
    );
};

const CryptoWithdrawReceipt = ({ account, amount, blockchain_address, currency, setIsWithdrawConfirmed }) => {
    React.useEffect(() => {
        return () => setIsWithdrawConfirmed(false);
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
                    size='l'
                    className='withdraw__receipt-crypto'
                >
                    <Localize
                        i18n_default_text='{{withdraw_amount}} {{currency_symbol}}'
                        values={{
                            withdraw_amount: amount,
                            currency_symbol: currency?.toUpperCase(),
                        }}
                    />
                </Text>
                {isMobile() && <Status />}
                <AcountInformation account={account} />
                <Icon className='withdraw__receipt-icon' icon='IcArrowDown' size={30} />
                <WalletInformation account={account} blockchain_address={blockchain_address} />
                <Button
                    id='cashier_learn_more'
                    className='withdraw__receipt-button'
                    text={localize('View transaction history')}
                    // onClick={() => window.open(getStaticUrl('/payment-methods'))}
                    secondary
                />
            </div>
        </div>
    );
};

CryptoWithdrawReceipt.propTypes = {
    account: PropTypes.object,
    blockchain_address: PropTypes.string,
    currency: PropTypes.string,
    setIsWithdrawConfirmed: PropTypes.func,
};

export default connect(({ client, modules }) => ({
    account: modules.cashier.config.account_transfer.selected_from,
    blockchain_address: modules.cashier.blockchain_address,
    currency: client.currency,
    setIsWithdrawConfirmed: modules.cashier.config.withdraw.setIsWithdrawConfirmed,
}))(CryptoWithdrawReceipt);

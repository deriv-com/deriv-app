import React, { useEffect } from 'react';
import { Icon, Text, WalletCard, Clipboard, Button } from '@deriv/components';
import { useActiveWallet } from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';
import { useCashierStore } from '../../../stores/useCashierStores';
import './crypto-withdraw-receipt-wallet.scss';

const CryptoWithdrawReceiptWallet = observer(() => {
    const active_wallet = useActiveWallet();
    const { client, ui, traders_hub } = useStore();
    const { is_mobile } = ui;
    const { setWalletModalActiveTab } = traders_hub;
    const { setVerificationCode } = client;
    const { withdraw } = useCashierStore();

    const { blockchain_address, resetWithdrawForm, setIsWithdrawConfirmed, withdraw_amount } = withdraw;

    const resetVerification = () => {
        setVerificationCode('', 'payment_withdraw');
        setIsWithdrawConfirmed(false);
        resetWithdrawForm();
    };

    const openTransactionsTab = () => {
        setWalletModalActiveTab('Transactions');
        resetVerification();
    };

    const closeWithdrawForm = () => {
        setWalletModalActiveTab('Withdraw');
        resetVerification();
    };

    useEffect(() => {
        return () => {
            resetVerification();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const wallet: React.ComponentProps<typeof WalletCard>['wallet'] = {
        balance: `-${withdraw_amount}`,
        currency: active_wallet?.currency || '',
        icon: active_wallet?.icon || '',
        icon_type: active_wallet?.is_fiat_currency ? 'fiat' : 'crypto',
        jurisdiction_title: active_wallet?.landing_company_name || '',
        name: `${active_wallet?.wallet_currency_type} ${localize('wallet')}`,
        gradient_class: active_wallet?.gradient_card_class || '',
    };

    return (
        <div className='crypto-withdraw-receipt-wallet'>
            <WalletCard wallet={wallet} size='medium' />
            <Icon className='crypto-withdraw-receipt-wallet__icon' icon='IcArrowDownBold' size={16} />
            <Text
                as='p'
                color='less-prominent'
                size={is_mobile ? 'xxxxs' : 'xxxs'}
                align='center'
                className='crypto-withdraw-receipt-wallet__address-header'
            >
                <Localize i18n_default_text='Destination address' />
            </Text>
            <div className='crypto-withdraw-receipt-wallet__account-info-address'>
                <Text
                    color='prominent'
                    as='p'
                    size={is_mobile ? 'xxs' : 's'}
                    weight='bold'
                    align='center'
                    className='crypto-withdraw-receipt-wallet__account-info-detail-text'
                >
                    {blockchain_address}
                </Text>
                <Clipboard
                    text_copy={blockchain_address}
                    info_message={is_mobile ? '' : localize('copy to clipboard')}
                    icon='IcWalletClipboard'
                    success_message={localize('copied!')}
                    className='crypto-withdraw-receipt-wallet__account-info-clipboard'
                    popoverAlignment={is_mobile ? 'left' : 'bottom'}
                />
            </div>
            <div className='crypto-withdraw-receipt-wallet__amount-wrapper'>
                <Text as='p' color='prominent' weight='bold' size={is_mobile ? 'xsm' : 'm'} align='center'>
                    {withdraw_amount} {active_wallet?.currency?.toUpperCase()}
                </Text>

                {is_mobile && (
                    <Text as='p' color='prominent' size={is_mobile ? 'xs' : 's'} align='center'>
                        <Localize i18n_default_text='Your withdrawal is currently in review. It will be processed within 24 hours. We’ll send you an email once your transaction has been processed.' />
                    </Text>
                )}

                {!is_mobile && (
                    <>
                        <Text as='p' color='prominent' size={is_mobile ? 'xs' : 's'} align='center'>
                            <Localize i18n_default_text='Your withdrawal is currently in review. It will be processed within 24 hours.' />
                        </Text>
                        <Text as='p' color='prominent' size={is_mobile ? 'xs' : 's'} align='center'>
                            <Localize i18n_default_text='We’ll send you an email once your transaction has been processed.' />
                        </Text>
                    </>
                )}
            </div>
            <div className='crypto-withdraw-receipt-wallet__button-wrapper'>
                <Button
                    id='crypto-withdraw-receipt-transaction'
                    text={localize('View transactions')}
                    onClick={() => openTransactionsTab()}
                    secondary
                    large
                />
                <Button
                    id='crypto-withdraw-receipt-close'
                    has_effect
                    text={localize('Close')}
                    onClick={() => closeWithdrawForm()}
                    primary
                    large
                />
            </div>
        </div>
    );
});

export default CryptoWithdrawReceiptWallet;

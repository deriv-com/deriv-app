import React from 'react';
import { observer, useStore } from '@deriv/stores';
import { Div100vhContainer, Icon, Text, WalletCard, Clipboard, Button } from '@deriv/components';
import { useCashierStore } from '../../../stores/useCashierStores';
import './crypto-withdraw-receipt-wallet.scss';
import { Localize, localize } from '@deriv/translations';
import { useActiveWallet } from '@deriv/hooks';

// Demo
type TWallet = {
    balance: string;
    currency: string;
    icon: string;
    icon_type: 'fiat' | 'crypto' | 'app' | 'demo';
    jurisdiction_title: string;
    name: string;
    gradient_class: string;
};

const CryptoWithdrawReceiptWallet = observer(() => {
    const active_wallet = useActiveWallet();
    const { client, ui, traders_hub } = useStore();
    const { is_mobile } = ui;
    const { setWalletModalActiveTab } = traders_hub;
    const { setVerificationCode } = client;
    const { withdraw } = useCashierStore();

    const { blockchain_address, resetWithdrawForm, setIsWithdrawConfirmed, withdraw_amount } = withdraw;

    const closeWithdrawForm = () => {
        setVerificationCode('', 'payment_withdraw');
        setWalletModalActiveTab('Withdraw');
        setIsWithdrawConfirmed(false);
        resetWithdrawForm();
    };

    // Demo Purpose
    const wallet: TWallet = {
        balance: `-${withdraw_amount}`,
        currency: active_wallet?.currency || '',
        icon: active_wallet?.icon || '',
        icon_type: 'crypto',
        jurisdiction_title: active_wallet?.landing_company_name || '',
        name: 'BTC Wallet',
        gradient_class: active_wallet?.gradient_card_class || '',
    };

    return (
        <Div100vhContainer height_offset='344px'>
            <div className='crypto-withdraw-receipt-wallet'>
                <WalletCard wallet={wallet} size='medium' />
                <Icon className='crypto-withdraw-receipt-wallet__icon' icon='IcArrowDown' size={16} />
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
                        icon='IcCashierClipboard'
                        success_message={localize('copied!')}
                        className='crypto-withdraw-receipt-wallet__account-info-clipboard'
                        popoverAlignment={is_mobile ? 'left' : 'bottom'}
                    />
                </div>
                <div className='crypto-withdraw-receipt-wallet__amount-wrapper'>
                    <Text as='p' color='prominent' weight='bold' size={is_mobile ? 'xsm' : 'm'} align='center'>
                        {withdraw_amount} {active_wallet?.currency?.toUpperCase()}
                    </Text>
                    <Text as='p' color='prominent' size={is_mobile ? 'xs' : 's'} align='center'>
                        <Localize i18n_default_text='Your withdrawal is currently in review. It will be processed within 24 hours. We’ll send you an email once your transaction has been processed.' />
                    </Text>
                </div>
                <div className='crypto-withdraw-receipt-wallet__button-wrapper'>
                    <Button
                        id='crypto-withdraw-receipt-transaction'
                        text={localize('View transactions')}
                        onClick={() => setWalletModalActiveTab('Transactions')}
                        secondary
                        medium
                    />
                    <Button
                        id='crypto-withdraw-receipt-close'
                        has_effect
                        text={localize('Close')}
                        onClick={() => closeWithdrawForm()}
                        primary
                        medium
                    />
                </div>
            </div>
        </Div100vhContainer>
    );
});

export default CryptoWithdrawReceiptWallet;

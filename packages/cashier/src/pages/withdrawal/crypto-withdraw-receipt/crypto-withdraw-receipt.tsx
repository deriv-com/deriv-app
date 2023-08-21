import React from 'react';
import { Button, Clipboard, Icon, Text } from '@deriv/components';
import { isCryptocurrency } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { useStore, observer } from '@deriv/stores';
import { TAccount } from '../../../types';
import { getAccountText } from '../../../utils/utility';
import RecentTransaction from '../../../components/recent-transaction';
import { useCashierStore } from '../../../stores/useCashierStores';
import './crypto-withdraw-receipt.scss';

type TWalletInformationProps = {
    account: TAccount;
    blockchain_address: string;
};

const Status = () => {
    return (
        <Text as='p' color='prominent' weight='bold' align='center' className='crypto-withdraw-receipt__status'>
            <Icon
                icon='IcCircleDynamicColor'
                color='orange'
                size={8}
                className='crypto-withdraw-receipt__status-icon'
            />
            <Localize i18n_default_text='In review' />
        </Text>
    );
};

const AccountInformation = observer(({ account }: { account: TAccount }) => {
    const {
        ui: { is_mobile },
    } = useStore();

    return (
        <div className='crypto-withdraw-receipt__account-info'>
            <div className='crypto-withdraw-receipt__account-info-detail'>
                <Icon icon={account?.platform_icon || `IcCurrency-${account?.currency?.toLowerCase()}`} size={32} />
                <Text
                    color='prominent'
                    weight='bold'
                    size={is_mobile ? 'xxs' : 's'}
                    align='center'
                    className='crypto-withdraw-receipt__account-info-detail-text'
                >
                    {account?.currency?.toUpperCase()}
                </Text>
            </div>
            <Text
                color='less-prominent'
                size={is_mobile ? 'xs' : 's'}
                align='center'
                className='crypto-withdraw-receipt__account-info-detail-text'
            >
                {account?.value}
            </Text>
        </div>
    );
});

const WalletInformation = observer(({ account, blockchain_address }: TWalletInformationProps) => {
    const {
        ui: { is_mobile },
    } = useStore();
    const text = getAccountText(account);
    return (
        <div className='crypto-withdraw-receipt__account-info'>
            <div className='crypto-withdraw-receipt__account-info-detail'>
                <Icon icon='IcCashierWithdrawWallet' size={32} />
                <Text
                    color='prominent'
                    weight='bold'
                    align='center'
                    className='crypto-withdraw-receipt__account-info-detail-text'
                >
                    <Localize
                        i18n_default_text='{{account_text}} wallet'
                        values={{
                            account_text: text,
                        }}
                    />
                </Text>
            </div>
            <div className='crypto-withdraw-receipt__account-info-address'>
                <Text
                    color='less-prominent'
                    as='p'
                    size={is_mobile ? 'xxs' : 'xs'}
                    align='center'
                    className='crypto-withdraw-receipt__account-info-detail-text'
                >
                    {blockchain_address}
                </Text>
                <Clipboard
                    text_copy={blockchain_address}
                    info_message={is_mobile ? '' : localize('copy')}
                    icon='IcCashierClipboard'
                    success_message={localize('copied!')}
                    popoverAlignment={is_mobile ? 'left' : 'bottom'}
                />
            </div>
        </div>
    );
});

const CryptoWithdrawReceipt = observer(() => {
    const { client, ui } = useStore();
    const { is_mobile } = ui;
    const { currency, is_switching } = client;
    const { account_transfer, general_store, transaction_history, withdraw } = useCashierStore();
    const { selected_from: account } = account_transfer;
    const { cashier_route_tab_index: tab_index } = general_store;
    const { setIsCryptoTransactionsVisible } = transaction_history;

    const { blockchain_address, resetWithdrawForm, setIsWithdrawConfirmed, withdraw_amount } = withdraw;

    React.useEffect(() => {
        return () => {
            setIsWithdrawConfirmed(false);
            resetWithdrawForm();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [is_switching, tab_index]);

    return (
        <div className='cashier__wrapper'>
            <Text
                as='h2'
                color='prominent'
                weight='bold'
                align='center'
                className='cashier__header cashier__content-header'
            >
                <Localize i18n_default_text='Your withdrawal will be processed within 24 hours' />
            </Text>
            <div className='crypto-withdraw-receipt__detail'>
                {!is_mobile && <Status />}
                <Text
                    as='p'
                    color='profit-success'
                    weight='bold'
                    align='center'
                    size={is_mobile ? 'm' : 'l'}
                    className='crypto-withdraw-receipt__crypto'
                >
                    <Localize
                        i18n_default_text='{{withdraw_amount}} {{currency_symbol}}'
                        values={{
                            withdraw_amount,
                            currency_symbol: currency?.toUpperCase(),
                        }}
                    />
                </Text>
                {is_mobile && <Status />}
                <AccountInformation account={account} />
                <Icon className='crypto-withdraw-receipt__icon' icon='IcArrowDown' size={30} />
                <WalletInformation account={account} blockchain_address={blockchain_address} />
            </div>
            <div className='crypto-withdraw-receipt__button-wrapper'>
                <Button
                    id='withdraw_transaction'
                    className='crypto-withdraw-receipt__button crypto-withdraw-receipt__button-left'
                    text={localize('View transaction history')}
                    onClick={() => setIsCryptoTransactionsVisible(true)}
                    secondary
                />
                <Button
                    id='crypto-withdraw-receipt'
                    className='crypto-withdraw-receipt__button'
                    has_effect
                    text={localize('Make a new withdrawal')}
                    onClick={() => setIsWithdrawConfirmed(false)}
                    primary
                />
            </div>
            {is_mobile && isCryptocurrency(currency) && <RecentTransaction />}
        </div>
    );
});

export default CryptoWithdrawReceipt;

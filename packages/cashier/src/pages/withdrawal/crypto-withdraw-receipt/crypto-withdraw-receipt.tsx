import React from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Clipboard, Icon, Text } from '@deriv/components';
import { isCryptocurrency, isMobile } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { TAccount } from 'Types';
import { getAccountText } from 'Utils/utility';
import RecentTransaction from 'Components/recent-transaction';
import { useStore } from '../../../hooks';
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

const AcountInformation = ({ account }: { account: TAccount }) => {
    return (
        <div className='crypto-withdraw-receipt__account-info'>
            <div className='crypto-withdraw-receipt__account-info-detail'>
                <Icon icon={account?.platform_icon || `IcCurrency-${account?.currency?.toLowerCase()}`} size={32} />
                <Text
                    color='prominent'
                    weight='bold'
                    size={isMobile() ? 'xxs' : 's'}
                    align='center'
                    className='crypto-withdraw-receipt__account-info-detail-text'
                >
                    {account?.currency?.toUpperCase()}
                </Text>
            </div>
            <Text
                color='less-prominent'
                size={isMobile() ? 'xs' : 's'}
                align='center'
                className='crypto-withdraw-receipt__account-info-detail-text'
            >
                {account?.value}
            </Text>
        </div>
    );
};

const WalletInformation = ({ account, blockchain_address }: TWalletInformationProps) => {
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
                    size={isMobile() ? 'xxs' : 'xs'}
                    align='center'
                    className='crypto-withdraw-receipt__account-info-detail-text'
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

const CryptoWithdrawReceipt = () => {
    const {
        client,
        modules: {
            cashier: { account_transfer, general_store, transaction_history, withdraw },
        },
    } = useStore();

    const { selected_from: account } = account_transfer;

    const { currency, is_switching } = client;

    const { cashier_route_tab_index: tab_index } = general_store;

    const {
        crypto_transactions,
        onMount: recentTransactionOnMount,
        setIsCryptoTransactionsVisible,
    } = transaction_history;

    const { blockchain_address, resetWithrawForm, setIsWithdrawConfirmed, withdraw_amount } = withdraw;

    React.useEffect(() => {
        recentTransactionOnMount();
    }, [recentTransactionOnMount]);

    React.useEffect(() => {
        return () => {
            setIsWithdrawConfirmed(false);
            resetWithrawForm();
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
                {!isMobile() && <Status />}
                <Text
                    as='p'
                    color='profit-success'
                    weight='bold'
                    align='center'
                    size={isMobile() ? 'm' : 'l'}
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
                {isMobile() && <Status />}
                <AcountInformation account={account} />
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
            {isMobile() && isCryptocurrency(currency) && crypto_transactions?.length ? <RecentTransaction /> : null}
        </div>
    );
};

export default observer(CryptoWithdrawReceipt);

import React from 'react';
import { Button, Clipboard, Icon, Text } from '@deriv/components';
import { useCryptoTransactions, useCurrentCurrencyConfig } from '@deriv/hooks';
import { TModifiedTransaction } from '@deriv/hooks/src/useCryptoTransactions';
import { observer, useStore } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';
import { useDevice } from '@deriv-com/ui';
import { useCashierStore } from 'Stores/useCashierStores';
import { TAccount } from 'Types';
import { getAccountText } from 'Utils/utility';
import { cryptoTransactionMapper } from '../../../modules/transactions-crypto/helpers';
import './withdrawal-crypto-receipt.scss';

type TWalletInformationProps = {
    account: TAccount;
    blockchain_address: string;
    is_mobile: boolean;
};

type TStatusProps = {
    last_transaction:
        | (TModifiedTransaction & {
              is_deposit: boolean;
              is_withdrawal: boolean;
          })
        | undefined;
};

const Status = ({ last_transaction }: TStatusProps) => {
    const [status, setStatus] = React.useState({ status_color: 'warning', status_name: 'In review' });

    const colorMap: { [key: string]: string } = {
        warning: 'orange',
        unsuccessful: 'red',
        default: 'green',
    };

    React.useEffect(() => {
        if (last_transaction) {
            const { status_color, status_name } = cryptoTransactionMapper(last_transaction);
            setStatus({ status_color, status_name });
        }
    }, [last_transaction]);

    return (
        <Text as='p' color='prominent' weight='bold' align='center' className='withdrawal-crypto-receipt__status'>
            <Icon
                icon='IcCircleDynamicColor'
                color={colorMap[status.status_color] || colorMap.default}
                size={8}
                className='withdrawal-crypto-receipt__status-icon'
            />
            {status.status_name}
        </Text>
    );
};

const AccountInformation = ({ account, is_mobile }: { account: TAccount; is_mobile: boolean }) => {
    return (
        <div className='withdrawal-crypto-receipt__account-info'>
            <div className='withdrawal-crypto-receipt__account-info-detail'>
                <Icon icon={account?.platform_icon || `IcCurrency-${account?.currency?.toLowerCase()}`} size={32} />
                <Text
                    color='prominent'
                    weight='bold'
                    size={is_mobile ? 'xxs' : 's'}
                    align='center'
                    className='withdrawal-crypto-receipt__account-info-detail-text'
                >
                    {account?.currency?.toUpperCase()}
                </Text>
            </div>
            <Text
                color='less-prominent'
                size={is_mobile ? 'xs' : 's'}
                align='center'
                className='withdrawal-crypto-receipt__account-info-detail-text'
            >
                {account?.value}
            </Text>
        </div>
    );
};

const WalletInformation = ({ account, blockchain_address, is_mobile }: TWalletInformationProps) => {
    const text = getAccountText(account);
    return (
        <div className='withdrawal-crypto-receipt__account-info'>
            <div className='withdrawal-crypto-receipt__account-info-detail'>
                <Icon icon='IcCashierWithdrawWallet' size={32} />
                <Text
                    color='prominent'
                    weight='bold'
                    align='center'
                    className='withdrawal-crypto-receipt__account-info-detail-text'
                >
                    <Localize
                        i18n_default_text='{{account_text}} wallet'
                        values={{
                            account_text: text,
                        }}
                    />
                </Text>
            </div>
            <div className='withdrawal-crypto-receipt__account-info-address'>
                <Text
                    color='less-prominent'
                    as='p'
                    size={is_mobile ? 'xxs' : 'xs'}
                    align='center'
                    className='withdrawal-crypto-receipt__account-info-detail-text'
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
};

const WithdrawalCryptoReceipt = observer(() => {
    const { client } = useStore();
    const { currency, is_switching } = client;
    const { isMobile } = useDevice();
    const { account_transfer, general_store, transaction_history, withdraw } = useCashierStore();
    const { selected_from: account } = account_transfer;
    const { cashier_route_tab_index: tab_index } = general_store;
    const { setIsTransactionsCryptoVisible } = transaction_history;

    const { blockchain_address, resetWithdrawForm, setIsWithdrawConfirmed, withdraw_amount, crypto_estimations_fee } =
        withdraw;

    const { last_transaction } = useCryptoTransactions();
    const currency_config = useCurrentCurrencyConfig();

    React.useEffect(() => {
        return () => {
            setIsWithdrawConfirmed(false);
            resetWithdrawForm();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [is_switching, tab_index]);

    return (
        <div className='withdrawal-crypto-receipt__wrapper'>
            <Text as='h2' color='prominent' weight='bold' align='center' className='cashier__header'>
                <Localize i18n_default_text='Your withdrawal will be processed within 24 hours' />
            </Text>
            <div className='withdrawal-crypto-receipt__detail'>
                {<Status last_transaction={last_transaction} />}
                <Text
                    as='p'
                    color='profit-success'
                    weight='bold'
                    align='center'
                    size={isMobile ? 'm' : 'l'}
                    className='withdrawal-crypto-receipt__crypto'
                >
                    <Localize
                        i18n_default_text='{{withdraw_amount}} {{currency_symbol}}'
                        values={{
                            withdraw_amount,
                            currency_symbol: currency?.toUpperCase(),
                        }}
                    />
                </Text>
                <AccountInformation account={account} is_mobile={isMobile} />
                <Icon className='withdrawal-crypto-receipt__icon' icon='IcArrowDown' size={30} />
                <WalletInformation account={account} blockchain_address={blockchain_address} is_mobile={isMobile} />
            </div>
            {!!crypto_estimations_fee && (
                <div className='withdrawal-crypto-receipt__transfer-fee-info'>
                    <Text as='p' align='center' size={isMobile ? 'xxxs' : 'xxs'}>
                        <Localize i18n_default_text='Amount received' />
                    </Text>
                    <Text as='p' align='center' size={isMobile ? 'xsm' : 'm'} weight='bold'>
                        <Localize
                            i18n_default_text='{{transaction_amount}} {{currency_symbol}}'
                            values={{
                                transaction_amount: (Number(withdraw_amount) - Number(crypto_estimations_fee)).toFixed(
                                    currency_config?.fractional_digits
                                ),
                                currency_symbol: currency?.toUpperCase(),
                            }}
                        />
                    </Text>
                    <Text as='p' align='center' size={isMobile ? 'xxxs' : 'xxs'}>
                        <Localize
                            i18n_default_text='(Transaction fee: {{transaction_fee}} {{currency_symbol}})'
                            values={{
                                transaction_fee: Number(crypto_estimations_fee).toFixed(
                                    currency_config?.fractional_digits
                                ),
                                currency_symbol: currency?.toUpperCase(),
                            }}
                        />
                    </Text>
                </div>
            )}
            <div className='withdrawal-crypto-receipt__button-wrapper'>
                <Button
                    id='withdraw_transaction'
                    className='withdrawal-crypto-receipt__button withdrawal-crypto-receipt__button-left'
                    text={localize('View transaction history')}
                    onClick={() => setIsTransactionsCryptoVisible(true)}
                    secondary
                />
                <Button
                    id='withdrawal-crypto-receipt'
                    className='withdrawal-crypto-receipt__button'
                    has_effect
                    text={localize('Make a new withdrawal')}
                    onClick={() => setIsWithdrawConfirmed(false)}
                    primary
                />
            </div>
        </div>
    );
});

export default WithdrawalCryptoReceipt;

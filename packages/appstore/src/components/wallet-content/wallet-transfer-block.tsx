import React from 'react';
import CurrencySwitcherContainer from 'Components/containers/currency-switcher-container';
import { Button, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { formatMoney } from '@deriv/shared';
import { TWalletAccount } from 'Types';
import { observer, useStore } from '@deriv/stores';

type TProps = {
    wallet_account: TWalletAccount;
};

const WalletTransferBlock = observer(({ wallet_account }: TProps) => {
    const { traders_hub, ui, client } = useStore();
    const { setIsWalletModalVisible } = ui;
    const { setWalletModalActiveWalletID, setWalletModalActiveTab } = traders_hub;
    const { accounts } = client;

    const { linked_to } = wallet_account;

    const trading_account_loginid = linked_to?.find(account => account.platform === 'dtrade')?.loginid ?? '';
    const currency = accounts?.[trading_account_loginid]?.currency ?? wallet_account.currency;
    const balance = accounts?.[trading_account_loginid]?.balance ?? 0;

    return (
        <CurrencySwitcherContainer
            title={null}
            icon={'Options'}
            actions={
                <Button
                    onClick={() => {
                        setWalletModalActiveTab('Transfer');
                        setIsWalletModalVisible(true);
                        setWalletModalActiveWalletID(wallet_account.loginid);
                    }}
                    secondary
                    className='currency-switcher__button'
                >
                    {localize('Transfer')}
                </Button>
            }
            has_interaction
            show_dropdown={false}
        >
            <React.Fragment>
                <Text weight='bold' size='xs' color='prominent'>
                    {formatMoney(currency, balance, true)} {currency}
                </Text>
                <Text size='xxs' color='less-prominent'>
                    {trading_account_loginid}
                </Text>
            </React.Fragment>
        </CurrencySwitcherContainer>
    );
});
export default WalletTransferBlock;

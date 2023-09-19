import React from 'react';
import { Button, Text } from '@deriv/components';
import { formatMoney } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { useTradingAccountsList } from '@deriv/hooks';
import { Localize } from '@deriv/translations';
import CurrencySwitcherContainer from 'Components/containers/currency-switcher-container';
import { TWalletAccount } from 'Types';

type TProps = {
    wallet_account: TWalletAccount;
};

const WalletTransferBlock = observer(({ wallet_account }: TProps) => {
    const { traders_hub, ui } = useStore();
    const { setIsWalletModalVisible } = ui;
    const { setWalletModalActiveWalletID, setWalletModalActiveTab } = traders_hub;
    const { data: trading_accounts } = useTradingAccountsList();

    const trading_account_loginid =
        wallet_account.linked_to?.find(account => account.platform === 'dtrade')?.loginid ?? '';
    const linked_trading_account = trading_accounts?.find(account => account.loginid === trading_account_loginid);

    const currency = linked_trading_account?.currency ?? wallet_account.currency;
    const balance = linked_trading_account?.balance ?? 0;

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
                    <Localize i18n_default_text='Transfer' />
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

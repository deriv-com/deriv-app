import React from 'react';
import { useHistory } from 'react-router';
import CurrencySwitcherContainer from 'Components/containers/currency-switcher-container';
import { Button, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { routes, formatMoney } from '@deriv/shared';
import { TCoreStores } from '@deriv/stores/types';
import { number } from 'prop-types';

type TWalletTransferBlock = {
    wallet_account: TCoreStores['client']['accounts'][0];
};

type TWalletBalanceAndLoginid = {
    currency: string;
    balance: string | number;
    loginid: string;
};

export const WalletBalanceAndLoginid = ({ currency, balance, loginid }: TWalletBalanceAndLoginid) => (
    <React.Fragment>
        <Text weight='bold' size='xs' color='prominent'>
            {balance} {currency}
        </Text>
        <Text size='xxs' color='less-prominent'>
            {loginid}
        </Text>
    </React.Fragment>
);

const WalletTransferBlock = ({ wallet_account }: TWalletTransferBlock) => {
    const history = useHistory();
    const { currency, balance, loginid } = wallet_account;

    return (
        <CurrencySwitcherContainer
            title={null}
            icon={'Options'}
            actions={
                <Button
                    onClick={(e: MouseEvent) => {
                        e.stopPropagation();
                        history.push(routes.cashier_acc_transfer);
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
            <WalletBalanceAndLoginid
                currency={currency || 'USD'}
                balance={formatMoney(currency, balance, true)}
                loginid={loginid || ''}
            />
        </CurrencySwitcherContainer>
    );
};
export default WalletTransferBlock;

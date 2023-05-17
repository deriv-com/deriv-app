import React from 'react';
import { useHistory } from 'react-router';
import CurrencySwitcherContainer from 'Components/containers/currency-switcher-container';
import { Button, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { routes, formatMoney } from '@deriv/shared';
import { TCoreStores } from '@deriv/stores/types';

type TProps = {
    wallet_account: TCoreStores['client']['accounts'][0];
};

const WalletTransferBlock = ({ wallet_account }: TProps) => {
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
            <React.Fragment>
                <Text weight='bold' size='xs' color='prominent'>
                    {formatMoney(currency, balance, true)} {currency}
                </Text>
                <Text size='xxs' color='less-prominent'>
                    {loginid}
                </Text>
            </React.Fragment>
        </CurrencySwitcherContainer>
    );
};
export default WalletTransferBlock;

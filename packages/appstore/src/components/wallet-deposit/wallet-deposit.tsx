import React from 'react';
import { useCurrencyConfig } from '@deriv/hooks';
import { useStore, observer } from '@deriv/stores';
import { Div100vhContainer } from '@deriv/components';
import DepositFiatIframe from '@deriv/cashier/src/modules/deposit-fiat/components/deposit-fiat-iframe/deposit-fiat-iframe';
import './wallet-deposit.scss';

const WalletDeposit = observer(() => {
    const { client, ui } = useStore();
    const { is_mobile } = ui;
    const { currency, loginid } = client;

    const { getConfig } = useCurrencyConfig();
    const currency_config = getConfig(currency);
    const is_crypto = currency_config?.is_crypto;

    //TODO: remove when selected wallet will be provided to WalletDeposit props
    const real_fiat_wallet = loginid?.startsWith('CRW') && !is_crypto;

    return real_fiat_wallet ? (
        <Div100vhContainer height_offset={is_mobile ? '14rem' : '26.8rem'} className='wallet-deposit__fiat-container'>
            <DepositFiatIframe />
        </Div100vhContainer>
    ) : (
        <div> Deposit Development Is In Progress</div>
    );
});

export default WalletDeposit;

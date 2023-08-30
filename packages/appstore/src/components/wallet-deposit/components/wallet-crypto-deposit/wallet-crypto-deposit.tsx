import React from 'react';
import { Divider } from '@deriv/components';
import { useStore, observer } from '@deriv/stores';
import DepositCryptoCurrencyDetails from '@deriv/cashier/src/modules/deposit-crypto/components/deposit-crypto-currency-details/deposit-crypto-currency-details';
import DepositCryptoSideNotes from '@deriv/cashier/src/modules/deposit-crypto/components/deposit-crypto-side-notes/deposit-crypto-side-notes';
import DepositCryptoSideNoteTryFiatOnRamp from '@deriv/cashier/src/modules/deposit-crypto/components/deposit-crypto-side-notes/deposit-crypto-side-note-try-fiat-onramp';
import DepositCryptoWalletAddress from '@deriv/cashier/src/modules/deposit-crypto/components/deposit-crypto-wallet-address/deposit-crypto-wallet-address';

const WalletCryptoDeposit = observer(() => {
    const { ui } = useStore();
    const { is_mobile } = ui;

    return (
        <div className='wallet-deposit__crypto-container'>
            <div className='crypto-container__details-container'>
                <DepositCryptoCurrencyDetails />
                <DepositCryptoWalletAddress />
                {is_mobile && (
                    <>
                        <Divider />
                        <DepositCryptoSideNotes />
                        <Divider />
                    </>
                )}

                {/* This should be in the side notes, Need to talk to the design team to change it */}
                <div className='details-container__onramp-side-note'>
                    <DepositCryptoSideNoteTryFiatOnRamp />
                </div>
            </div>
            {!is_mobile && (
                <div className='crypto-container__side-notes-container'>
                    <DepositCryptoSideNotes />
                </div>
            )}
        </div>
    );
});

export default WalletCryptoDeposit;

import React from 'react';
import { Divider } from '@deriv/components';
import DepositCryptoCurrencyDetails from '@deriv/cashier/src/modules/deposit-crypto/components/deposit-crypto-currency-details/deposit-crypto-currency-details';
import DepositCryptoWalletAddress from '@deriv/cashier/src/modules/deposit-crypto/components/deposit-crypto-wallet-address/deposit-crypto-wallet-address';
import DepositCryptoSideNoteTryFiatOnRamp from '@deriv/cashier/src/modules/deposit-crypto/components/deposit-crypto-side-notes/deposit-crypto-side-note-try-fiat-onramp';
import DepositCryptoSideNotes from '@deriv/cashier/src/modules/deposit-crypto/components/deposit-crypto-side-notes/deposit-crypto-side-notes';

type TWalletCryptoDeposit = {
    is_mobile: boolean;
};

const WalletCryptoDeposit = ({ is_mobile }: TWalletCryptoDeposit) => {
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
                <div style={{ alignSelf: is_mobile ? 'unset' : 'center' }}>
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
};

export default WalletCryptoDeposit;

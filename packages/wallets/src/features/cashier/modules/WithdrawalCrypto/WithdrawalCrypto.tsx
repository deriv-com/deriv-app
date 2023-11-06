import React from 'react';
import {
    InlineMessage,
    WalletButton,
    WalletsPercentageSelector,
    WalletText,
    WalletTextField,
} from '../../../../components';
import './WithdrawalCrypto.scss';
import { WithdrawalCryptoAmountConverter } from './components';
import { useActiveWalletAccount } from '@deriv/api';

const WithdrawalCrypto = () => {
    const { data: activeWallet } = useActiveWalletAccount();
    return (
        <div className='wallets-withdrawal-crypto'>
            <WalletText weight='bold'>Withdraw Bitcoin (BTC) to your wallet</WalletText>
            <div className='wallets-withdrawal-crypto-disclaimer'>
                <InlineMessage>
                    <ul className='wallets-withdrawal-crypto-disclaimer__items'>
                        <li>
                            Do not enter an address linked to an initial coin offering (ICO) purchase or crowdsale. If
                            you do, the initial coin offering (ICO) tokens will not be credited into your account.
                        </li>
                        <li>
                            Please note that your maximum and minimum withdrawal limits aren’t fixed. They change due to
                            the high volatility of cryptocurrency.
                        </li>
                    </ul>
                </InlineMessage>
            </div>
            <div className='wallets-withdrawal-crypto-address'>
                <WalletTextField label='Your BTC Wallet address' name='wallets-withdrawal-crypto-address-textfield' />
            </div>
            <WalletsPercentageSelector
                amount={200}
                balance={activeWallet?.balance}
                // onChangePercentage={per => console.log(per)}
            />
            <WithdrawalCryptoAmountConverter />
            <div className='wallets-withdrawal-crypto__submit'>
                <WalletButton size='lg' text='Withdraw' />
            </div>
        </div>
    );
};

export default WithdrawalCrypto;

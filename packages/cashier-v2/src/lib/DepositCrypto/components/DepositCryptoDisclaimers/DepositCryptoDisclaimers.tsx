import React from 'react';
import { useActiveAccount, useCryptoConfig } from '@deriv/api-v2';
import { InlineMessage, Text } from '@deriv-com/ui';
import styles from './DepositCryptoDisclaimers.module.scss';

// Check with BE to see if we can get the network name from the API.
const cryptoCurrencyToNetworkMapper: Record<string, string> = {
    BTC: 'Bitcoin (BTC)',
    ETH: 'Ethereum (ETH)',
    eUSDT: 'Ethereum (ERC20) ',
    LTC: 'Litecoin (LTC)',
    tUSDT: 'Tron (TRC20) ',
    USDC: 'Ethereum (ERC20)',
    UST: 'Omnicore',
};

const DepositCryptoDisclaimers = () => {
    const { data: activeAccount } = useActiveAccount();
    const { currency } = activeAccount ?? {};
    const { data: cryptoConfig } = useCryptoConfig();
    const formattedMinimumDepositValue = cryptoConfig?.minimum_deposit?.toFixed(
        activeAccount?.currency_config?.fractional_digits
    );

    const minimumDepositDisclaimer = activeAccount?.currency_config?.is_tUSDT ? (
        <Text as='li' size='2xs'>
            A minimum deposit value of <strong>{formattedMinimumDepositValue}</strong> {currency} is required.
            Otherwise, a fee is applied.
        </Text>
    ) : (
        <Text as='li' size='2xs'>
            A minimum deposit value of <strong>{formattedMinimumDepositValue}</strong> {currency} is required.
            Otherwise, the funds will be lost and cannot be recovered.
        </Text>
    );

    return (
        <div className={styles.container}>
            <InlineMessage type='filled' variant='warning'>
                <div className={styles.content}>
                    <Text size='2xs' weight='bold'>
                        To avoid loss of funds:
                    </Text>
                    <ul className={styles.points}>
                        {cryptoConfig?.minimum_deposit && minimumDepositDisclaimer}
                        <Text as='li' size='2xs'>
                            Do not send other cryptocurrencies to this address.
                        </Text>
                        <Text as='li' size='2xs'>
                            Make sure to copy your Deriv account address correctly into your crypto wallet.
                        </Text>
                        <Text as='li' size='2xs'>
                            In your cryptocurrency wallet, make sure to select{' '}
                            <strong>{currency && cryptoCurrencyToNetworkMapper[currency]} network</strong> when you
                            transfer funds to Deriv.
                        </Text>
                    </ul>
                </div>
            </InlineMessage>
            <div className={styles.note}>
                <Text size='xs' weight='bold'>
                    Note:
                </Text>
                <Text size='xs'>&nbsp;You’ll receive an email when your deposit starts being processed.</Text>
            </div>
        </div>
    );
};

export default DepositCryptoDisclaimers;

import React from 'react';
import { Button, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';

const WalletBanner: React.FC = () => {
    return (
        <div className='wallet-banner'>
            <div className='wallet-banner--column'>
                <Text align='center' className='wallet-banner--text' color='prominent' size='s' weight='bold'>
                    <Localize i18n_default_text='Activate your first wallet to start trading' />
                </Text>
                <Button className='wallet-banner--button' medium>
                    <Text color='colored-background' size='xs' weight='bold'>
                        <Localize i18n_default_text='Get a Wallet' />
                    </Text>
                </Button>
            </div>
        </div>
    );
};

export default WalletBanner;

import React from 'react';
import { Button, Icon, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';

const GetMoreWalletCard: React.FC = () => {
    return (
        <div className='get-more-wallet-card'>
            <div className='get-more-wallet-card--column'>
                <Button className='get-more-wallet-card--button'>
                    <Icon icon='IcAddRounded' custom_color='var(--icon-dark-background)' size={24} />
                </Button>
                <Text color='prominent' size='xs' weight='bold'>
                    <Localize i18n_default_text='Get more wallets' />
                </Text>
            </div>
        </div>
    );
};

export default GetMoreWalletCard;

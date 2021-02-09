import React from 'react';
import { Button, Icon, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';

const AddWallet: React.FC = () => {
    return (
        <div className='add-wallet'>
            <div className='add-wallet__column'>
                <Button className='add-wallet__button'>
                    <Icon icon='IcAddRounded' custom_color='var(--icon-dark-background)' size={24} />
                </Button>
                <Text color='prominent' size='xs' weight='bold'>
                    <Localize i18n_default_text='Get more wallets' />
                </Text>
            </div>
        </div>
    );
};

export default AddWallet;

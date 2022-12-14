import { Button, Text } from '@deriv/components';
import CurrencyIcon from 'Assets/svgs/currency';
import React from 'react';
import './selected-account-card.scss';

const SelectedAccountCard = () => {
    return (
        <div className='selected-account-card'>
            <CurrencyIcon icon='USD' className='selected-account-card__icon' size={32} />
            <div className='selected-account-card__content'>
                <Text size='xs' line_height='s'>
                    US Dollar
                </Text>
                <Text size='xs' line_height='s' weight='bold'>
                    0.00 USD
                </Text>
            </div>
            <Button secondary>Deposit</Button>
        </div>
    );
};

export default SelectedAccountCard;

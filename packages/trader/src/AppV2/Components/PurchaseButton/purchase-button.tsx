import React from 'react';
import { Button } from '@deriv-com/quill-ui';
import { Localize, localize } from '@deriv/translations';

// TODO: add Text component from Quill UI when it will support sm size with font-size 12px
const PurchaseButton = () => (
    <div className='purchase-button__wrapper'>
        <Button
            color='purchase'
            size='lg'
            label={<Localize i18n_default_text='Rise' />}
            fullWidth
            className='purchase-button'
        >
            <p className='purchase-button__payout'>
                <span>{localize('Payout')}</span>
                <span>19.55 USD</span>
            </p>
        </Button>
        <Button
            color='sell'
            size='lg'
            label={<Localize i18n_default_text='Fall' />}
            fullWidth
            className='purchase-button'
        >
            <p className='purchase-button__payout'>
                <span>19.55 USD</span>
                <span>{localize('Payout')}</span>
            </p>
        </Button>
    </div>
);

export default PurchaseButton;

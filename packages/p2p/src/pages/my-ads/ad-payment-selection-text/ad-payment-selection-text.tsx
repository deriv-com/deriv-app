import React from 'react';
import { Text } from '@deriv/components';
import { Localize } from 'Components/i18next';

type TAdPaymentSelectionTextProps = {
    is_sell_advert: boolean;
};

const AdPaymentSelectionText = ({ is_sell_advert }: TAdPaymentSelectionTextProps) => {
    return (
        <div className='ad-payment-selection-text'>
            <Text color='prominent'>
                <Localize i18n_default_text='Payment methods' />
            </Text>
            <Text color='less-prominent'>
                {is_sell_advert ? (
                    <Localize i18n_default_text='You may tap and choose up to 3.' />
                ) : (
                    <Localize i18n_default_text='You may choose up to 3.' />
                )}
            </Text>
        </div>
    );
};

export default AdPaymentSelectionText;

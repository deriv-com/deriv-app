import React from 'react';
import { Text } from '@deriv/components';
import { getFormattedText } from '@deriv/shared';
import { Localize } from 'Components/i18next';
import { roundOffDecimal } from 'Utils/format-value';
import { useStores } from 'Stores';

const BuySellFormReceiveAmount = () => {
    const { buy_sell_store } = useStores();
    const { advert, is_sell_advert, receive_amount } = buy_sell_store;

    return (
        <div className='buy-sell-form__receive-amount'>
            <Text as='p' color='less-prominent' size='xxs'>
                {is_sell_advert ? (
                    <Localize i18n_default_text="You'll receive" />
                ) : (
                    <Localize i18n_default_text="You'll send" />
                )}
            </Text>
            <Text as='p' size='xs' weight='bold'>
                {getFormattedText(roundOffDecimal(receive_amount), advert?.local_currency)}
            </Text>
        </div>
    );
};

export default BuySellFormReceiveAmount;
